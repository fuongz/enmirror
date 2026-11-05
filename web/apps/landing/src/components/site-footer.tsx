import { LanguageSelect } from "@/components/language-select"
import { ThemeSelect } from "@/components/theme-select"
import { ui } from "@/i18n"
import { pathFor, type Route } from "@/routes"
import { site } from "@/site"

const link = "underline-offset-4 transition-colors hover:text-foreground hover:underline"

// One quiet centred line, like chops.md: copyright, the legal pages, contact (spaced, no separators),
// then language and appearance.
export function SiteFooter({ route }: { route: Route }) {
  const t = ui[route.lang]
  const year = site.legalUpdated.slice(0, 4)

  return (
    <footer className="mt-24 flex flex-col items-center gap-4 px-6 pb-10 text-center text-sm text-muted-foreground">
      <p className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5">
        <span>
          © {year} {site.name}
        </span>
        <a href={pathFor(route.lang, "privacy")} className={link}>
          {t.nav.privacy}
        </a>
        <a href={pathFor(route.lang, "terms")} className={link}>
          {t.nav.terms}
        </a>
        <a href={pathFor(route.lang, "support")} className={link}>
          {t.nav.support}
        </a>
        <a href={pathFor(route.lang, "brand")} className={link}>
          {t.nav.brand}
        </a>
        <a href={site.githubUrl} className={link}>
          GitHub
        </a>
        <a href={`mailto:${site.supportEmail}`} className={link}>
          {site.supportEmail}
        </a>
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <LanguageSelect route={route} />
        <ThemeSelect lang={route.lang} />
      </div>
    </footer>
  )
}
