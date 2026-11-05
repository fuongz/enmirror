// Runs after `vite build` (client) and `vite build --ssr` (server entry): renders every route to
// dist/<path>.html plus 404.html, sitemap.xml and robots.txt, then removes the server bundle.
// With ENMIRROR_RELEASE=1 (the deploy script) it fails if a page still shows a placeholder: the
// site.ts developer name or any "[TODO…]" left in the content.
import { readFile, rm, writeFile, mkdir } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

type Entry = {
  routes: { path: string }[]
  render(path: string): { html: string; head: string; lang: string }
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const dist = join(root, "dist")
const ssr = join(root, "dist-ssr")
const origin = "https://enmirror.trinhvaphuong.com"
const placeholder = /\[(?:DEVELOPER_NAME|TODO)[^\]]*\]/
const release = process.env.ENMIRROR_RELEASE === "1"

const entry = (await import(pathToFileURL(join(ssr, "entry-server.js")).href)) as Entry
const template = await readFile(join(dist, "index.html"), "utf8")

const pages = [
  ...entry.routes.map((route) => ({
    path: route.path,
    file: route.path === "/" ? "index.html" : `${route.path.slice(1)}.html`,
  })),
  { path: "/404", file: "404.html" },
]

let placeholders = 0
for (const page of pages) {
  const { html, head, lang } = entry.render(page.path)
  const out = template
    .replace('<html lang="vi">', `<html lang="${lang}">`)
    .replace("<!--app-head-->", head)
    .replace('<div id="root"></div>', `<div id="root" data-path="${page.path}">${html}</div>`)
  const found = out.match(placeholder)
  if (found) {
    placeholders++
    console.warn(`placeholder ${found[0]} in dist/${page.file}`)
  }
  const target = join(dist, page.file)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, out)
  console.log(`prerendered ${page.path} -> dist/${page.file}`)
}

const urls = entry.routes.map((route) => `  <url><loc>${origin}${route.path}</loc></url>`).join("\n")
await writeFile(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
)
await writeFile(join(dist, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`)
await rm(ssr, { recursive: true, force: true })

if (placeholders > 0) {
  const message = `${placeholders} page(s) still show a placeholder; set site.developerName in src/site.ts and fill every [TODO…]`
  if (release) {
    console.error(`error: ${message}`)
    process.exit(1)
  }
  console.warn(`warning: ${message}`)
}
