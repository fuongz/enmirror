import { useInView } from "motion/react"
import { useLayoutEffect, useRef, useState } from "react"

/**
 * Scroll reveal that never hides content the page already shows. The prerendered HTML renders
 * the block visible; after hydration, and only if it is still below the fold, it is set to
 * `hidden` (off screen, so nobody sees it go) and plays `show` once it scrolls into view.
 * Without JS, or when it is already on screen at load, it simply stays put.
 */
export function useReveal<T extends HTMLElement>(margin: `${number}px` = "-80px") {
  const ref = useRef<T>(null)
  const inView = useInView(ref, { once: true, margin })
  const [armed, setArmed] = useState(false)

  useLayoutEffect(() => {
    const el = ref.current
    if (el && el.getBoundingClientRect().top > window.innerHeight) setArmed(true)
  }, [])

  return { ref, animate: armed ? (inView ? "show" : "hidden") : undefined }
}
