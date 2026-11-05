import { animate, type Transition, type Variants } from "motion/react"

// Motion (motion.dev) presets for the landing page. Full transform strings rather than the x/y
// shorthands, so the browser can keep the animation on the compositor.

/** Strong ease-out for entrances. */
export const easeOut = [0.23, 1, 0.32, 1] as const

/** Strong ease-in-out for movement on screen. */
export const easeInOut = [0.77, 0, 0.175, 1] as const

/** A moving highlight (the table of contents): no bounce, quick, retargets while scrolling. */
export const slide: Transition = { type: "spring", duration: 0.3, bounce: 0 }

/** A parent that reveals its children one after another. */
export function staggered(gap: number, delay = 0): Variants {
  return { hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }
}

/** Fade up into place. */
export function rise(distance = 16, duration = 0.6, delay = 0): Variants {
  return {
    hidden: { opacity: 0, transform: `translateY(${distance}px)` },
    show: { opacity: 1, transform: "translateY(0px)", transition: { duration, delay, ease: easeOut } },
  }
}

/**
 * Scrolls the window to `el` with Motion, leaving `offset` px above it. Any wheel, touch or key
 * input stops it, so it never fights the reader. With Reduce Motion it jumps.
 */
export function scrollToElement(el: HTMLElement, reduce: boolean, offset = 96) {
  const target = window.scrollY + el.getBoundingClientRect().top - offset
  if (reduce) {
    window.scrollTo(0, target)
    return
  }
  const controls = animate(window.scrollY, target, {
    duration: 0.6,
    ease: easeInOut,
    onUpdate: (y) => window.scrollTo(0, y),
  })
  const stop = () => controls.stop()
  for (const type of ["wheel", "touchstart", "keydown"] as const) {
    window.addEventListener(type, stop, { once: true, passive: true })
  }
  void controls.then(() => {
    for (const type of ["wheel", "touchstart", "keydown"] as const) window.removeEventListener(type, stop)
  })
}
