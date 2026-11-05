import { useRef } from "react"
import type * as React from "react"
import { cn } from "cn"
import {
  DownloadIcon,
  FlameIcon,
  FlipHorizontal2Icon,
  InfoIcon,
  LightbulbIcon,
  ShareIcon,
  SnowflakeIcon,
  SunDimIcon,
  SunIcon,
  Trash2Icon,
  ZoomInIcon,
  ZoomOutIcon,
  type LucideIcon,
} from "lucide-react"

import { MirrorAboutSheet, type AboutLabels, type AboutLinks } from "@/components/mirror-about-sheet"

/**
 * One state of the enMirror mirror screen, drawn in CSS until real screenshots exist.
 * Values follow the app: ios/EnMirror/Mirror/MirrorView.swift and ios/EnMirror/Support/RingLight.swift.
 */
export type MirrorArt = {
  /** Ring light tone, 0 = warm (2700 K) to 1 = cool (6500 K); null = light off. */
  light: number | null
  /** Ring light size, 0 to 1: a frame of 5% to 16% of the screen width. */
  lightSize?: number
  /** The slider panel open above the controls. */
  panel?: "light" | "exposure" | "zoom"
  /** 1 to 3. */
  zoom?: number
  /** Exposure bias, −2 to +2 EV. */
  exposure?: number
  /** "As others see you": the image is not mirrored. */
  flipped?: boolean
  /** The yellow square where a tap set the exposure. */
  meterPoint?: boolean
  /** A captured still with Share, Save and Delete. */
  frozen?: boolean
  /** Where a tap set the exposure, as fractions of the mirror (the interactive demo). */
  meterAt?: { x: number; y: number; key: number }
  /** A message at the top, like the app's toast. */
  toast?: string
}

export type MirrorLabels = { share: string; save: string; delete: string }

/** Everything the playable demo needs to name its controls. */
export type DemoLabels = MirrorLabels & {
  region: string
  hint: string
  light: string
  exposure: string
  zoom: string
  flip: string
  shutter: string
  tone: string
  size: string
  inApp: string
  asOthers: string
  mirrorView: string
  about: AboutLabels
}

/** Handlers that make the screen playable (MirrorDemo); without them it is a still picture. */
export type MirrorDemoHandlers = {
  labels: DemoLabels
  toggleLight: () => void
  togglePanel: (panel: "exposure" | "zoom") => void
  flip: () => void
  shutter: () => void
  setTone: (value: number) => void
  setSize: (value: number) => void
  setZoom: (value: number) => void
  setExposure: (value: number) => void
  share: () => void
  save: () => void
  remove: () => void
  /** Spread on the mirror area for taps, pinches and the wheel. */
  mirrorProps: React.ComponentProps<"div">
  /** The About sheet, opened by the info button. */
  about: { open: boolean; show: () => void; hide: () => void; links: AboutLinks; appVersion: string }
}

const focusRing =
  "cursor-pointer outline-none transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"

/** The app's accent (AccentColor in Assets.xcassets): tints the active round buttons. */
const accent = "#FFC76B"

// Sizes in the app's points on a 393 pt wide screen, scaled to the frame with container units.
const pt = (value: number) => `calc(${value} * 100cqw / 393)`

/** Black-body colour approximation (Tanner Helland), the formula RingLight.rgb(kelvin:) uses. */
function ringColour(tone: number): string {
  const kelvin = 2700 + (6500 - 2700) * Math.min(Math.max(tone, 0), 1)
  const t = kelvin / 100
  const clamp = (v: number) => Math.round(Math.min(Math.max(v, 0), 255))
  const red = t <= 66 ? 255 : 329.698727446 * Math.pow(t - 60, -0.1332047592)
  const green = t <= 66 ? 99.4708025861 * Math.log(t) - 161.1195681661 : 288.1221695283 * Math.pow(t - 60, -0.0755148492)
  const blue = t >= 66 ? 255 : t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307
  return `rgb(${clamp(red)} ${clamp(green)} ${clamp(blue)})`
}

const glass = "border border-white/25 bg-white/15 text-white backdrop-blur-md"

type Press = { label: string; onPress: () => void }

function RoundButton({
  icon: Icon,
  active = false,
  press,
  children,
}: {
  icon?: LucideIcon
  active?: boolean
  press?: Press
  children?: React.ReactNode
}) {
  const className = cn("flex shrink-0 items-center justify-center rounded-full font-bold", active ? "border border-transparent text-black" : glass)
  const style = { width: pt(54), height: pt(54), fontSize: pt(15), ...(active ? { backgroundColor: accent } : {}) }
  const content = Icon ? <Icon aria-hidden="true" style={{ width: pt(22), height: pt(22) }} strokeWidth={2.4} /> : children
  if (!press) {
    return (
      <span className={className} style={style}>
        {content}
      </span>
    )
  }
  return (
    <button type="button" aria-label={press.label} aria-pressed={active} onClick={press.onPress} className={cn(className, focusRing)} style={style}>
      {content}
    </button>
  )
}

function Shutter({ press }: { press?: Press }) {
  const className = "relative flex shrink-0 rounded-full border-white"
  const style = { width: pt(74), height: pt(74), borderWidth: pt(4) }
  const disc = <span aria-hidden="true" className="absolute rounded-full bg-white transition-transform group-active:scale-90" style={{ inset: pt(5) }} />
  if (!press) {
    return (
      <span className={className} style={style}>
        {disc}
      </span>
    )
  }
  return (
    <button type="button" aria-label={press.label} onClick={press.onPress} className={cn(className, focusRing, "group active:scale-100")} style={style}>
      {disc}
    </button>
  )
}

type Slide = { label: string; onChange: (value: number) => void }

function SliderRow({ min: Min, max: Max, value, text, slide }: { min: LucideIcon; max: LucideIcon; value: number; text?: string; slide?: Slide }) {
  const icon = { width: pt(20), height: pt(20) }
  return (
    <span className="flex items-center" style={{ gap: pt(12) }}>
      <Min aria-hidden="true" style={icon} />
      <span className="relative flex-1 rounded-full bg-white/30 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-white" style={{ height: pt(4) }}>
        {slide ? (
          // A real range input over the drawn track: drag, tap and the arrow keys all work.
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={value}
            aria-label={slide.label}
            aria-valuetext={text}
            onChange={(event) => slide.onChange(Number(event.currentTarget.value))}
            className="absolute inset-x-0 top-1/2 z-10 w-full -translate-y-1/2 cursor-pointer opacity-0"
            style={{ height: pt(30) }}
          />
        ) : null}
        <span className="absolute inset-y-0 left-0 rounded-full bg-white" style={{ width: `${value * 100}%` }} />
        <span
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow"
          style={{ left: `${value * 100}%`, width: pt(24), height: pt(24) }}
        />
      </span>
      <Max aria-hidden="true" style={icon} />
      {text ? (
        <span className="text-right font-semibold tabular-nums" style={{ width: pt(40), fontSize: pt(13) }}>
          {text}
        </span>
      ) : null}
    </span>
  )
}

function Panel({ art, demo }: { art: MirrorArt; demo?: MirrorDemoHandlers }) {
  const zoom = art.zoom ?? 1
  const exposure = art.exposure ?? 0
  const slide = (label: string, onChange: (value: number) => void): Slide | undefined => (demo ? { label, onChange } : undefined)
  return (
    <span
      className={cn(glass, "flex flex-col")}
      style={{ marginInline: pt(20), padding: `${pt(16)} ${pt(20)}`, gap: pt(16), borderRadius: pt(28) }}
    >
      {art.panel === "zoom" ? (
        <SliderRow
          min={ZoomOutIcon}
          max={ZoomInIcon}
          value={(zoom - 1) / 2}
          text={`${zoom.toFixed(1)}×`}
          slide={slide(demo?.labels.zoom ?? "", (v) => demo?.setZoom(1 + v * 2))}
        />
      ) : art.panel === "exposure" ? (
        <SliderRow
          min={SunDimIcon}
          max={SunIcon}
          value={(exposure + 2) / 4}
          text={`${exposure >= 0 ? "+" : "−"}${Math.abs(exposure).toFixed(1)}`}
          slide={slide(demo?.labels.exposure ?? "", (v) => demo?.setExposure(v * 4 - 2))}
        />
      ) : (
        <>
          <SliderRow min={FlameIcon} max={SnowflakeIcon} value={art.light ?? 0.45} slide={slide(demo?.labels.tone ?? "", (v) => demo?.setTone(v))} />
          <SliderRow min={SunDimIcon} max={SunIcon} value={art.lightSize ?? 0.5} slide={slide(demo?.labels.size ?? "", (v) => demo?.setSize(v))} />
        </>
      )}
    </span>
  )
}

function Controls({ art, demo }: { art: MirrorArt; demo?: MirrorDemoHandlers }) {
  const press = (label: string | undefined, onPress: (() => void) | undefined): Press | undefined =>
    demo && label && onPress ? { label, onPress } : undefined
  const zoomText = `${(art.zoom ?? 1).toFixed(1)}×`
  return (
    <span className="flex items-center justify-center" style={{ gap: pt(14) }}>
      <RoundButton icon={LightbulbIcon} active={art.light !== null} press={press(demo?.labels.light, demo?.toggleLight)} />
      <RoundButton icon={SunIcon} active={art.panel === "exposure"} press={press(demo?.labels.exposure, demo && (() => demo.togglePanel("exposure")))} />
      <Shutter press={press(demo?.labels.shutter, demo?.shutter)} />
      <RoundButton active={art.panel === "zoom"} press={press(demo && `${demo.labels.zoom} ${zoomText}`, demo && (() => demo.togglePanel("zoom")))}>
        <span aria-hidden={demo ? true : undefined}>{zoomText}</span>
      </RoundButton>
      <RoundButton icon={FlipHorizontal2Icon} active={art.flipped} press={press(demo?.labels.flip, demo?.flip)} />
    </span>
  )
}

function PhotoActions({ labels, demo }: { labels: MirrorLabels; demo?: MirrorDemoHandlers }) {
  // Darker glass than the controls: these sit low over the photo, often over light clothes, where
  // white or red text on a pale glass all but disappears.
  const darkGlass = "border border-white/20 bg-black/40 backdrop-blur-md"
  const actions: { icon: LucideIcon; label: string; style: string; onPress?: () => void }[] = [
    { icon: ShareIcon, label: labels.share, style: cn(darkGlass, "text-white"), onPress: demo?.share },
    { icon: DownloadIcon, label: labels.save, style: "border border-transparent bg-[#FFC76B] text-black", onPress: demo?.save },
    { icon: Trash2Icon, label: labels.delete, style: cn(darkGlass, "text-[#ff8f86]"), onPress: demo?.remove },
  ]
  return (
    <span className="flex" style={{ gap: pt(12), marginInline: pt(20) }}>
      {actions.map(({ icon: Icon, label, style, onPress }) => {
        const className = cn(style, "flex flex-1 items-center justify-center rounded-full font-semibold whitespace-nowrap")
        const size = { height: pt(52), gap: pt(6), fontSize: pt(15) }
        const content = (
          <>
            <Icon aria-hidden="true" style={{ width: pt(17), height: pt(17) }} strokeWidth={2.4} />
            {label}
          </>
        )
        return onPress ? (
          <button key={label} type="button" onClick={onPress} className={cn(className, focusRing)} style={size}>
            {content}
          </button>
        ) : (
          <span key={label} className={className} style={size}>
            {content}
          </span>
        )
      })}
    </span>
  )
}

/**
 * The person in the mirror: a soft, out-of-focus portrait in gradients (a window light on the
 * left makes the flip visible). Zoom scales it, exposure brightens it, "As others see you" flips it.
 */
function Reflection({ art, ring }: { art: MirrorArt; ring: string | null }) {
  const scale = art.zoom ?? 1
  const flip = art.flipped ? -1 : 1
  return (
    <span
      className="absolute inset-0"
      style={{
        transform: `scale(${scale * flip}, ${scale})`,
        transformOrigin: "50% 38%",
        // Only when exposure moves: a filter makes its own compositing layer, and Chrome was seen
        // dropping the photo from that layer after the page sat idle.
        filter: art.exposure ? `brightness(${1 + art.exposure * 0.14})` : undefined,
        background:
          "radial-gradient(60% 45% at 8% 18%, rgb(255 250 240 / 0.28), transparent 70%), linear-gradient(165deg, #5b4785 0%, #3a2b5c 50%, #221838 100%)",
      }}
    >
      {/* An AI-generated, fictional Vietnamese woman (Codex image generation), as the front camera sees her.
          No blur: sharpness is what the app sells. */}
      <img
        src="/mirror/reflection.webp"
        alt=""
        width={640}
        height={1226}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
      />
      {ring ? (
        // The ring light's own glow on the face, in its tone.
        <span className="absolute inset-0 opacity-35 mix-blend-soft-light" style={{ background: `radial-gradient(70% 50% at 50% 38%, ${ring}, transparent 75%)` }} />
      ) : null}
    </span>
  )
}

/**
 * The mirror screen in one state. Without `demo` it is a still picture (wrap it in an element
 * with aria-hidden); with `demo` (MirrorDemo) its controls and the mirror itself are playable.
 */
export function MirrorScreen({ art, labels, demo, className }: { art: MirrorArt; labels: MirrorLabels; demo?: MirrorDemoHandlers; className?: string }) {
  const ring = art.light === null ? null : ringColour(art.light)
  const infoButton = useRef<HTMLButtonElement>(null)
  const inset = ring ? `calc(${0.05 + 0.11 * (art.lightSize ?? 0.5)} * 100cqw)` : "0px"

  return (
    <div className={cn("@container absolute inset-0 overflow-hidden bg-black text-white select-none", className)} style={ring ? { backgroundColor: ring } : undefined}>
      {/* The ring light is the screen itself lit around the image, with a soft inner glow. */}
      <div
        {...demo?.mirrorProps}
        className={cn("absolute overflow-hidden transition-[inset,border-radius] duration-300", demo?.mirrorProps.className)}
        style={{
          inset,
          borderRadius: ring ? pt(36) : 0,
          boxShadow: ring ? `0 0 ${pt(18)} ${pt(4)} ${ring}` : undefined,
        }}
      >
        <Reflection art={art} ring={ring} />
        {art.meterPoint ? (
          <span
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-[4px] border-yellow-300 opacity-90"
            style={{ left: "58%", top: "34%", width: pt(76), height: pt(76), borderWidth: pt(1.5) }}
          />
        ) : null}
        {art.meterAt ? (
          <span
            key={art.meterAt.key}
            aria-hidden="true"
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 animate-in rounded-[4px] border-yellow-300 opacity-90 duration-200 fade-in-0 zoom-in-125 motion-reduce:animate-none"
            style={{ left: `${art.meterAt.x * 100}%`, top: `${art.meterAt.y * 100}%`, width: pt(76), height: pt(76), borderWidth: pt(1.5) }}
          />
        ) : null}
      </div>

      {art.frozen ? null : demo ? (
        <button
          ref={infoButton}
          type="button"
          aria-label={demo.labels.about.title}
          aria-haspopup="dialog"
          onClick={demo.about.show}
          className={cn(glass, focusRing, "absolute flex items-center justify-center rounded-full")}
          style={{ top: pt(62), left: pt(20), width: pt(44), height: pt(44) }}
        >
          <InfoIcon aria-hidden="true" style={{ width: pt(20), height: pt(20) }} strokeWidth={2.4} />
        </button>
      ) : (
        <span aria-hidden="true" className="absolute" style={{ top: pt(62), left: pt(20) }}>
          <span className={cn(glass, "flex items-center justify-center rounded-full")} style={{ width: pt(44), height: pt(44) }}>
            <InfoIcon style={{ width: pt(20), height: pt(20) }} strokeWidth={2.4} />
          </span>
        </span>
      )}

      {art.toast ? (
        <p
          role="status"
          className={cn(glass, "absolute left-1/2 -translate-x-1/2 animate-in rounded-full font-semibold whitespace-nowrap duration-200 fade-in-0 slide-in-from-top-2 motion-reduce:animate-none")}
          style={{ top: pt(66), padding: `${pt(9)} ${pt(18)}`, fontSize: pt(14) }}
        >
          {art.toast}
        </p>
      ) : null}

      <div className="absolute inset-x-0 flex flex-col" style={{ bottom: pt(42), gap: pt(12) }}>
        {art.frozen ? (
          <PhotoActions labels={labels} demo={demo} />
        ) : (
          <>
            {art.panel ? <Panel art={art} demo={demo} /> : null}
            <Controls art={art} demo={demo} />
          </>
        )}
      </div>

      {demo?.about.open ? (
        <MirrorAboutSheet
          labels={demo.labels.about}
          links={demo.about.links}
          appVersion={demo.about.appVersion}
          onInApp={demo.share}
          onClose={() => {
            demo.about.hide()
            infoButton.current?.focus({ preventScroll: true })
          }}
        />
      ) : null}
    </div>
  )
}
