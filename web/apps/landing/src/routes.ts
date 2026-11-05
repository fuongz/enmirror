export type Lang = "vi" | "en"
export type PageKey = "home" | "privacy" | "terms" | "support" | "brand" | "notFound"

export type Route = { path: string; lang: Lang; page: PageKey }

export const langs: readonly Lang[] = ["vi", "en"]
const pages: readonly Exclude<PageKey, "notFound">[] = ["home", "privacy", "terms", "support", "brand"]

// Vietnamese lives at the root, English under /en. Paths have no trailing slash; each one is
// prerendered to `<path>.html` so Workers static assets serves it at exactly this URL.
export function pathFor(lang: Lang, page: Exclude<PageKey, "notFound">): string {
  const prefix = lang === "en" ? "/en" : ""
  if (page === "home") return prefix || "/"
  return `${prefix}/${page}`
}

export const routes: Route[] = langs.flatMap((lang) =>
  pages.map((page) => ({ path: pathFor(lang, page), lang, page }))
)

export function matchRoute(pathname: string): Route {
  let path = pathname.replace(/\.html$/, "").replace(/\/index$/, "")
  if (path.length > 1) path = path.replace(/\/+$/, "")
  const found = routes.find((route) => route.path === (path || "/"))
  if (found) return found
  const lang: Lang = path === "/en" || path.startsWith("/en/") ? "en" : "vi"
  return { path, lang, page: "notFound" }
}

export function alternatePath(route: Route, lang: Lang): string {
  return route.page === "notFound" ? pathFor(lang, "home") : pathFor(lang, route.page)
}
