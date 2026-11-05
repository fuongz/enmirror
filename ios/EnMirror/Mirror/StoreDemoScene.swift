#if DEBUG
    import SwiftUI

    /// Debug builds only: puts the mirror in the state one App Store screenshot shows. Settings the
    /// mirror keeps in `@AppStorage` are written here too, so every scene starts from the same place.
    struct StoreDemoScene: ViewModifier {
        let camera: CameraService
        @Binding var panel: ToolPanel?
        @Binding var pinned: FrozenPhoto?
        let freeze: () -> Void

        @AppStorage(SettingsKey.lightOn) private var lightOn = false
        @AppStorage(SettingsKey.lightTone) private var lightTone = RingLight.defaultTone
        @AppStorage(SettingsKey.lightSize) private var lightSize = RingLight.defaultSize
        @AppStorage(SettingsKey.guide) private var guide = Guide.off
        @AppStorage(SettingsKey.asOthersSee) private var asOthersSee = false

        func body(content: Content) -> some View {
            content.task {
                guard let scene = StoreDemo.scene else { return }
                // Let the camera service report "running" before the controls are used.
                try? await Task.sleep(for: .seconds(1))
                stage(scene)
            }
        }

        private func stage(_ scene: StoreDemo.Scene) {
            asOthersSee = false
            lightTone = 0.35
            lightSize = 0.45
            lightOn = [.light, .freeze, .guide].contains(scene)
            guide = scene == .guide ? .oval : .off
            camera.setZoom(1)
            switch scene {
            case .light:
                panel = .light
            case .zoom:
                camera.setZoom(2)
                panel = .zoom
            case .freeze:
                freeze()
            case .delay:
                camera.setDelay(3)
            case .guide:
                break
            case .pin:
                camera.setZoom(1.6)
                if let data = StoreDemo.photoData, let image = StoreDemo.image {
                    pinned = FrozenPhoto(data: data, image: image)
                }
            }
        }
    }
#endif
