import { LazyMotion, MotionConfig, domAnimation } from "motion/react"

import { LegalArticle } from "@/components/legal-article"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { brand } from "@/content/brand"
import { privacy } from "@/content/privacy"
import { terms } from "@/content/terms"
import { HomePage } from "@/pages/home-page"
import { NotFoundPage } from "@/pages/not-found-page"
import { SupportPage } from "@/pages/support-page"
import type { Route } from "@/routes"

function Page({ route }: { route: Route }) {
  switch (route.page) {
    case "home":
      return <HomePage lang={route.lang} />
    case "privacy":
      return <LegalArticle doc={privacy[route.lang]} lang={route.lang} />
    case "terms":
      return <LegalArticle doc={terms[route.lang]} lang={route.lang} />
    case "support":
      return <SupportPage lang={route.lang} />
    case "brand":
      return <LegalArticle doc={brand[route.lang]} lang={route.lang} />
    case "notFound":
      return <NotFoundPage lang={route.lang} />
  }
}

const loadDomMax = () => import("@/lib/motion-max").then((module) => module.default)

function hasTableOfContents(route: Route): boolean {
  return route.page === "privacy" || route.page === "terms" || route.page === "brand"
}

export function App({ route }: { route: Route }) {
  // reducedMotion="user": with Reduce Motion on, Motion keeps the fades and drops the movement.
  // Policy, terms and brand load domMax (layout animation for the table-of-contents highlight) on demand.
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={hasTableOfContents(route) ? loadDomMax : domAnimation} strict>
        <div className="flex min-h-svh flex-col">
          <SiteHeader route={route} />
          <main className="route-content flex-1">
            <Page route={route} />
          </main>
          <SiteFooter route={route} />
        </div>
      </LazyMotion>
    </MotionConfig>
  )
}
