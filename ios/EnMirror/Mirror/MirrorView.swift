import AVKit
import SwiftUI

struct MirrorView: View {
    @State private var camera = CameraService()
    @State private var launch = MirrorLaunch.shared
    @Environment(\.scenePhase) private var scenePhase

    @AppStorage(SettingsKey.asOthersSee) private var asOthersSee = false
    @AppStorage(SettingsKey.lightOn) private var lightOn = false
    @AppStorage(SettingsKey.lightTone) private var lightTone = RingLight.defaultTone
    @AppStorage(SettingsKey.lightSize) private var lightSize = RingLight.defaultSize
    @AppStorage(SettingsKey.guide) private var guide = Guide.off

    @State private var panel: ToolPanel?
    @State private var frozen: FrozenPhoto?
    /// Kept in memory only: closing the app forgets it.
    @State private var pinned: FrozenPhoto?
    // periphery:ignore - passed to PinnedPhotoView as a binding.
    @State private var pinCorner = PinCorner.topTrailing
    @State private var isCapturing = false
    @State private var selfTimer = SelfTimerCountdown()
    @State private var toast = MirrorToast()
    // Debug builds open the About sheet at launch with `-showAbout`, for simulator screenshots.
    #if DEBUG
        @State private var showsAbout = ProcessInfo.processInfo.arguments.contains("-showAbout")
    #else
        @State private var showsAbout = false
    #endif

    var body: some View {
        ZStack {
            GeometryReader { proxy in
                ZStack {
                    lightColor
                    surface
                        // Inside the ring light's inset and outside the flip: the guide follows the
                        // mirror's size and its centre line stays in the middle either way.
                        .overlay { GuideOverlay(guide: guide) }
                        .clipShape(.rect(cornerRadius: lightOn ? 36 : 0, style: .continuous))
                        .padding(lightOn ? RingLight.inset(size: lightSize, in: proxy.size) : 0)
                }
            }
            .ignoresSafeArea()

            // Under the buttons, so it never covers a control.
            if let pinned, frozen == nil {
                PinnedPhotoView(
                    photo: pinned,
                    flipped: pinned.asOthersSee != asOthersSee,
                    corner: $pinCorner,
                    onOpen: {
                        selfTimer.cancel()
                        frozen = pinned
                    },
                    onUnpin: { self.pinned = nil }
                )
                .transition(.scale(scale: 0.6).combined(with: .opacity))
            }

            if let remaining = selfTimer.remaining {
                CountdownNumber(value: remaining)
            }

            VStack {
                topBar
                Spacer()
                controls
            }
            .padding(.bottom, 8)
        }
        .animation(.smooth(duration: 0.35), value: lightOn)
        .animation(.smooth(duration: 0.2), value: lightSize)
        .animation(.snappy, value: panel)
        .animation(.snappy, value: frozen?.id)
        .animation(.snappy, value: pinned?.id)
        .animation(.snappy, value: toast.current)
        .statusBarHidden()
        .persistentSystemOverlays(.hidden)
        .sensoryFeedback(.impact(weight: .medium), trigger: frozen?.id)
        .sensoryFeedback(.success, trigger: camera.delayStarts)
        .sensoryFeedback(.impact(weight: .light), trigger: selfTimer.remaining) { _, new in new != nil }
        .animation(.snappy, value: camera.delay)
        .onChange(of: scenePhase, initial: true) { _, phase in handle(phase) }
        .onChange(of: lightOn) { updateScreenLight() }
        .onChange(of: launch.request, initial: true) { _, request in open(request) }
        .sheet(isPresented: $showsAbout) { AboutSheet() }
        // Volume buttons and Camera Control act as the shutter; the photo output plays its own sound.
        .onCameraCaptureEvent(isEnabled: camera.status == .running && !showsAbout, defaultSoundDisabled: true) { event in
            if event.phase == .ended { hardwareShutter() }
        }
    }

    /// The toast in the centre, About in the top-left corner and the guide in the top-right
    /// (live mirror only).
    private var topBar: some View {
        // The row spans the screen even with no toast; an empty toast has no width, which used to
        // leave the ZStack as narrow as the button and the VStack centred it.
        ZStack(alignment: .top) {
            if frozen == nil {
                GlassCircleButton(label: "About enMirror", diameter: 44, action: openAbout) {
                    Image(systemName: "info")
                }
                .padding(.leading, 20)
                .frame(maxWidth: .infinity, alignment: .leading)

                MirrorTopControls(camera: camera, guide: $guide, onChange: showToast)
                    .padding(.trailing, 20)
                    .frame(maxWidth: .infinity, alignment: .trailing)
            }
            MirrorToastView(message: toast.current)
        }
        .frame(maxWidth: .infinity)
    }

    // MARK: - Mirror surface

    private var lightColor: Color {
        guard lightOn else { return .black }
        let rgb = RingLight.rgb(tone: lightTone)
        return Color(red: rgb.red, green: rgb.green, blue: rgb.blue)
    }

    @ViewBuilder
    private var surface: some View {
        if let frozen {
            FrozenPhotoView(image: frozen.image)
                .id(frozen.id)
                .transition(.opacity)
        } else {
            LivePreview(camera: camera, asOthersSee: asOthersSee)
        }
    }

    // MARK: - Controls

    @ViewBuilder
    private var controls: some View {
        VStack(spacing: 12) {
            if let frozen {
                PhotoActionsBar(
                    photo: frozen,
                    isPinned: frozen.id == pinned?.id,
                    onSave: save,
                    onPin: pin,
                    onDelete: { self.frozen = nil }
                )
            } else {
                if let panel {
                    ToolPanelView(panel: panel, camera: camera, lightTone: $lightTone, lightSize: $lightSize)
                        .transition(.move(edge: .bottom).combined(with: .opacity))
                }
                liveBar
            }
        }
        .padding(.horizontal, 20)
    }

    private var liveBar: some View {
        GlassEffectContainer(spacing: 14) {
            HStack(spacing: 14) {
                GlassCircleButton(label: "Light", isActive: lightOn, action: toggleLight) {
                    Image(systemName: lightOn ? "lightbulb.max.fill" : "lightbulb")
                }
                GlassCircleButton(label: "Exposure", isActive: panel == .exposure, action: { toggle(.exposure) }) {
                    Image(systemName: "sun.max")
                }
                .disabled(!camera.canAdjustExposure)

                ShutterButton(
                    isBusy: isCapturing,
                    timer: selfTimer.timer,
                    isCounting: selfTimer.isCounting,
                    onTimerChange: { selfTimer.timer = $0 },
                    action: shutter
                )
                // Nothing to capture until the delayed mirror shows its first old frame.
                .disabled(camera.isDelayFilling)

                GlassCircleButton(label: "Zoom", isActive: panel == .zoom, action: { toggle(.zoom) }) {
                    Text(verbatim: camera.zoomText)
                        .font(.system(size: 15, weight: .bold).monospacedDigit())
                }
                .disabled(!camera.canZoom)

                GlassCircleButton(label: "As others see you", isActive: asOthersSee, action: flip) {
                    Image(systemName: "arrow.left.and.right.righttriangle.left.righttriangle.right")
                }
            }
        }
        .disabled(camera.status != .running)
    }

    // MARK: - Actions

    private func toggle(_ target: ToolPanel) {
        panel = panel == target ? nil : target
    }

    private func toggleLight() {
        lightOn.toggle()
        panel = lightOn ? .light : (panel == .light ? nil : panel)
    }

    /// A control, widget, Siri, Spotlight or quick action asked for the live mirror: clear
    /// whatever covers it, then apply the mode.
    private func open(_ request: MirrorLaunch.Request?) {
        guard let request else { return }
        selfTimer.cancel()
        showsAbout = false
        frozen = nil
        switch request.mode {
        case .mirror:
            break
        case .light:
            if !lightOn { toggleLight() }
        case .delayed:
            camera.setDelay(3)
            showToast(MirrorDelay.name(3))
        case .asOthersSee:
            if !asOthersSee { flip() }
        case .guide:
            if guide == .off {
                guide = .centerLine
                showToast(guide.name)
            }
        }
    }

    private func flip() {
        asOthersSee.toggle()
        showToast(asOthersSee ? "As others see you" : "Mirror view")
    }

    private func openAbout() {
        selfTimer.cancel()
        showsAbout = true
    }

    private func freeze() {
        guard !isCapturing, frozen == nil, camera.status == .running else { return }
        isCapturing = true
        // Preview is mirrored unless the user flipped it, so the still matches what they saw.
        let mirrored = !asOthersSee
        Task {
            defer { isCapturing = false }
            do {
                let data = try await camera.capturePhoto(mirrored: mirrored)
                guard let image = UIImage(data: data) else { throw CaptureEngine.CaptureError.noData }
                panel = nil
                frozen = FrozenPhoto(data: data, image: image, asOthersSee: !mirrored)
            } catch {
                showToast("Couldn't capture a photo")
            }
        }
    }

    /// A hardware button: the shutter on the live mirror, or back to it from a frozen photo (unsaved).
    private func hardwareShutter() {
        if frozen != nil {
            frozen = nil
        } else {
            shutter()
        }
    }

    /// Captures now, starts the self-timer, or cancels a running countdown.
    private func shutter() {
        selfTimer.press(capture: freeze)
    }

    /// Floats the frozen photo over the live mirror, to compare before and after.
    private func pin() {
        pinned = frozen
        frozen = nil
        showToast("Pinned. Tap it to look closer.")
    }

    private func save() {
        guard let data = frozen?.data else { return }
        Task {
            do {
                try await PhotoLibrary.save(data)
                showToast("Saved to Photos")
            } catch PhotoLibrary.SaveError.denied {
                showToast("Allow Photos access in Settings to save")
            } catch {
                showToast("Couldn't save the photo")
            }
        }
    }

    private func showToast(_ message: LocalizedStringResource) {
        toast.show(message)
    }

    private func handle(_ phase: ScenePhase) {
        switch phase {
        case .active:
            UIApplication.shared.isIdleTimerDisabled = true
            Task { await camera.start() }
        case .background:
            selfTimer.cancel()
            camera.stop()
            UIApplication.shared.isIdleTimerDisabled = false
        default:
            break
        }
        updateScreenLight()
    }

    private func updateScreenLight() {
        ScreenLight.shared.setBoosted(lightOn && scenePhase == .active)
    }
}
