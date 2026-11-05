import { StrictMode } from "react"
import { hydrateRoot } from "react-dom/client"

import { App } from "@/App"
import { matchRoute } from "@/routes"

const root = document.getElementById("root")
if (root) {
  // 404.html is served for every unknown path, so the page to hydrate is the one baked into it.
  const route = matchRoute(root.dataset.path ?? window.location.pathname)
  hydrateRoot(
    root,
    <StrictMode>
      <App route={route} />
    </StrictMode>
  )
}
