import { GitHubMark } from "@/components/github-mark"
import { buttonVariants } from "@/components/ui/button"
import type { InstallGuide } from "@/content/home"
import { cn } from "@/lib/utils"
import { site } from "@/site"

/** How to build enMirror and run it on an iPhone. The hero and header buttons scroll here. */
export function InstallSection({ guide }: { guide: InstallGuide }) {
  return (
    <section id="install" aria-labelledby="install-title" className="mt-28 w-full scroll-mt-28 text-left">
      <h2 id="install-title" className="text-center font-serif text-4xl font-medium tracking-[-0.01em] text-balance sm:text-5xl">
        {guide.title}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-pretty text-muted-foreground">{guide.lead}</p>

      <ol className="mx-auto mt-10 grid max-w-3xl gap-4">
        {guide.steps.map((step, index) => (
          <li key={step.title} className="flex gap-4 rounded-2xl border bg-card/60 p-5 sm:p-6">
            <span
              aria-hidden="true"
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground/[0.06] text-sm font-semibold tabular-nums"
            >
              {index + 1}
            </span>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground">{step.title}</h3>
              <p className="mt-1 text-pretty break-words text-muted-foreground">{step.body}</p>
              {step.code ? (
                <pre className="mt-3 overflow-x-auto rounded-xl bg-foreground/[0.05] px-4 py-3 text-sm">
                  <code>{step.code}</code>
                </pre>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-pretty text-muted-foreground">{guide.note}</p>

      <div className="mt-8 flex justify-center">
        <a href={site.installGuideUrl} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 gap-2.5 px-6")}>
          <GitHubMark className="size-5" />
          {guide.guideLink}
        </a>
      </div>
    </section>
  )
}
