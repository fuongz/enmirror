import { StarIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { ChevronRightIcon, ClockIcon, DownloadIcon, SmartphoneIcon, TagIcon } from "lucide-react"

import { GitHubMark } from "@/components/github-mark"
import { Logo } from "@/components/logo"
import { MirrorPreview } from "@/components/mirror-preview"
import { buttonVariants } from "@/components/ui/button"
import { home } from "@/content/home"
import { cn } from "@/lib/utils"
import type { Lang } from "@/routes"
import { site } from "@/site"

const heroButton = "h-14 gap-3 px-7 text-lg [&_svg:not([class*='size-'])]:size-5"
// The same pill, disabled: flat grey, no gloss or glow, no hover.
const comingSoon =
  "cursor-not-allowed border-black/10 bg-none bg-zinc-100 text-zinc-500 shadow-none hover:brightness-100 dark:border-white/10 dark:bg-white/10 dark:text-white/50"

// One centred column: an open-source pill, a serif headline with the app icon beside it, one
// paragraph, the download and GitHub buttons, a small requirement line, then the app itself.
export function HomePage({ lang }: { lang: Lang }) {
  const doc = home[lang]

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center px-6 pt-16 text-center sm:pt-24">
      <a
        href={site.githubUrl}
        className="group flex items-center gap-2 rounded-full border border-black/10 bg-white/70 py-1.5 pr-3 pl-3.5 text-sm text-foreground/80 shadow-[0_1px_2px_rgb(0_0_0/0.05)] backdrop-blur transition-colors hover:border-black/20 hover:text-foreground dark:border-white/15 dark:bg-white/5"
      >
        <GitHubMark className="size-4" />
        <span>{doc.openSource}</span>
        <span className="rounded-md bg-foreground/[0.06] px-1.5 py-px text-xs font-semibold tracking-wide text-foreground/70">
          {site.license}
        </span>
        <span aria-hidden="true" className="h-4 w-px bg-foreground/15" />
        <span className="flex items-center gap-1">
          <HugeiconsIcon icon={StarIcon} size={15} strokeWidth={1.8} aria-hidden="true" />
          Star
        </span>
        <ChevronRightIcon aria-hidden="true" className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </a>

      <h1 className="mt-8 font-serif text-5xl leading-[1.05] font-medium tracking-[-0.02em] text-balance text-foreground sm:text-7xl">
        {doc.heading}{" "}
        <span className="bg-[linear-gradient(180deg,#9a6cf0,#5a1fc0)] bg-clip-text pr-1 font-normal text-transparent italic">
          {doc.headingAccent}
        </span>
        <Logo className="ml-3 inline-block size-[0.9em] translate-y-[-0.08em] rotate-[8deg] rounded-[24%] align-middle shadow-[0_12px_28px_-10px_rgb(112_44_219/0.6)] sm:ml-5" />
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-pretty text-muted-foreground sm:text-xl">{doc.lead}</p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        {/* The glossy purple pill (ui/button default). Apple's logo may only appear in its official
            badge, so the pill carries a download symbol. Until the app is live it is a disabled
            pill: a label, not a link that goes nowhere. */}
        {site.appStoreUrl ? (
          <a href={site.appStoreUrl} className={cn(buttonVariants({ size: "lg" }), heroButton)}>
            <DownloadIcon aria-hidden="true" />
            {doc.cta}
          </a>
        ) : (
          <p aria-disabled="true" className={cn(buttonVariants({ size: "lg" }), heroButton, comingSoon)}>
            <ClockIcon aria-hidden="true" />
            {doc.ctaSoon}
          </p>
        )}
        <a href={site.githubUrl} className={cn(buttonVariants({ variant: "outline", size: "lg" }), heroButton)}>
          <GitHubMark className="size-5" />
          {doc.github}
        </a>
      </div>

      <p className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        {site.appStoreUrl ? (
          <span className="flex items-center gap-1.5">
            <TagIcon aria-hidden="true" className="size-3.5" />v{site.appVersion}
          </span>
        ) : null}
        <span className="flex items-center gap-1.5">
          <SmartphoneIcon aria-hidden="true" className="size-3.5" />
          {doc.requirement}
        </span>
      </p>

      <div className="mt-20 w-full">
        <MirrorPreview labels={doc.phone} lang={lang} />
      </div>
    </div>
  )
}
