import { MailIcon } from "lucide-react"

import { PageContainer } from "@/components/page-container"
import { TypographyLead } from "@/components/typography"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { support } from "@/content/support"
import type { Lang } from "@/routes"
import { site } from "@/site"

export function SupportPage({ lang }: { lang: Lang }) {
  const doc = support[lang]

  return (
    <PageContainer className="flex flex-col gap-10 pt-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold tracking-tight">{doc.title}</h1>
        <TypographyLead>{doc.intro}</TypographyLead>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>{doc.contactTitle}</CardTitle>
          <CardDescription>{doc.contactBody}</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-wrap gap-3">
          <a href={`mailto:${site.supportEmail}`} className={buttonVariants({ size: "lg" })}>
            <MailIcon data-icon="inline-start" />
            {doc.emailLabel}
          </a>
          <Badge variant="outline">{site.supportEmail}</Badge>
        </CardFooter>
      </Card>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold tracking-tight">{doc.faqTitle}</h2>
        <Accordion multiple>
          {doc.faq.map((item) => (
            <AccordionItem key={item.id} value={item.id} id={item.id}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </PageContainer>
  )
}
