import { resolve } from "node:path"
import { readFile } from "node:fs/promises"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"

// Match the prerendered production pages in dev. An empty client-only shell gets captured
// before React mounts and before JS-injected CSS opts in, so native page transitions skip.
function renderedDevPages(): Plugin {
  return {
    name: "enmirror-rendered-dev-pages",
    apply: "serve",
    configureServer(server) {
      return () => {
        server.middlewares.use(async (request, response, next) => {
          if (
            !["GET", "HEAD"].includes(request.method ?? "") ||
            !request.headers.accept?.includes("text/html")
          ) return next()

          try {
            const url = request.originalUrl ?? request.url ?? "/"
            const path = new URL(url, "http://localhost").pathname
            const template = await readFile(resolve(server.config.root, "index.html"), "utf8")
            const entry = await server.ssrLoadModule("/src/entry-server.tsx")
            const { html, head, lang } = entry.render(path)
            // pathname is URL-encoded; escape it as an HTML attribute as well.
            const attributePath = path.replace(/&/g, "&amp;").replace(/"/g, "&quot;")
            const document = template
              .replace('<html lang="vi">', `<html lang="${lang}">`)
              .replace("<!--app-head-->", head)
              .replace('<div id="root"></div>', `<div id="root" data-path="${attributePath}">${html}</div>`)
            const transformed = await server.transformIndexHtml(url, document)
            response.statusCode = 200
            response.setHeader("Content-Type", "text/html; charset=utf-8")
            response.end(request.method === "HEAD" ? undefined : transformed)
          } catch (error) {
            if (error instanceof Error) server.ssrFixStacktrace(error)
            next(error)
          }
        })
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  appType: "custom",
  plugins: [react(), tailwindcss(), renderedDevPages()],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src"),
    },
  },
})
