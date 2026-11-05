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
        let keys = [
            SettingsKey.asOthersSee, SettingsKey.lightOn, SettingsKey.lightTone, SettingsKey.lightSize, SettingsKey.guide,
            SettingsKey.zoom,
        ]
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

struct AppInfoTests {
    @Test func versionShowsTheBuildInParentheses() {
        #expect(AppInfo.versionText(short: "1.0", build: "202611051230") == "1.0 (202611051230)")
    }

    @Test func versionDropsAMissingOrRepeatedBuild() {
        #expect(AppInfo.versionText(short: "1.0", build: nil) == "1.0")
        #expect(AppInfo.versionText(short: "1.0", build: "1.0") == "1.0")
        #expect(AppInfo.versionText(short: nil, build: "7") == "7")
        #expect(AppInfo.versionText(short: nil, build: nil) == "–")
    }

    @Test func feedbackMailCarriesTheVersionInItsSubject() throws {
        let url = try #require(AppLinks.feedbackMail(to: "help@example.com", version: "1.0 (42)"))
        #expect(url.absoluteString == "mailto:help@example.com?subject=enMirror%201.0%20(42)")
    }

    @Test func storeLinksPointAtTheApp() {
        #expect(AppLinks.writeReview?.absoluteString.contains("id6830683755") == true)
        #expect(AppLinks.privacyPolicy?.host() == "enmirror.trinhvaphuong.com")
    }
}

struct LanguageNameTests {
    @Test func namesEachLanguageInItself() {
        #expect(AppInfo.languageName(for: "vi") == "Tiếng Việt")
        #expect(AppInfo.languageName(for: "en") == "English")
    }
}

struct GuideTests {
    @Test func tapsCycleThroughEveryGuideAndBackToOff() {
        #expect(Guide.off.next == .centerLine)
        #expect(Guide.centerLine.next == .grid)
        #expect(Guide.grid.next == .oval)
        #expect(Guide.oval.next == .off)
    }

    @Test func ovalIsCentredAndFitsTallScreens() {
        let size = CGSize(width: 400, height: 860)
        let rect = Guide.ovalRect(in: size)
        #expect(rect.midX == 200)
        #expect(rect.midY == 430)
        #expect(rect.width == 248)
        #expect(abs(rect.height - 248 * 1.35) < 0.001)
    }

    @Test func ovalShrinksWhenTheMirrorIsShort() {
        let size = CGSize(width: 400, height: 300)
        let rect = Guide.ovalRect(in: size)
        #expect(rect.height == 210)
        #expect(CGRect(origin: .zero, size: size).contains(rect))
    }

    @Test func ovalIsEmptyForAnEmptyMirror() {
        #expect(Guide.ovalRect(in: .zero) == .zero)
    }
}

struct DelayTests {
    @Test func buttonCyclesThroughEachDelayAndBackToLive() {
        #expect(MirrorDelay.next(after: nil) == 2)
        #expect(MirrorDelay.next(after: 2) == 3)
        #expect(MirrorDelay.next(after: 3) == 5)
        #expect(MirrorDelay.next(after: 5) == nil)
    }

    @Test func nothingShowsUntilTheFirstFrameIsOldEnough() {
        var buffer = DelayBuffer<Int>(delay: 3)
        #expect(buffer.push(0, at: 10.0) == nil)
        #expect(buffer.push(1, at: 11.0) == nil)
        #expect(buffer.push(2, at: 12.9) == nil)
        #expect(buffer.push(3, at: 13.0) == 0)
    }

    @Test func showsTheNewestDueFrameAndDropsOlderOnes() {
        var buffer = DelayBuffer<Int>(delay: 2)
        for frame in 0..<10 { _ = buffer.push(frame, at: Double(frame) * 0.1) }
        // A gap: frames 0...9 are all at least 2 s old at t = 3.0; the newest of them shows.
        #expect(buffer.push(10, at: 3.0) == 9)
        #expect(buffer.count == 1)
    }

    @Test func holdsAboutTheDelayAtThirtyFramesPerSecond() {
        var buffer = DelayBuffer<Int>(delay: 5)
        for frame in 0..<600 { _ = buffer.push(frame, at: Double(frame) / 30) }
        #expect((149...151).contains(buffer.count))
    }

    @Test func removeAllEmptiesTheBuffer() {
        var buffer = DelayBuffer<Int>(delay: 1)
        _ = buffer.push(0, at: 0)
        buffer.removeAll()
        #expect(buffer.count == 0)
    }

    @Test func framesShrinkToTheLongSideAndStayEven() {
        #expect(CameraMath.scaledSize(width: 1080, height: 1440, longSide: 960) == CGSize(width: 720, height: 960))
        #expect(CameraMath.scaledSize(width: 1081, height: 1441, longSide: 960) == CGSize(width: 720, height: 960))
        #expect(CameraMath.scaledSize(width: 480, height: 640, longSide: 960) == CGSize(width: 480, height: 640))
        #expect(CameraMath.scaledSize(width: 0, height: 0, longSide: 960) == .zero)
    }
}

struct PinTests {
    private let area = CGRect(x: 16, y: 76, width: 360, height: 600)
    private let tile = CGSize(width: 108, height: 144)

    @Test func dragEndPicksTheCornerOfItsQuarter() {
        #expect(PinMath.nearestCorner(to: CGPoint(x: 30, y: 100), in: area) == .topLeading)
        #expect(PinMath.nearestCorner(to: CGPoint(x: 300, y: 100), in: area) == .topTrailing)
        #expect(PinMath.nearestCorner(to: CGPoint(x: 30, y: 600), in: area) == .bottomLeading)
        #expect(PinMath.nearestCorner(to: CGPoint(x: 300, y: 600), in: area) == .bottomTrailing)
    }

    @Test func dragsPastTheEdgeStillSnapToTheNearestCorner() {
        #expect(PinMath.nearestCorner(to: CGPoint(x: -200, y: 2000), in: area) == .bottomLeading)
    }

    @Test func tileSitsInsideTheAreaAtEveryCorner() {
        for corner in PinCorner.allCases {
            let center = PinMath.center(of: corner, tile: tile, in: area)
            let frame = CGRect(
                x: center.x - tile.width / 2,
                y: center.y - tile.height / 2,
                width: tile.width,
                height: tile.height
            )
            #expect(area.contains(frame))
        }
        #expect(PinMath.center(of: .topTrailing, tile: tile, in: area) == CGPoint(x: 322, y: 148))
    }
}

struct SelfTimerTests {
    @Test func pressCapturesWithoutATimer() {
        #expect(SelfTimer.press(timer: nil, isCounting: false) == .capture)
    }

    @Test func pressStartsTheChosenCountdown() {
        #expect(SelfTimer.press(timer: 3, isCounting: false) == .startCountdown(3))
        #expect(SelfTimer.press(timer: 10, isCounting: false) == .startCountdown(10))
    }

    @Test func pressDuringACountdownCancelsIt() {
        #expect(SelfTimer.press(timer: 3, isCounting: true) == .cancelCountdown)
    }

    @Test func countdownShowsEachSecondDownToOne() {
        #expect(SelfTimer.ticks(from: 3) == [3, 2, 1])
        #expect(SelfTimer.ticks(from: 10).count == 10)
        #expect(SelfTimer.ticks(from: 0).isEmpty)
    }
}

struct ZoomMemoryTests {
    @Test func savedZoomIsRestoredInsideTheRange() {
        #expect(CameraMath.restoredZoom(saved: 2.2, range: 1...3) == 2.2)
    }

    @Test func savedZoomIsClampedOnAPhoneWithLessZoom() {
        #expect(CameraMath.restoredZoom(saved: 2.8, range: 1...2) == 2)
    }

    @Test func noSavedZoomStartsAtOne() {
        #expect(CameraMath.restoredZoom(saved: nil, range: 1...3) == 1)
    }
}

struct QuickActionTests {
    @Test func everyModeRoundTripsThroughItsShortcutType() {
        for mode in MirrorLaunch.Mode.allCases {
            #expect(MirrorLaunch.Mode(shortcutType: mode.shortcutType) == mode)
        }
    }

    @Test func unknownShortcutTypesAreIgnored() {
        #expect(MirrorLaunch.Mode(shortcutType: "enmirror.open.selfie") == nil)
        #expect(MirrorLaunch.Mode(shortcutType: "light") == nil)
    }

    @Test func iconMenuOffersTheFourChosenModes() {
        #expect(QuickActions.modes == [.light, .delayed, .asOthersSee, .guide])
    }
}
