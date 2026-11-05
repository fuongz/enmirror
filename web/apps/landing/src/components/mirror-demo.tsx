import { useEffect, useRef, useState } from "react"

import { MirrorScreen, type DemoLabels, type MirrorArt } from "@/components/mirror-screen"
import { pathFor, type Lang } from "@/routes"
import { site } from "@/site"

// The app's limits (CameraMath, RingLight): zoom 1–3×, exposure ±2 EV, the light's default tone.
const zoomRange = { min: 1, max: 3 }
const defaultTone = 0.45
const defaultSize = 0.1
const toastMs = 1600
// A second tap within this time resets the zoom, like the app's double tap.
const doubleTapMs = 300
// A press that moves less than this is a tap, not a drag or a pinch.
const tapSlop = 6

const clampZoom = (value: number) => Math.min(Math.max(value, zoomRange.min), zoomRange.max)

type State = {
  lightOn: boolean
  tone: number
  size: number
  panel?: "light" | "exposure" | "zoom"
  zoom: number
  exposure: number
  flipped: boolean
  frozen: boolean
  meterAt?: { x: number; y: number; key: number }
  toast?: { text: string; key: number }
  aboutOpen: boolean
}

/**
 * The mirror in the hero, playable: the same controls as the app over the reflection photo. Light
 * opens the ring light and its tone and size; exposure and zoom open their sliders; the flip shows
 * "as others see you"; the shutter freezes the frame with Share, Save (in the app only, so a toast
 * says so) and Delete. On the mirror: tap meters (the yellow square), double tap resets the zoom,
 * two fingers pinch it, and a trackpad pinch or the wheel (while the zoom slider is open) zooms.
 */
export function MirrorDemo({ labels, lang }: { labels: DemoLabels; lang: Lang }) {
  const [state, setState] = useState<State>({
    lightOn: false,
    tone: defaultTone,
    size: defaultSize,
    zoom: 1,
    exposure: 0,
    flipped: false,
    frozen: false,
    aboutOpen: false,
  })
  const mirror = useRef<HTMLDivElement>(null)
  const pointers = useRef(new Map<number, { x: number; y: number; startX: number; startY: number }>())
  const pinch = useRef<{ distance: number; zoom: number } | null>(null)
  const lastTap = useRef(0)
  // The wheel handler reads the latest state without re-subscribing.
  const latest = useRef(state)
  latest.current = state

  const update = (change: Partial<State>) => setState((current) => ({ ...current, ...change }))
  const toast = (text: string) => update({ toast: { text, key: Date.now() } })
  const setZoom = (value: number) => update({ zoom: clampZoom(value) })

  useEffect(() => {
    if (!state.toast) return
    const timer = window.setTimeout(() => update({ toast: undefined }), toastMs)
    return () => window.clearTimeout(timer)
  }, [state.toast])

  // A trackpad pinch arrives as a wheel event with ctrlKey. A plain wheel only zooms while the zoom
  // slider is open, so scrolling the page over the phone still scrolls the page. Non-passive, so
  // preventDefault can stop the browser zooming or scrolling at the same time.
  useEffect(() => {
    const element = mirror.current
    if (!element) return
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && latest.current.panel !== "zoom") return
      event.preventDefault()
      setState((current) => ({ ...current, zoom: clampZoom(current.zoom * Math.exp(-event.deltaY * 0.01)) }))
    }
    element.addEventListener("wheel", onWheel, { passive: false })
    return () => element.removeEventListener("wheel", onWheel)
  }, [])

  const distance = () => {
    const [a, b] = [...pointers.current.values()]
    return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0
  }

  const art: MirrorArt = {
    light: state.lightOn ? state.tone : null,
    lightSize: state.size,
    panel: state.panel,
    zoom: state.zoom,
    exposure: state.exposure,
    flipped: state.flipped,
    frozen: state.frozen,
    meterAt: state.meterAt,
    toast: state.toast?.text,
  }

  return (
    <MirrorScreen
      art={art}
      labels={labels}
      demo={{
        labels,
        toggleLight: () =>
          setState((current) => ({
            ...current,
            lightOn: !current.lightOn,
            panel: current.lightOn ? (current.panel === "light" ? undefined : current.panel) : "light",
          })),
        togglePanel: (panel) => setState((current) => ({ ...current, panel: current.panel === panel ? undefined : panel })),
        flip: () =>
          setState((current) => ({
            ...current,
            flipped: !current.flipped,
            toast: { text: current.flipped ? labels.mirrorView : labels.asOthers, key: Date.now() },
          })),
        shutter: () => update({ frozen: true, panel: undefined }),
        setTone: (value) => update({ tone: value }),
        setSize: (value) => update({ size: value }),
        setZoom,
        setExposure: (value) => update({ exposure: Math.round(value * 10) / 10 }),
        share: () => toast(labels.inApp),
        save: () => toast(labels.inApp),
        remove: () => update({ frozen: false }),
        about: {
          open: state.aboutOpen,
          show: () => update({ aboutOpen: true, panel: undefined }),
          hide: () => update({ aboutOpen: false }),
          links: { privacy: pathFor(lang, "privacy"), support: pathFor(lang, "support"), email: site.supportEmail },
          appVersion: site.appVersion,
        },
        mirrorProps: {
          ref: mirror,
          // One finger still scrolls the page vertically; two fingers reach the pinch below.
          className: "touch-pan-y cursor-pointer",
          onPointerDown: (event) => {
            pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY })
            if (pointers.current.size === 2) pinch.current = { distance: distance(), zoom: latest.current.zoom }
          },
          onPointerMove: (event) => {
            const pointer = pointers.current.get(event.pointerId)
            if (!pointer) return
            pointer.x = event.clientX
            pointer.y = event.clientY
            if (pinch.current && pointers.current.size === 2 && pinch.current.distance > 0) {
              setZoom(pinch.current.zoom * (distance() / pinch.current.distance))
            }
          },
          onPointerUp: (event) => {
            const pointer = pointers.current.get(event.pointerId)
            pointers.current.delete(event.pointerId)
            if (pinch.current) {
              if (pointers.current.size === 0) pinch.current = null
              return
            }
            if (!pointer || Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY) > tapSlop) return
            const now = event.timeStamp
            if (now - lastTap.current < doubleTapMs) {
              lastTap.current = 0
              setZoom(zoomRange.min)
              return
            }
            lastTap.current = now
            const box = event.currentTarget.getBoundingClientRect()
            update({
              meterAt: { x: (event.clientX - box.left) / box.width, y: (event.clientY - box.top) / box.height, key: now },
            })
          },
          onPointerCancel: (event) => {
            pointers.current.delete(event.pointerId)
            if (pointers.current.size === 0) pinch.current = null
          },
        },
      }}
    />
  )
}
