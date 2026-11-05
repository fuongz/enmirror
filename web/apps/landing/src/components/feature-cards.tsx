import * as m from "motion/react-m"
import { cn } from "cn"

import { IPhoneFrame } from "@/components/iphone-frame"
import { MirrorScreen } from "@/components/mirror-screen"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { HomeDoc } from "@/content/home"
import { rise, staggered } from "@/lib/motion"
import { useReveal } from "@/lib/use-reveal"

const grid = staggered(0.08)
const cardIn = rise(16, 0.6)

// Feature cards, two per row: an iPhone showing the app screen, cropped by the card so only one
// end shows, under the feature's title and line. The screen is the feature's screenshot, or the
// mirror drawn in CSS (`art`) while it has none. Cards fade up as they scroll in (only when they
// start below the fold, so the prerendered page never hides them).
export function FeatureCards({ doc }: { doc: HomeDoc }) {
  const reveal = useReveal<HTMLDivElement>()

  return (
    <section className="flex w-full flex-col items-center gap-10">
      <div className="flex max-w-xl flex-col items-center gap-3 text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{doc.featuresTitle}</h2>
        <p className="text-muted-foreground">{doc.featuresLead}</p>
      </div>
      <m.div ref={reveal.ref} variants={grid} animate={reveal.animate} className="grid w-full gap-4 md:grid-cols-2">
        {doc.features.map((feature) => {
          const frame = cn("w-60 shrink-0 sm:w-64", feature.focus === "bottom" ? "mb-6" : "mt-2")
          return (
            <m.div key={feature.key} variants={cardIn}>
              <Card className="h-full pb-0">
                <CardHeader className="text-center">
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.body}</CardDescription>
                </CardHeader>
                <div
                  className={cn(
                    "flex h-80 justify-center overflow-hidden px-6",
                    feature.focus === "bottom" ? "items-end" : "items-start"
                  )}
                >
                  {feature.screenshot ? (
                    <IPhoneFrame
                      className={frame}
                      screenshot={{ src: feature.screenshot, alt: feature.title }}
                      placeholder={doc.screenshotSoon}
                    />
                  ) : (
                    // Decorative: the title and line above say what it shows.
                    <IPhoneFrame className={frame} fullBleed decorative>
                      <MirrorScreen art={feature.art} labels={doc.phone} />
                    </IPhoneFrame>
                  )}
                </div>
              </Card>
            </m.div>
          )
        })}
      </m.div>
    </section>
  )
}
