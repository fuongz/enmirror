import { useEffect, useRef, useState } from "react"
import type * as React from "react"
import { cn } from "cn"
import {
  CheckIcon,
  DownloadIcon,
  FlameIcon,
  FlipHorizontal2Icon,
  Grid2x2Icon,
  HistoryIcon,
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

/** The alignment overlay, as in the app (ios/EnMirror/Support/Guide.swift). One tap steps to the next. */
export type Guide = "off" | "centerLine" | "grid" | "oval"
export const guideChoices: Guide[] = ["off", "centerLine", "grid", "oval"]

/** The delayed mirror's choices in seconds (ios/EnMirror/Support/MirrorDelay.swift): off → 2 → 3 → 5 → off. */
export const delayChoices = [2, 3, 5]

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
  /** The alignment guide drawn over the mirror. */
  guide?: Guide
  /** Seconds the delayed mirror runs behind; null or absent = live. */
  delay?: number | null
  /** The delayed mirror is still collecting its first seconds: dark, with "Turn around". */
  delayFilling?: boolean
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
  delay: string
  liveMirror: string
  /** "{s}" is replaced by the seconds. */
  delayedBy: string
  /** "{s}" is replaced by the seconds. */
  turnAround: string
  guide: string
  guides: Record<Guide, string>
  about: AboutLabels
}

/** Fills "{s}" in a label with a number of seconds. */
export const withSeconds = (label: string, seconds: number) => label.replace("{s}", String(seconds))

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
  /** Tap on the delay button: the next choice. */
  cycleDelay: () => void
  /** A pick from the delay button's menu; null = live. */
  setDelay: (seconds: number | null) => void
  /** Tap on the guide button: the next guide. */
  cycleGuide: () => void
  /** A pick from the guide button's menu. */
  setGuide: (guide: Guide) => void
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

function Shutter({ press, disabled = false }: { press?: Press; disabled?: boolean }) {
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
    <button
      type="button"
      aria-label={press.label}
      onClick={press.onPress}
      disabled={disabled}
      className={cn(className, focusRing, "group active:scale-100 disabled:cursor-default disabled:opacity-40")}
      style={style}
    >
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
      {/* Nothing to capture until the delayed mirror shows its first old frame, as in the app. */}
      <Shutter press={press(demo?.labels.shutter, demo?.shutter)} disabled={art.delayFilling} />
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

// A soft dark edge under a thin white line keeps the guide visible on a bright wall or a white
// shirt (GuideOverlay.swift: black 25% at 2.5 pt under white 60% at 1 pt).
const guideStrokes = [
  { stroke: "rgb(0 0 0 / 0.25)", width: 2.5 },
  { stroke: "rgb(255 255 255 / 0.6)", width: 1 },
]

/**
 * The alignment guide over the mirror: thin lines that never take a tap. It sits inside the ring
 * light's inset and outside the flip, so the centre line stays in the middle either way.
 */
function GuideOverlay({ guide }: { guide: Guide }) {
  if (guide === "off") return null
  const lines: [string, string, string, string][] =
    guide === "centerLine"
      ? [["50%", "0", "50%", "100%"]]
      : guide === "grid"
        ? ["33.333%", "66.667%"].flatMap((at): [string, string, string, string][] => [
            [at, "0", at, "100%"],
            ["0", at, "100%", at],
          ])
        : []
  return (
    // A size container: the oval is 62% of the width, 1.35 times as tall as wide, and never taller
    // than 70% of the height (Guide.ovalRect), so it shrinks with the mirror when the light grows.
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 [container-type:size]">
      {guide === "oval" ? (
        <svg
          viewBox="0 0 100 135"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible"
          style={{ width: "min(62cqw, 70cqh / 1.35)" }}
        >
          {guideStrokes.map(({ stroke, width }) => (
            <ellipse key={width} cx={50} cy={67.5} rx={50} ry={67.5} fill="none" stroke={stroke} strokeWidth={width} vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
      ) : (
        <svg className="absolute inset-0 h-full w-full">
          {guideStrokes.map(({ stroke, width }) =>
            lines.map(([x1, y1, x2, y2]) => <line key={`${width}${x1}${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={width} />),
          )}
        </svg>
      )}
    </span>
  )
}

type MenuOption = { key: string; label: string; selected: boolean; onSelect: () => void }

// A touch and hold this long opens the menu instead of stepping, like the app's context menu.
const holdMs = 450

/**
 * A round glass button in the top-right corner (GlassCircleMenuButton.swift): a tap runs `onPress`,
 * touch and hold, a right click or the menu key opens a menu to pick a value directly.
 */
function MenuButton({
  label,
  active,
  onPress,
  options,
  children,
}: {
  label: string
  active: boolean
  onPress: () => void
  options: MenuOption[]
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLSpanElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const hold = useRef<number | undefined>(undefined)
  // Set when a hold opened the menu, so the click that ends the press doesn't also step.
  const held = useRef(false)

  const close = (refocus: boolean) => {
    setOpen(false)
    if (refocus) button.current?.focus({ preventScroll: true })
  }

  useEffect(() => {
    if (!open) return
    // Start on the current choice, like a native menu with a checkmark.
    const items = root.current?.querySelectorAll<HTMLElement>('[role="menuitemradio"]')
    const current = options.findIndex((option) => option.selected)
    items?.[Math.max(current, 0)]?.focus({ preventScroll: true })
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
    // Only on opening: moving the focus again on every change would fight the arrow keys.
  }, [open])

  const cancelHold = () => window.clearTimeout(hold.current)

  return (
    <span ref={root} className="relative">
      <button
        ref={button}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onPointerDown={(event) => {
          held.current = false
          if (event.button !== 0) return
          hold.current = window.setTimeout(() => {
            held.current = true
            setOpen(true)
          }, holdMs)
        }}
        onPointerUp={cancelHold}
        onPointerLeave={cancelHold}
        onPointerCancel={cancelHold}
        onContextMenu={(event) => {
          // A right click, the menu key or Shift+F10; also stops the long-press callout on touch.
          event.preventDefault()
          cancelHold()
          setOpen(true)
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault()
            setOpen(true)
          }
        }}
        onClick={() => {
          if (held.current) {
            held.current = false
            return
          }
          setOpen(false)
          onPress()
        }}
        className={cn(
          "flex touch-manipulation items-center justify-center rounded-full font-bold [-webkit-touch-callout:none]",
          active ? "border border-transparent text-black" : glass,
          focusRing,
        )}
        style={{ width: pt(44), height: pt(44), fontSize: pt(15), ...(active ? { backgroundColor: accent } : {}) }}
      >
        {children}
      </button>
      {open ? (
        <span
          role="menu"
          aria-label={label}
          onKeyDown={(event) => {
            const items = Array.from(root.current?.querySelectorAll<HTMLElement>('[role="menuitemradio"]') ?? [])
            const index = items.indexOf(document.activeElement as HTMLElement)
            const step = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0
            if (step) {
              event.preventDefault()
              items[(index + step + items.length) % items.length]?.focus()
            } else if (event.key === "Home" || event.key === "End") {
              event.preventDefault()
              items[event.key === "Home" ? 0 : items.length - 1]?.focus()
            } else if (event.key === "Escape" || event.key === "Tab") {
              if (event.key === "Escape") event.preventDefault()
              close(event.key === "Escape")
            }
          }}
          className="absolute right-0 z-20 flex origin-top-right animate-in flex-col overflow-hidden border border-white/20 bg-black/55 whitespace-nowrap text-white shadow-lg backdrop-blur-xl duration-150 fade-in-0 zoom-in-95 motion-reduce:animate-none"
          style={{ top: `calc(100% + ${pt(8)})`, borderRadius: pt(16), paddingBlock: pt(6), fontSize: pt(15) }}
        >
          {options.map((option) => (
            <button
              key={option.key}
              type="button"
              role="menuitemradio"
              aria-checked={option.selected}
              tabIndex={-1}
              onClick={() => {
                option.onSelect()
                close(true)
              }}
              className="flex cursor-pointer items-center text-left outline-none hover:bg-white/10 focus-visible:bg-white/15"
              style={{ gap: pt(10), padding: `${pt(9)} ${pt(16)} ${pt(9)} ${pt(12)}` }}
            >
              <CheckIcon aria-hidden="true" className={option.selected ? undefined : "invisible"} style={{ width: pt(16), height: pt(16) }} strokeWidth={2.6} />
              {option.label}
            </button>
          ))}
        </span>
      ) : null}
    </span>
  )
}

/** The delayed mirror and the alignment guide, top right (MirrorTopControls.swift). */
function TopControls({ art, demo }: { art: MirrorArt; demo?: MirrorDemoHandlers }) {
  const delay = art.delay ?? null
  const guide = art.guide ?? "off"
  const iconSize = { width: pt(20), height: pt(20) }
  const delayContent = delay ? <span className="tabular-nums">{delay}s</span> : <HistoryIcon aria-hidden="true" style={iconSize} strokeWidth={2.4} />
  const guideContent = <Grid2x2Icon aria-hidden="true" style={iconSize} strokeWidth={2.4} />
  const position = { top: pt(62), right: pt(20), gap: pt(12) }

  if (!demo) {
    const circle = (active: boolean, content: React.ReactNode) => (
      <span
        className={cn("flex items-center justify-center rounded-full font-bold", active ? "text-black" : glass)}
        style={{ width: pt(44), height: pt(44), fontSize: pt(15), ...(active ? { backgroundColor: accent } : {}) }}
      >
        {content}
      </span>
    )
    return (
      <span aria-hidden="true" className="absolute flex" style={position}>
        {circle(delay !== null, delayContent)}
        {circle(guide !== "off", guideContent)}
      </span>
    )
  }

  const { labels } = demo
  const delayName = delay ? withSeconds(labels.delayedBy, delay) : labels.liveMirror
  return (
    <div className="absolute flex" style={position}>
      <MenuButton
        label={`${labels.delay}: ${delayName}`}
        active={delay !== null}
        onPress={demo.cycleDelay}
        options={[null, ...delayChoices].map((seconds) => ({
          key: String(seconds),
          label: seconds ? withSeconds(labels.delayedBy, seconds) : labels.liveMirror,
          selected: seconds === delay,
          onSelect: () => demo.setDelay(seconds),
        }))}
      >
        {delayContent}
      </MenuButton>
      <MenuButton
        label={`${labels.guide}: ${labels.guides[guide]}`}
        active={guide !== "off"}
        onPress={demo.cycleGuide}
        options={guideChoices.map((choice) => ({
          key: choice,
          label: labels.guides[choice],
          selected: choice === guide,
          onSelect: () => demo.setGuide(choice),
        }))}
      >
        {guideContent}
      </MenuButton>
    </div>
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
        {art.delayFilling && art.delay ? (
          // The delayed mirror has no old frame to show yet: dark, with the app's hint.
          <p
            className="absolute inset-0 flex animate-in items-center justify-center bg-black text-center font-semibold text-balance duration-200 fade-in-0 motion-reduce:animate-none"
            style={{ padding: pt(32), fontSize: pt(17) }}
          >
            {demo ? withSeconds(demo.labels.turnAround, art.delay) : null}
          </p>
        ) : null}
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
        {/* Over the frozen photo too, as in the app; saved photos never include it. */}
        <GuideOverlay guide={art.guide ?? "off"} />
      </div>

      {art.frozen ? null : <TopControls art={art} demo={demo} />}

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
          onClose={() => {
            demo.about.hide()
            infoButton.current?.focus({ preventScroll: true })
          }}
        />
      ) : null}
    </div>
  )
}
