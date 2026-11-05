import { useMotionValueEvent, useScroll } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"

/**
 * The section the reader is in: the last one whose top has passed `offset` px from the top, or
 * the last section once the page cannot scroll further. `pin(id)` keeps a clicked section active
 * (a short last section may never reach the offset) until the reader scrolls on their own.
 */
export function useActiveSection(ids: string[], offset = 120) {
  const [active, setActive] = useState(ids[0] ?? "")
  const pinned = useRef<string | null>(null)
  const { scrollY } = useScroll()

  const update = useCallback(() => {
    if (pinned.current) return setActive(pinned.current)
    let current = ids[0] ?? ""
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el && el.getBoundingClientRect().top <= offset) current = id
    }
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
    if (atBottom) current = ids[ids.length - 1] ?? current
    setActive(current)
  }, [ids, offset])

  useEffect(update, [update])
  useMotionValueEvent(scrollY, "change", update)

  useEffect(() => {
    const unpin = () => {
      pinned.current = null
    }
    const events = ["wheel", "touchstart", "keydown"] as const
    for (const type of events) window.addEventListener(type, unpin, { passive: true })
    return () => {
      for (const type of events) window.removeEventListener(type, unpin)
    }
  }, [])

  const pin = useCallback((id: string) => {
    pinned.current = id
    setActive(id)
  }, [])

  return [active, pin] as const
}
