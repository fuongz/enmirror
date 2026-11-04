import SwiftUI

struct MirrorView: View {
    private enum ToolPanel {
        case zoom, exposure, light
    }

    private struct Toast: Equatable {
        let id = UUID()
        let message: LocalizedStringResource

        static func == (lhs: Toast, rhs: Toast) -> Bool { lhs.id == rhs.id }
    }

    @State private var camera = CameraService()
    @Environment(\.scenePhase) private var scenePhase
    @Environment(\.openURL) private var openURL

    @AppStorage(SettingsKey.asOthersSee) private var asOthersSee = false
    @AppStorage(SettingsKey.lightOn) private var lightOn = false
    @AppStorage(SettingsKey.lightTone) private var lightTone = RingLight.defaultTone
    @AppStorage(SettingsKey.lightSize) private var lightSize = RingLight.defaultSize

    @State private var panel: ToolPanel?
    @State private var pinchBase: CGFloat?
    @State private var frozen: FrozenPhoto?
    @State private var isCapturing = false
    @State private var toast: Toast?
    @State private var focusMark: FocusMark?

    /// Where the last tap landed, in the preview's own (unflipped) coordinates.
    private struct FocusMark: Equatable {
        let id = UUID()
        let point: CGPoint
    }

    var body: some View {
        ZStack {
            GeometryReader { proxy in
                ZStack {
                    lightColor
                    surface
                        .clipShape(.rect(cornerRadius: lightOn ? 36 : 0, style: .continuous))
                        .padding(lightOn ? RingLight.inset(size: lightSize, in: proxy.size) : 0)
                }
            }
            .ignoresSafeArea()

            VStack {
                toastView
                Spacer()
                controls
            }
            .padding(.bottom, 8)
        }
        .animation(.smooth(duration: 0.35), value: lightOn)
        .animation(.smooth(duration: 0.2), value: lightSize)
        .animation(.snappy, value: panel)
        .animation(.snappy, value: frozen?.id)
        .animation(.snappy, value: toast)
        .animation(.easeOut(duration: 0.3), value: focusMark)
        .statusBarHidden()
        .persistentSystemOverlays(.hidden)
        .sensoryFeedback(.impact(weight: .medium), trigger: frozen?.id)
        .onChange(of: scenePhase, initial: true) { _, phase in handle(phase) }
        .onChange(of: lightOn) { updateScreenLight() }
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
            livePreview
        }
    }

    @ViewBuilder
    private var livePreview: some View {
        ZStack {
            Color.black
            switch camera.status {
            case .starting, .running:
                CameraPreview(
                    session: camera.session,
                    onTap: { viewPoint, devicePoint in
                        camera.meter(at: devicePoint)
                        focusMark = FocusMark(point: viewPoint)
                    },
                    onDoubleTap: { camera.setZoom(camera.zoomRange.lowerBound) }
                )
                // Inside the flip, so the square lands where the finger did.
                .overlay(alignment: .topLeading) { focusSquare }
                // The front-camera preview is mirrored by default; flip it back to show the true view.
                .scaleEffect(x: asOthersSee ? -1 : 1, y: 1)
                .gesture(pinchToZoom)
                .accessibilityLabel(Text("Mirror"))
            case .denied:
                ContentUnavailableView {
                    Label("Camera access is off", systemImage: "camera.fill")
                } description: {
                    Text("Allow camera access for enMirror in Settings to use the mirror.")
                } actions: {
                    Button("Open Settings") {
                        if let url = URL(string: UIApplication.openSettingsURLString) { openURL(url) }
                    }
                    .buttonStyle(.glassProminent)
                }
            case .unavailable:
                ContentUnavailableView(
                    "No front camera",
                    systemImage: "video.slash",
                    description: Text("enMirror needs a device with a front camera.")
                )
            }
        }
    }

    @ViewBuilder
    private var focusSquare: some View {
        if let focusMark {
            FocusSquare()
                .id(focusMark.id)
                .position(focusMark.point)
                .task(id: focusMark.id) {
                    try? await Task.sleep(for: .seconds(1.2))
                    if self.focusMark == focusMark { self.focusMark = nil }
                }
        }
    }

    private var pinchToZoom: some Gesture {
        MagnifyGesture()
            .onChanged { value in
                let base = pinchBase ?? camera.zoom
                pinchBase = base
                camera.setZoom(
                    CameraMath.pinchedZoom(base: base, magnification: value.magnification, range: camera.zoomRange)
                )
            }
            .onEnded { _ in pinchBase = nil }
    }

    // MARK: - Controls

    @ViewBuilder
    private var controls: some View {
        VStack(spacing: 12) {
            if let frozen {
                PhotoActionsBar(photo: frozen, onSave: save, onDelete: { self.frozen = nil })
            } else {
                if let panel {
                    panelView(panel)
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

                ShutterButton(isBusy: isCapturing, action: freeze)

                GlassCircleButton(label: "Zoom", isActive: panel == .zoom, action: { toggle(.zoom) }) {
                    Text(verbatim: zoomText)
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

    @ViewBuilder
    private func panelView(_ panel: ToolPanel) -> some View {
        VStack(spacing: 16) {
            switch panel {
            case .zoom:
                SliderRow(
                    label: "Zoom",
                    minSymbol: "minus.magnifyingglass",
                    maxSymbol: "plus.magnifyingglass",
                    value: Binding(get: { Double(camera.zoom) }, set: { camera.setZoom(CGFloat($0)) }),
                    range: Double(camera.zoomRange.lowerBound)...Double(camera.zoomRange.upperBound),
                    valueText: zoomText
                )
            case .exposure:
                SliderRow(
                    label: "Exposure",
                    minSymbol: "sun.min",
                    maxSymbol: "sun.max.fill",
                    value: Binding(get: { Double(camera.exposureBias) }, set: { camera.setExposureBias(Float($0)) }),
                    range: Double(camera.biasRange.lowerBound)...Double(camera.biasRange.upperBound),
                    valueText: String(format: "%+.1f", camera.exposureBias)
                )
            case .light:
                SliderRow(label: "Light tone", minSymbol: "flame", maxSymbol: "snowflake", value: $lightTone, range: 0...1)
                SliderRow(label: "Light size", minSymbol: "light.min", maxSymbol: "light.max", value: $lightSize, range: 0...1)
            }
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 16)
        .glassEffect(.regular, in: .rect(cornerRadius: 28, style: .continuous))
    }

    @ViewBuilder
    private var toastView: some View {
        if let toast {
            Text(toast.message)
                .font(.subheadline.weight(.semibold))
                .padding(.horizontal, 18)
                .padding(.vertical, 10)
                .glassEffect(.regular, in: .capsule)
                .padding(.top, 8)
                .transition(.move(edge: .top).combined(with: .opacity))
        }
    }

    private var zoomText: String {
        Double(camera.zoom).formatted(.number.precision(.fractionLength(1))) + "×"
    }

    // MARK: - Actions

    private func toggle(_ target: ToolPanel) {
        panel = panel == target ? nil : target
    }

    private func toggleLight() {
        lightOn.toggle()
        panel = lightOn ? .light : (panel == .light ? nil : panel)
    }

    private func flip() {
        asOthersSee.toggle()
        showToast(asOthersSee ? "As others see you" : "Mirror view")
    }

    private func freeze() {
        guard !isCapturing else { return }
        isCapturing = true
        // Preview is mirrored unless the user flipped it, so the still matches what they saw.
        let mirrored = !asOthersSee
        Task {
            defer { isCapturing = false }
            do {
                let data = try await camera.capturePhoto(mirrored: mirrored)
                guard let image = UIImage(data: data) else { throw CaptureEngine.CaptureError.noData }
                panel = nil
                frozen = FrozenPhoto(data: data, image: image)
            } catch {
                showToast("Couldn't capture a photo")
            }
        }
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
        let next = Toast(message: message)
        toast = next
        Task {
            try? await Task.sleep(for: .seconds(1.6))
            if toast == next { toast = nil }
        }
    }

    private func handle(_ phase: ScenePhase) {
        switch phase {
        case .active:
            UIApplication.shared.isIdleTimerDisabled = true
            Task { await camera.start() }
        case .background:
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
