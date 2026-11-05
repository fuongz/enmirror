// Applies the theme before first paint: the choice saved by the footer toggle ("light", "dark"
// or "system"), else the system appearance. shadcn tokens switch on the `dark` class of <html>.
;(function () {
  var query = window.matchMedia("(prefers-color-scheme: dark)")
  function apply() {
    var choice = null
    try {
      choice = window.localStorage.getItem("enmirror-theme")
    } catch (error) {}
    choice = choice === "light" || choice === "dark" ? choice : "system"
    var dark = choice === "dark" || (choice === "system" && query.matches)
    document.documentElement.dataset.theme = choice
    document.documentElement.classList.toggle("dark", dark)
    document.documentElement.style.colorScheme = dark ? "dark" : "light"
  }
  apply()
  query.addEventListener("change", apply)
  // A cached document may have been saved before the choice changed on another route/tab.
  window.addEventListener("pagereveal", apply)
  window.addEventListener("pageshow", apply)
  window.addEventListener("storage", apply)
})()
