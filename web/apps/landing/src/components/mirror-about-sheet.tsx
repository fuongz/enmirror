import { useEffect, useRef, useState } from "react"
import { cn } from "cn"
import {
  BadgeCheckIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  CodeIcon,
  FileTextIcon,
  GlobeIcon,
  InfoIcon,
  LifeBuoyIcon,
  MailIcon,
  PaletteIcon,
  SparklesIcon,
  type LucideIcon,
} from "lucide-react"

/** The About sheet's text, the same as the app's (ios/EnMirror/Localizable.xcstrings). */
export type AboutLabels = {
  title: string
  done: string
  tagline: string
  version: string
  copied: string
  /** The feature bento (ios/EnMirror/About/FeatureBento.swift). */
  bento: Bento
  language: string
  languageName: string
  privacyPolicy: string
  supportTitle: string
  source: string
  feedback: string
  help: string
  creditsTitle: string
  credits: [string, string]
}

type Bento = { title: string; subtitle: string; checks: [string, string, string]; offline: string; light: string }

export type AboutLinks = { privacy: string; support: string; email: string; source: string }

// Sizes in the app's points on a 393 pt wide screen (as in mirror-screen.tsx).
const pt = (value: number) => `calc(${value} * 100cqw / 393)`

// iOS dark-mode grouped list colours; the app runs in dark appearance.
const sheetBackground = "#1c1c1e"
const rowBackground = "#2c2c2e"
const accent = "#FFC76B"

function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: pt(22) }}>
      {title ? (
        <h3 className="uppercase text-white/50" style={{ fontSize: pt(13), paddingInline: pt(16), marginBottom: pt(7), letterSpacing: "0.02em" }}>
          {title}
        </h3>
      ) : null}
      <div className="overflow-hidden" style={{ background: rowBackground, borderRadius: pt(12) }}>
        {children}
      </div>
    </section>
  )
}

function Row({ icon: Icon, children, trailing, href, onPress, muted }: { icon: LucideIcon; children: React.ReactNode; trailing?: React.ReactNode; href?: string; onPress?: () => void; muted?: boolean }) {
  const className = cn(
    "flex w-full items-start text-left not-last:border-b not-last:border-white/10",
    (href || onPress) && "cursor-pointer outline-none hover:bg-white/5 focus-visible:bg-white/10",
    muted ? "text-white/60" : "text-white",
  )
  const style = { gap: pt(12), padding: `${pt(11)} ${pt(16)}`, fontSize: pt(15), lineHeight: 1.3 }
  const content = (
    <>
      {/* Top-aligned with the first line of text, like the app's TopAlignedLabelStyle. */}
      <Icon aria-hidden="true" className="shrink-0" style={{ width: pt(20), height: pt(20), marginTop: pt(-0.5), color: href || onPress ? accent : undefined }} />
      <span className="flex-1">{children}</span>
      {trailing}
    </>
  )
  if (href) {
    return (
      <a href={href} className={className} style={style}>
        {content}
      </a>
    )
  }
  if (onPress) {
    return (
      <button type="button" onClick={onPress} className={className} style={style}>
        {content}
      </button>
    )
  }
  return (
    <div className={className} style={style}>
      {content}
    </div>
  )
}

// #2C2C2E: the row colour and the artwork's background, so each image melts into its card.
const card = "#2c2c2e"

/**
 * What enMirror promises, as the app's bento (ios/EnMirror/About/FeatureBento.swift): a wide card
 * with the free checklist and 3D ribbons on the right, over two half cards with artwork on top.
 */
function FeatureBento({ bento }: { bento: Bento }) {
  const half = (src: string, caption: string) => (
    <div className="flex flex-1 flex-col overflow-hidden text-center" style={{ background: card, borderRadius: pt(22) }}>
      <img src={src} alt="" width={600} height={400} className="aspect-[3/2] w-full" />
      <p className="text-white/60" style={{ fontSize: pt(14), lineHeight: 1.3, padding: `0 ${pt(12)} ${pt(16)}` }}>
        {caption}
      </p>
    </div>
  )
  return (
    <div className="flex flex-col text-left" style={{ gap: pt(12), marginTop: pt(18) }}>
      <div className="flex overflow-hidden" style={{ height: pt(200), background: card, borderRadius: pt(22) }}>
        <div className="flex flex-1 flex-col" style={{ padding: pt(18), gap: pt(6) }}>
          <p className="font-bold" style={{ fontSize: pt(22) }}>
            {bento.title}
          </p>
          <p className="text-white/60" style={{ fontSize: pt(15) }}>
            {bento.subtitle}
          </p>
          <ul className="mt-auto flex flex-col text-white/60" style={{ gap: pt(6), fontSize: pt(15) }}>
            {bento.checks.map((check) => (
              <li key={check} className="flex items-center" style={{ gap: pt(8) }}>
                <BadgeCheckIcon aria-hidden="true" className="shrink-0" style={{ width: pt(17), height: pt(17) }} />
                {check}
              </li>
            ))}
          </ul>
        </div>
        <img src="/about/ribbons.webp" alt="" width={600} height={600} className="h-full shrink-0 object-cover" style={{ width: pt(140) }} />
      </div>
      <div className="flex" style={{ gap: pt(12) }}>
        {half("/about/ripple.webp", bento.offline)}
        {half("/about/glow.webp", bento.light)}
      </div>
    </div>
  )
}

const chevron = <ChevronRightIcon aria-hidden="true" className="shrink-0 self-center text-white/30" style={{ width: pt(16), height: pt(16) }} />

/**
 * The app's About sheet (ios/EnMirror/About/AboutSheet.swift) inside the demo phone: a dark sheet
 * that rises over the mirror, with the same sections. Escape or Done closes it and focus goes back
 * to the info button.
 */
export function MirrorAboutSheet({
  labels,
  links,
  appVersion,
  onClose,
}: {
  labels: AboutLabels
  links: AboutLinks
  appVersion: string
  onClose: () => void
}) {
  const done = useRef<HTMLButtonElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1500)
    return () => window.clearTimeout(timer)
  }, [copied])

  useEffect(() => {
    done.current?.focus({ preventScroll: true })
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-end bg-black/40 animate-in fade-in-0 duration-200 motion-reduce:animate-none">
      <div
        role="dialog"
        aria-label={labels.title}
        className="flex flex-col overflow-hidden text-white animate-in slide-in-from-bottom duration-300 ease-out motion-reduce:animate-none"
        style={{ height: "88%", background: sheetBackground, borderTopLeftRadius: pt(34), borderTopRightRadius: pt(34) }}
      >
        <span aria-hidden="true" className="mx-auto shrink-0 rounded-full bg-white/30" style={{ width: pt(36), height: pt(5), marginTop: pt(6) }} />
        <div className="relative flex shrink-0 items-center justify-center" style={{ height: pt(44) }}>
          <h2 className="font-semibold" style={{ fontSize: pt(17) }}>
            {labels.title}
          </h2>
          <button
            ref={done}
            type="button"
            onClick={onClose}
            className="absolute cursor-pointer rounded-full font-semibold outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{ right: pt(16), fontSize: pt(17), color: accent, padding: `${pt(4)} ${pt(8)}` }}
          >
            {labels.done}
          </button>
        </div>

        <div className="mirror-about-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain" style={{ padding: `0 ${pt(16)} ${pt(28)}` }}>
          <header className="flex flex-col items-center text-center" style={{ gap: pt(8), paddingTop: pt(14) }}>
            <img src="/logo.png" alt="" width={512} height={512} className="shadow-lg" style={{ width: pt(88), height: pt(88), borderRadius: pt(20) }} />
            <p className="font-bold" style={{ fontSize: pt(22) }}>
              enMirror
            </p>
            <p className="text-white/60" style={{ fontSize: pt(15) }}>
              {labels.tagline}
            </p>
          </header>

          <FeatureBento bento={labels.bento} />

          <Section>
            <Row icon={GlobeIcon} trailing={<span className="self-center text-white/50">{labels.languageName}</span>}>
              {labels.language}
            </Row>
          </Section>

          <Section title={labels.supportTitle}>
            <Row icon={CodeIcon} href={links.source} trailing={chevron}>
              {labels.source}
            </Row>
            <Row icon={MailIcon} href={`mailto:${links.email}?subject=enMirror`} trailing={chevron}>
              {labels.feedback}
            </Row>
            <Row icon={LifeBuoyIcon} href={links.support} trailing={chevron}>
              {labels.help}
            </Row>
            <Row icon={FileTextIcon} href={links.privacy} trailing={chevron}>
              {labels.privacyPolicy}
            </Row>
          </Section>

          <Section title={labels.creditsTitle}>
            <Row icon={PaletteIcon} muted>
              {labels.credits[0]}
            </Row>
            <Row icon={SparklesIcon} muted>
              {labels.credits[1]}
            </Row>
          </Section>

          <Section>
            <Row
              icon={copied ? CheckCircle2Icon : InfoIcon}
              onPress={() => {
                void navigator.clipboard?.writeText(appVersion)
                setCopied(true)
              }}
              trailing={<span className="self-center text-white/50 tabular-nums">{copied ? labels.copied : appVersion}</span>}
            >
              {labels.version}
            </Row>
          </Section>
        </div>
      </div>
    </div>
  )
}
