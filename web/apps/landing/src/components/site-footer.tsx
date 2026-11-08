import { WrenchIcon } from "lucide-react"

import { GitHubMark } from "@/components/github-mark"
import { Logo } from "@/components/logo"
import { PageContainer } from "@/components/page-container"
import { ThemeSelect } from "@/components/theme-select"
import { home } from "@/content/home"
import { languages, ui } from "@/i18n"
import { alternatePath, langs, pathFor, type Route } from "@/routes"
import { site } from "@/site"

const link = "underline-offset-4 transition-colors hover:text-foreground hover:underline"
const download = "inline-flex max-w-full items-center gap-2 rounded-full border px-4 py-2.5 text-sm"

export function SiteFooter({ route }: { route: Route }) {
  const t = ui[route.lang]
  const doc = home[route.lang]
  const year = site.legalUpdated.slice(0, 4)

  return (
    <footer className="mt-24 border-t text-sm text-muted-foreground">
      <PageContainer className="px-6 pt-12 pb-6 sm:pt-16">
        <div className="grid gap-10 pb-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-16 md:pb-16">
          <div className="min-w-0">
            <a href={pathFor(route.lang, "home")} className="inline-flex items-center gap-3 text-foreground">
              <Logo className="size-10 rounded-xl" />
              <span className="font-serif text-3xl">{site.name}</span>
            </a>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-pretty">{t.footerDescription}</p>
            <div className="mt-6">
              <a href={`${pathFor(route.lang, "home")}#install`} className={`${download} text-foreground transition-colors hover:bg-muted`}>
                <WrenchIcon aria-hidden="true" className="size-4 shrink-0" />
                {doc.installCta}
              </a>
            </div>
            <a href={site.githubUrl} aria-label="GitHub" className="mt-4 inline-flex size-10 items-center justify-center rounded-full bg-muted/60 transition-colors hover:bg-muted hover:text-foreground">
              <GitHubMark className="size-5" />
            </a>
          </div>
          <div className="grid grid-cols-2 items-start gap-6 sm:gap-10">
            {site.products.length > 0 && (
              <nav aria-label={t.moreProducts} className="min-w-0">
                <h2 className="font-semibold text-foreground">{t.moreProducts}</h2>
                <ul className="mt-5 space-y-3">
                  {site.products.map((product) => (
                    <li key={product.url} className="break-words">
                      <a href={product.url} className={`${link} inline-flex items-center gap-2`}>
                        {product.icon && <img src={product.icon} alt="" width={20} height={20} className="size-5 shrink-0 rounded-sm" loading="lazy" />}
                        {product.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            <nav aria-label={t.nav.support} className="min-w-0">
              <h2 className="font-semibold text-foreground">{t.nav.support}</h2>
              <ul className="mt-5 space-y-3">
                {(["support", "brand", "privacy", "terms"] as const).map((page) => (
                  <li key={page}>
                    <a href={pathFor(route.lang, page)} className={link}>{t.nav[page]}</a>
                  </li>
                ))}
                <li>
                  <a href={`mailto:${site.supportEmail}`} className={link}>{t.contact}</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div className="flex flex-col gap-4 border-t pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <a href={site.developerUrl} className={`${link} w-fit`}>© {year} {site.developerName}</a>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <nav aria-label={t.language} className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {langs.map((lang) => (
                <a
                  key={lang}
                  href={alternatePath(route, lang)}
                  lang={lang}
                  hrefLang={lang}
                  aria-current={route.lang === lang ? "true" : undefined}
                  className={`${link} py-1 ${route.lang === lang ? "font-semibold text-foreground" : ""}`}
                >
                  {languages[lang].name}
                </a>
              ))}
            </nav>
            <ThemeSelect lang={route.lang} />
          </div>
        </div>
      </PageContainer>
    </footer>
  )
}
