import SwiftUI

/// The glass card of sliders for the open `ToolPanel`.
struct ToolPanelView: View {
    let panel: ToolPanel
    let camera: CameraService
    @Binding var lightTone: Double
    @Binding var lightSize: Double

    var body: some View {
        VStack(spacing: 16) {
            switch panel {
            case .zoom:
                SliderRow(
                    label: "Zoom",
                    minSymbol: "minus.magnifyingglass",
                    maxSymbol: "plus.magnifyingglass",
                    value: Binding(get: { Double(camera.zoom) }, set: { camera.setZoom(CGFloat($0)) }),
                    range: Double(camera.zoomRange.lowerBound)...Double(camera.zoomRange.upperBound),
                    valueText: camera.zoomText
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
}
