import { GiftIcon, MegaphoneOffIcon, SmartphoneIcon, UserRoundXIcon, WifiOffIcon, type LucideIcon } from "lucide-react"

import type { HeroFact } from "@/content/home"
import { glassSurface } from "@/lib/glass"
import { cn } from "@/lib/utils"

const icons: Record<HeroFact["icon"], LucideIcon> = {
  free: GiftIcon,
  noAds: MegaphoneOffIcon,
  noAccount: UserRoundXIcon,
  offline: WifiOffIcon,
}

/**
 * The promises under the hero, as glass pills with the app icon's purple gradient behind each
 * symbol. They rise in one after another (CSS only, so the prerendered page shows them without
 * JavaScript); Reduce Motion shows them at once.
 */
export function HeroFacts({ facts, requirement }: { facts: HeroFact[]; requirement: string }) {
  return (
    <div className="flex flex-col items-center gap-5">
      <ul className="flex max-w-3xl flex-wrap justify-center gap-2.5">
        {facts.map((fact, index) => {
          const Icon = icons[fact.icon]
          return (
            <li
              key={fact.label}
              className={cn(
                glassSurface,
                "group flex items-center gap-2 rounded-full border py-1.5 pr-4 pl-1.5 text-sm font-medium",
                "transition-transform duration-200 ease-out hover:-translate-y-0.5",
                "animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-both duration-500 motion-reduce:animate-none",
              )}
              style={{ animationDelay: `${150 + index * 70}ms` }}
            >
              <span
                aria-hidden="true"
                className="flex size-7 items-center justify-center rounded-full bg-[linear-gradient(180deg,#8b45ff,#36108b)] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_2px_6px_-1px_rgb(112_44_219/0.55)] transition-transform duration-200 ease-out group-hover:scale-110"
              >
                <Icon className="size-3.5" strokeWidth={2.4} />
              </span>
              {fact.label}
            </li>
          )
        })}
      </ul>
      <p
        className="animate-in fade-in-0 fill-mode-both rounded-full bg-[linear-gradient(90deg,#8b45ff,#c9a6ff,#36108b)] p-px delay-500 duration-500 motion-reduce:animate-none"
      >
        <span className="flex items-center gap-1.5 rounded-full bg-background/90 px-3.5 py-1 text-xs font-medium text-muted-foreground">
          <SmartphoneIcon aria-hidden="true" className="size-3.5 text-primary" />
          {requirement}
        </span>
      </p>
    </div>
  )
}
