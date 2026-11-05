import { brand } from "@/content/brand"
import { home } from "@/content/home"
import { privacy } from "@/content/privacy"
import { support } from "@/content/support"
import { terms } from "@/content/terms"
import { ui } from "@/i18n"
import { alternatePath, langs, type Route } from "@/routes"
import { site } from "@/site"

function escape(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

function meta(route: Route): { title: string; description: string } {
  switch (route.page) {
    case "home":
      return home[route.lang]
    case "privacy":
      return { title: `${privacy[route.lang].title} – ${site.name}`, description: privacy[route.lang].description }
    case "terms":
      return { title: `${terms[route.lang].title} – ${site.name}`, description: terms[route.lang].description }
    case "brand":
      return { title: `${brand[route.lang].title} – ${site.name}`, description: brand[route.lang].description }
    case "support":
      return { title: `${support[route.lang].title} – ${site.name}`, description: support[route.lang].description }
    case "notFound":
      return { title: `${ui[route.lang].notFoundTitle} – ${site.name}`, description: ui[route.lang].notFoundBody }
  }
}

// The <head> tags for one prerendered page: title, description, canonical URL, hreflang links.
export function headFor(route: Route): string {
  const { title, description } = meta(route)
  const tags = [
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(description)}" />`,
    `<meta property="og:title" content="${escape(title)}" />`,
    `<meta property="og:description" content="${escape(description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${site.name}" />`,
  ]
  if (route.page === "notFound") {
    tags.push(`<meta name="robots" content="noindex" />`)
  } else {
    tags.push(`<link rel="canonical" href="${site.origin}${route.path}" />`)
    for (const lang of langs) {
      tags.push(`<link rel="alternate" hreflang="${lang}" href="${site.origin}${alternatePath(route, lang)}" />`)
    }
    tags.push(`<link rel="alternate" hreflang="x-default" href="${site.origin}${alternatePath(route, "vi")}" />`)
  }
  return tags.join("\n    ")
}
