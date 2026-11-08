import { AnimatePresence, useMotionValueEvent, useScroll } from "motion/react"
import * as m from "motion/react-m"
import { useState } from "react"
import { cn } from "cn"

import { LanguageSelect } from "@/components/language-select"
import { buttonVariants } from "@/components/ui/button"
import { ui } from "@/i18n"
import { glassSurface } from "@/lib/glass"
import { easeOut } from "@/lib/motion"
import { pathFor, type Route } from "@/routes"
import { site } from "@/site"

const link =
  "rounded-full px-3.5 py-1.5 text-[15px] text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-foreground"

// Past this many pixels of scroll the home page shows its header.
const threshold = 96

// A wide glass capsule pinned to the top (like Lumno's): the serif wordmark, the pages, a language
// switch and the download pill. The home page opens clean and the capsule drops in once the page
// scrolls past the hero's top (200 ms ease-out; Reduce Motion keeps only the fade). Other pages
// show it from the start, since it is their way back home.
export function SiteHeader({ route }: { route: Route }) {
  const revealOnScroll = route.page === "home"
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > threshold))

  if (!revealOnScroll) {
    return (
      <header className="sticky top-3 z-50 px-3 sm:px-4">
        <HeaderBar route={route} />
      </header>
    )
  }
  return (
    <AnimatePresence>
      {scrolled ? (
        <m.header
          key="site-header"
          initial={{ opacity: 0, transform: "translateY(-12px) scale(0.98)" }}
          animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
          exit={{ opacity: 0, transform: "translateY(-12px) scale(0.98)" }}
          transition={{ duration: 0.2, ease: easeOut }}
          className="fixed inset-x-0 top-3 z-50 px-3 sm:px-4"
        >
          <HeaderBar route={route} />
        </m.header>
      ) : null}
    </AnimatePresence>
  )
}

function HeaderBar({ route }: { route: Route }) {
  const t = ui[route.lang]

  return (
      <nav
        aria-label={site.name}
        className={cn(glassSurface, "mx-auto grid max-w-5xl grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-full border p-1.5")}
      >
        {/* Three columns, so the pages sit in the true centre whatever the two sides hold. */}
        <a href={pathFor(route.lang, "home")} className="justify-self-start pl-3.5 font-serif text-2xl text-foreground/80 transition-colors hover:text-foreground">
          {site.name}
        </a>

        <div className="hidden items-center md:flex">
          {(["privacy", "terms", "support"] as const).map((page) => (
            <a key={page} href={pathFor(route.lang, page)} aria-current={route.page === page ? "page" : undefined} className={link}>
              {t.nav[page]}
            </a>
          ))}
          <a href={site.githubUrl} className={link}>
            GitHub
          </a>
        </div>

        <div className="col-start-3 flex items-center gap-2 justify-self-end">
          <LanguageSelect route={route} globe />
          <a href={`${pathFor(route.lang, "home")}#install`} className={cn(buttonVariants(), "h-10 px-5 text-[15px]")}>
            {t.install}
          </a>
        </div>
      </nav>
  )
}
