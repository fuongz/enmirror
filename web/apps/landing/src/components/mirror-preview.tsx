import { HandIcon } from "lucide-react"
import * as m from "motion/react-m"

import { IPhoneFrame } from "@/components/iphone-frame"
import { MirrorDemo } from "@/components/mirror-demo"
import type { DemoLabels } from "@/components/mirror-screen"
import { rise } from "@/lib/motion"
import type { Lang } from "@/routes"

// The phone lands just after load. Reduce Motion keeps the fade (MotionConfig drops the
// movement); on a page transition it is shown at once (data-page-intro, see index.css).
const phoneIn = rise(24, 0.7, 0.2)

// The hero's iPhone with the playable mirror (MirrorDemo) and a hint to try it.
export function MirrorPreview({ labels, lang }: { labels: DemoLabels; lang: Lang }) {
  return (
    <m.section
      data-page-intro
      aria-label={labels.region}
      variants={phoneIn}
      initial="hidden"
      animate="show"
      className="flex w-full flex-col items-center gap-6"
    >
      <IPhoneFrame className="-rotate-2" fullBleed>
        <MirrorDemo labels={labels} lang={lang} />
      </IPhoneFrame>
      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <HandIcon aria-hidden="true" className="size-4" />
        {labels.hint}
      </p>
    </m.section>
  )
}
