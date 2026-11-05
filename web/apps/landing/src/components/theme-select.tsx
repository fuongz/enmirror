import { MonitorIcon, MoonIcon, SunIcon, type LucideIcon } from "lucide-react"
import { useLayoutEffect, useState } from "react"

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ui } from "@/i18n"
import type { Lang } from "@/routes"

type Theme = "light" | "dark" | "system"
const storageKey = "enmirror-theme" // read before paint by public/theme.js
const themes: readonly Theme[] = ["light", "dark", "system"]
const icons: Record<Theme, LucideIcon> = { light: SunIcon, dark: MoonIcon, system: MonitorIcon }

function apply(theme: Theme) {
  const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  document.documentElement.dataset.theme = theme
  document.documentElement.classList.toggle("dark", dark)
  document.documentElement.style.colorScheme = dark ? "dark" : "light"
}

// Render every label in SSR; CSS picks the one theme.js selected before the first paint.
// React's initial value stays deterministic for hydration without flashing a system label.
export function ThemeSelect({ lang }: { lang: Lang }) {
  const t = ui[lang].theme
  const [theme, setTheme] = useState<Theme>("system")

  useLayoutEffect(() => {
    const sync = () => {
      const saved = document.documentElement.dataset.theme
      setTheme(saved === "light" || saved === "dark" ? saved : "system")
    }
    sync()
    window.addEventListener("pageshow", sync)
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener("pageshow", sync)
      window.removeEventListener("storage", sync)
    }
  }, [])

  const label = (value: Theme) => {
    const Icon = icons[value]
    return (
      <>
        <Icon />
        <span>{t[value]}</span>
      </>
    )
  }

  return (
    <Select
      value={theme}
      onValueChange={(value) => {
        if (!value) return
        const next = value as Theme
        setTheme(next)
        try {
          window.localStorage.setItem(storageKey, next)
        } catch {
          // Storage blocked: the choice lasts until reload.
        }
        apply(next)
      }}
    >
      <SelectTrigger size="sm" variant="ghost" className="rounded-full" aria-label={t.label}>
        <SelectValue>
          {themes.map((value) => (
            <span key={value} data-theme-label={value} className="items-center gap-1.5">
              {label(value)}
            </span>
          ))}
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="end" alignItemWithTrigger={false}>
        <SelectGroup>
          {themes.map((value) => (
            <SelectItem key={value} value={value}>
              {label(value)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
