// Keep native links, history, scroll restoration and no-JS navigation.
// pagereveal must be registered in a classic head script, before the first render.
;(function () {
  var keyboard = false
  window.addEventListener("keydown", function () { keyboard = true }, true)
  window.addEventListener("pointerdown", function () { keyboard = false }, true)

  window.addEventListener("pageswap", function (event) {
    if (keyboard && event.viewTransition) event.viewTransition.skipTransition()
  })

  window.addEventListener("pagereveal", function (event) {
    // The page fade replaces the decorative phone/mirror entrance on animated arrivals.
    // Keep the flag until the next reveal so hydration cannot replay that sequence.
    document.documentElement.toggleAttribute("data-page-arrival", !!event.viewTransition)
    keyboard = false
  })
})()
