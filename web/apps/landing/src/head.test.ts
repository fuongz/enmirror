/// <reference types="bun" />
import { describe, expect, test } from "bun:test"
import { home } from "@/content/home"
import { headFor } from "@/head"
import { alternatePath, langs, matchRoute, routes } from "@/routes"
import { site } from "@/site"

function values(head: string, attribute: string, name: string): string[] {
  return [...head.matchAll(new RegExp(`<meta ${attribute}="${name}" content="([^"]*)"`, "g"))].map((match) => match[1]!)
}

describe("prerendered SEO metadata", () => {
  for (const route of routes) {
    test(`${route.path} has one canonical and localized social card`, () => {
      const head = headFor(route)
      const url = `${site.origin}${route.path}`
      const image = `${site.origin}/og/${route.lang}.png`
      expect(head.match(/rel="canonical"/g)).toHaveLength(1)
      expect(head).toContain(`<link rel="canonical" href="${url}" />`)
      expect(values(head, "property", "og:url")).toEqual([url])
      expect(values(head, "property", "og:locale")).toEqual([route.lang === "vi" ? "vi_VN" : "en_US"])
      expect(values(head, "property", "og:locale:alternate")).toEqual([route.lang === "vi" ? "en_US" : "vi_VN"])
      expect(values(head, "property", "og:image")).toEqual([image])
      expect(values(head, "property", "og:image:type")).toEqual(["image/png"])
      expect(values(head, "property", "og:image:width")).toEqual(["1200"])
      expect(values(head, "property", "og:image:height")).toEqual(["630"])
      expect(values(head, "name", "twitter:card")).toEqual(["summary_large_image"])
      expect(values(head, "name", "twitter:image")).toEqual([image])
      expect(values(head, "name", "twitter:title")).toEqual(values(head, "property", "og:title"))
      expect(values(head, "name", "twitter:description")).toEqual(values(head, "name", "description"))
      expect(values(head, "name", "twitter:image:alt")).toEqual(values(head, "property", "og:image:alt"))
      expect(values(head, "property", "og:image:alt")[0]!.length).toBeGreaterThan(20)
      expect(head).not.toContain('name="robots" content="noindex"')
      for (const lang of langs) {
        expect(head).toContain(`<link rel="alternate" hreflang="${lang}" href="${site.origin}${alternatePath(route, lang)}" />`)
      }
      expect(head.match(/hreflang="x-default"/g)).toHaveLength(1)
      expect(head).toContain(`hreflang="x-default" href="${site.origin}${alternatePath(route, "vi")}"`)
    })
  }
  test("keeps title and description specific to each page", () => {
    const a = headFor(matchRoute("/en")), b = headFor(matchRoute("/en/support"))
    expect(values(a, "property", "og:title")).not.toEqual(values(b, "property", "og:title"))
    expect(values(a, "name", "description")).not.toEqual(values(b, "name", "description"))
  })
  for (const path of ["/404", "/en/missing"]) {
    test(`${path} has noindex without canonical or alternate URLs`, () => {
      const head = headFor(matchRoute(path))
      expect(values(head, "name", "robots")).toEqual(["noindex"])
      expect(head).not.toContain('rel="canonical"')
      expect(head).not.toContain('rel="alternate"')
      expect(values(head, "property", "og:url")).toEqual([])
      expect(values(head, "property", "og:locale:alternate")).toEqual([])
    })
  }
  test("escapes content and URLs before inserting them into HTML", () => {
    const title = home.vi.title, description = home.vi.description
    try {
      home.vi.title = 'Mirror <test> & "share"'
      home.vi.description = 'A "description" & <script>alert(1)</script>'
      const head = headFor({ path: '/?q="<&', lang: "vi", page: "home" })
      expect(head).toContain('<title>Mirror &lt;test&gt; &amp; &quot;share&quot;</title>')
      expect(values(head, "name", "description")).toEqual(['A &quot;description&quot; &amp; &lt;script&gt;alert(1)&lt;/script&gt;'])
      expect(head).toContain(`href="${site.origin}/?q=&quot;&lt;&amp;"`)
      expect(head).not.toContain("<script>")
      expect(values(head, "name", "twitter:title")).toEqual(values(head, "property", "og:title"))
    } finally {
      home.vi.title = title
      home.vi.description = description
    }
  })
})
