import { cn } from "cn"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { useMemo, type ReactNode } from "react"

import { PageContainer } from "@/components/page-container"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { formatDate, ui } from "@/i18n"
import { scrollToElement, slide } from "@/lib/motion"
import { useActiveSection } from "@/lib/use-active-section"
import type { Lang } from "@/routes"

export type LegalSection = { id: string; title: string; body: ReactNode }

export type LegalDoc = {
  title: string
  description: string
  /** Shown as "Last updated" for policies; a page like Brand leaves it out. */
  updated?: string
  intro: ReactNode
  sections: LegalSection[]
}

export function LegalArticle({ doc, lang }: { doc: LegalDoc; lang: Lang }) {
  const t = ui[lang]

  return (
    <PageContainer className="grid gap-10 pt-10 lg:grid-cols-4">
      <article className="flex min-w-0 flex-col gap-10 lg:col-span-3">
        <header className="flex flex-col gap-4">
          <h1 className="text-4xl font-semibold tracking-tight text-balance">{doc.title}</h1>
          {doc.updated ? (
            <div>
              <Badge variant="secondary">
                {t.updated}: <time dateTime={doc.updated}>{formatDate(doc.updated, lang)}</time>
              </Badge>
            </div>
          ) : null}
          <div className="flex flex-col gap-4">{doc.intro}</div>
        </header>
        {doc.sections.map((section, index) => (
          <section key={section.id} id={section.id} className="flex scroll-mt-24 flex-col gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              {index + 1}. {section.title}
            </h2>
            {section.body}
          </section>
        ))}
      </article>
      <aside className="hidden lg:block">
        <TableOfContents sections={doc.sections} label={t.onThisPage} />
      </aside>
    </PageContainer>
  )
}

// "On this page": a highlight slides to the section being read (state indication), and a click
// scrolls there with Motion instead of jumping (spatial consistency). Without JS the links are
// plain anchors.
function TableOfContents({ sections, label }: { sections: LegalSection[]; label: string }) {
  const ids = useMemo(() => sections.map((section) => section.id), [sections])
  const [active, pin] = useActiveSection(ids)
  const reduce = useReducedMotion() ?? false

  return (
    <nav aria-label={label} className="sticky top-24 flex flex-col gap-1">
      <p className="px-2 pb-2 text-sm font-medium">{label}</p>
      {sections.map((section, index) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          aria-current={active === section.id ? "location" : undefined}
          onClick={(event) => {
            const el = document.getElementById(section.id)
            if (!el) return
            event.preventDefault()
            pin(section.id)
            history.replaceState(null, "", `#${section.id}`)
            scrollToElement(el, reduce)
          }}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "relative isolate h-auto w-full shrink justify-start py-1.5 text-left whitespace-normal"
          )}
        >
          {active === section.id ? (
            <m.span layoutId="toc-active" transition={slide} className="absolute inset-0 -z-10 rounded-lg bg-muted" />
          ) : null}
          {index + 1}. {section.title}
        </a>
      ))}
    </nav>
  )
}
