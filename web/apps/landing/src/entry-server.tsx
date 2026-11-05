import { StrictMode } from "react"
import { renderToString } from "react-dom/server"

import { App } from "@/App"
import { headFor } from "@/head"
import { matchRoute, routes } from "@/routes"

export { routes }

// Used by scripts/prerender.ts at build time, never at request time.
export function render(path: string) {
  const route = matchRoute(path)
  const html = renderToString(
    <StrictMode>
      <App route={route} />
    </StrictMode>
  )
  return { html, head: headFor(route), lang: route.lang }
}
