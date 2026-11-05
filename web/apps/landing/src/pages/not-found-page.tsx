import { PageContainer } from "@/components/page-container"
import { buttonVariants } from "@/components/ui/button"
import { ui } from "@/i18n"
import { pathFor, type Lang } from "@/routes"

export function NotFoundPage({ lang }: { lang: Lang }) {
  const t = ui[lang]
  return (
    <PageContainer className="flex flex-col items-center gap-4 pt-24 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">{t.notFoundTitle}</h1>
      <p className="text-muted-foreground">{t.notFoundBody}</p>
      <a href={pathFor(lang, "home")} className={buttonVariants({ variant: "outline" })}>
        {t.backHome}
      </a>
    </PageContainer>
  )
}
