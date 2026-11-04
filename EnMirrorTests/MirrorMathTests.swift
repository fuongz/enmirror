import CoreGraphics
import Testing

@testable import EnMirror

struct ZoomTests {
    @Test func zoomRangeCapsDigitalZoom() {
        #expect(CameraMath.zoomRange(deviceMin: 1, deviceMax: 135) == 1...CameraMath.maxUsefulZoom)
    }

    @Test func zoomRangeNeverDropsBelowOneOrInverts() {
        #expect(CameraMath.zoomRange(deviceMin: 0.5, deviceMax: 3) == 1...3)
        #expect(CameraMath.zoomRange(deviceMin: 1, deviceMax: 1) == 1...1)
    }

    @Test(arguments: [
        (base: 1.0, magnification: 2.0, expected: 2.0),
        (base: 2.0, magnification: 10.0, expected: 5.0),
        (base: 2.0, magnification: 0.1, expected: 1.0),
    ])
    func pinchClampsToRange(base: CGFloat, magnification: CGFloat, expected: CGFloat) {
        #expect(CameraMath.pinchedZoom(base: base, magnification: magnification, range: 1...5) == expected)
    }
}

struct ExposureTests {
    @Test func biasRangeIsLimitedToTwoStops() {
        #expect(CameraMath.biasRange(deviceMin: -8, deviceMax: 8) == -2...2)
    }

    @Test func biasRangeRespectsNarrowDevices() {
        #expect(CameraMath.biasRange(deviceMin: -1, deviceMax: 1.5) == -1...1.5)
        #expect(CameraMath.biasRange(deviceMin: 3, deviceMax: 4) == 0...0)
    }
}

struct PanTests {
    @Test func noPanAtNaturalSize() {
        let offset = PanMath.clampedOffset(CGSize(width: 50, height: -80), scale: 1, size: CGSize(width: 400, height: 800))
        #expect(offset == .zero)
    }

    @Test func panStopsAtImageEdge() {
        // At 2x, the image overhangs half the frame on each side.
        let offset = PanMath.clampedOffset(CGSize(width: 900, height: -900), scale: 2, size: CGSize(width: 400, height: 800))
        #expect(offset == CGSize(width: 200, height: -400))
    }
}

struct RingLightTests {
    @Test func toneMapsAcrossKelvinRange() {
        #expect(RingLight.kelvin(forTone: 0) == RingLight.warmKelvin)
        #expect(RingLight.kelvin(forTone: 1) == RingLight.coolKelvin)
        #expect(RingLight.kelvin(forTone: 7) == RingLight.coolKelvin)
    }

    @Test func coolEndIsNearWhite() {
        let rgb = RingLight.rgb(tone: 1)
        #expect(rgb.red > 0.97 && rgb.green > 0.97 && rgb.blue > 0.95)
    }

    @Test func warmEndIsAmber() {
        let rgb = RingLight.rgb(tone: 0)
        #expect(rgb.red == 1)
        #expect(rgb.red > rgb.green && rgb.green > rgb.blue)
        #expect(rgb.blue < 0.7)
    }

    @Test func componentsStayInUnitRange() {
        for kelvin in stride(from: 500.0, through: 50_000, by: 500) {
            let rgb = RingLight.rgb(kelvin: kelvin)
            for value in [rgb.red, rgb.green, rgb.blue] {
                #expect((0...1).contains(value))
            }
        }
    }

    @Test func insetScalesWithSizeAndShorterSide() {
        let phone = CGSize(width: 400, height: 900)
        #expect(RingLight.inset(size: 0, in: phone) == 20)
        #expect(RingLight.inset(size: 1, in: phone) == 64)
        #expect(RingLight.inset(size: 5, in: phone) == 64)
    }
}

struct SettingsTests {
    @Test func defaultsAreMidRange() {
        #expect((0...1).contains(RingLight.defaultTone))
        #expect((0...1).contains(RingLight.defaultSize))
    }

    @Test func keysAreUnique() {
        let keys = [SettingsKey.asOthersSee, SettingsKey.lightOn, SettingsKey.lightTone, SettingsKey.lightSize]
        #expect(Set(keys).count == keys.count)
    }
}

struct FormatTests {
    private typealias Candidate = CameraMath.FormatCandidate

    @Test func picksTheSharpestFormatThatKeeps30fps() {
        let formats = [
            Candidate(width: 1920, height: 1080, maxFrameRate: 60),
            Candidate(width: 4032, height: 3024, maxFrameRate: 30),
            Candidate(width: 3840, height: 2160, maxFrameRate: 30),
        ]
        #expect(CameraMath.bestFormatIndex(formats) == 1)
    }

    @Test func skipsFormatsTooSlowForALiveMirror() {
        let formats = [
            Candidate(width: 1920, height: 1080, maxFrameRate: 30),
            Candidate(width: 4032, height: 3024, maxFrameRate: 15),
        ]
        #expect(CameraMath.bestFormatIndex(formats) == 0)
    }

    @Test func tiesGoToTheHigherFrameRate() {
        let formats = [
            Candidate(width: 1920, height: 1440, maxFrameRate: 30),
            Candidate(width: 1920, height: 1440, maxFrameRate: 60),
        ]
        #expect(CameraMath.bestFormatIndex(formats) == 1)
    }

    @Test func noUsableFormatKeepsTheDefault() {
        #expect(CameraMath.bestFormatIndex([]) == nil)
        #expect(CameraMath.bestFormatIndex([Candidate(width: 640, height: 480, maxFrameRate: 24)]) == nil)
    }
}
