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

// SEO and social metadata are rendered into HTML so crawlers do not need JavaScript.
export function headFor(route: Route): string {
  const { title, description } = meta(route)
  const social = site.social[route.lang]
  const imageUrl = `${site.origin}${social.image}`
  const tags = [
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(description)}" />`,
    `<meta property="og:title" content="${escape(title)}" />`,
    `<meta property="og:description" content="${escape(description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escape(site.name)}" />`,
    `<meta property="og:locale" content="${social.locale}" />`,
    `<meta property="og:image" content="${escape(imageUrl)}" />`,
    `<meta property="og:image:type" content="image/png" />`,
    `<meta property="og:image:width" content="${site.social.imageWidth}" />`,
    `<meta property="og:image:height" content="${site.social.imageHeight}" />`,
    `<meta property="og:image:alt" content="${escape(social.imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escape(title)}" />`,
    `<meta name="twitter:description" content="${escape(description)}" />`,
    `<meta name="twitter:image" content="${escape(imageUrl)}" />`,
    `<meta name="twitter:image:alt" content="${escape(social.imageAlt)}" />`,
  ]
  if (route.page === "notFound") {
    tags.push(`<meta name="robots" content="noindex" />`)
  } else {
    const url = escape(`${site.origin}${route.path}`)
    tags.push(`<link rel="canonical" href="${url}" />`)
    tags.push(`<meta property="og:url" content="${url}" />`)
    for (const lang of langs) {
      tags.push(`<link rel="alternate" hreflang="${lang}" href="${escape(`${site.origin}${alternatePath(route, lang)}`)}" />`)
      if (lang !== route.lang) {
        tags.push(`<meta property="og:locale:alternate" content="${site.social[lang].locale}" />`)
      }
    }
    tags.push(`<link rel="alternate" hreflang="x-default" href="${escape(`${site.origin}${alternatePath(route, "vi")}`)}" />`)
  }
  return tags.join("\n    ")
}
