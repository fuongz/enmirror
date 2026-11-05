import { GlobeIcon } from "lucide-react"

import { languages, ui } from "@/i18n"
import { alternatePath, langs, type Lang, type Route } from "@/routes"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Every page exists in both languages, so picking one loads the same page in it.
/** `globe`: a round icon-only trigger, for the header. */
export function LanguageSelect({ route, globe = false }: { route: Route; globe?: boolean }) {
  return (
    <Select
      value={route.lang}
      onValueChange={(value) => {
        if (value && value !== route.lang) window.location.assign(alternatePath(route, value as Lang))
      }}
    >
      {globe ? (
        <SelectTrigger
          chevron={false}
          aria-label={ui[route.lang].language}
          className="size-10 justify-center rounded-full border-black/10 bg-white p-0 data-[size=default]:h-10 shadow-[inset_0_-1px_0_rgb(0_0_0/0.04),0_1px_2px_rgb(0_0_0/0.06),0_6px_14px_-6px_rgb(0_0_0/0.15)] hover:bg-zinc-50 dark:border-white/15 dark:bg-white/10 dark:hover:bg-white/15"
        >
          <GlobeIcon aria-hidden="true" className="size-[18px]" />
        </SelectTrigger>
      ) : (
        <SelectTrigger size="sm" variant="ghost" className="rounded-full" aria-label={ui[route.lang].language}>
          <SelectValue>{(value: Lang) => languages[value].name}</SelectValue>
        </SelectTrigger>
      )}
      <SelectContent align="end" alignItemWithTrigger={false}>
        <SelectGroup>
          {langs.map((lang) => (
            <SelectItem key={lang} value={lang} lang={lang}>
              {languages[lang].name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
