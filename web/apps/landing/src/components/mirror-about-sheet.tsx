import { useEffect, useRef } from "react"
import { cn } from "cn"
import {
  ChevronRightIcon,
  FileTextIcon,
  GiftIcon,
  GlobeIcon,
  HandIcon,
  LifeBuoyIcon,
  LightbulbIcon,
  MailIcon,
  Maximize2Icon,
  PaletteIcon,
  RulerIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  WifiOffIcon,
  type LucideIcon,
} from "lucide-react"

/** The About sheet's text, the same as the app's (ios/EnMirror/Localizable.xcstrings). */
export type AboutLabels = {
  title: string
  done: string
  tagline: string
  version: string
  highlights: [string, string, string]
  tipsTitle: string
  tips: [string, string, string, string]
  language: string
  languageName: string
  privacyTitle: string
  privacy: string
  privacyPolicy: string
  supportTitle: string
  rate: string
  feedback: string
  help: string
  creditsTitle: string
  credits: [string, string]
}

export type AboutLinks = { privacy: string; support: string; email: string }

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
    "flex w-full items-center text-left not-last:border-b not-last:border-white/10",
    (href || onPress) && "cursor-pointer outline-none hover:bg-white/5 focus-visible:bg-white/10",
    muted ? "text-white/60" : "text-white",
  )
  const style = { gap: pt(12), padding: `${pt(11)} ${pt(16)}`, fontSize: pt(15), lineHeight: 1.3 }
  const content = (
    <>
      <Icon aria-hidden="true" className="shrink-0" style={{ width: pt(20), height: pt(20), color: href || onPress ? accent : undefined }} />
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

const chevron = <ChevronRightIcon aria-hidden="true" className="shrink-0 text-white/30" style={{ width: pt(16), height: pt(16) }} />

/**
 * The app's About sheet (ios/EnMirror/About/AboutSheet.swift) inside the demo phone: a dark sheet
 * that rises over the mirror, with the same sections. Escape or Done closes it and focus goes back
 * to the info button; the store rating is in the app only, so it shows the demo's toast.
 */
export function MirrorAboutSheet({
  labels,
  links,
  appVersion,
  onClose,
  onInApp,
}: {
  labels: AboutLabels
  links: AboutLinks
  appVersion: string
  onClose: () => void
  onInApp: () => void
}) {
  const done = useRef<HTMLButtonElement>(null)

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

        <div className="flex-1 overflow-y-auto overscroll-contain" style={{ padding: `0 ${pt(16)} ${pt(28)}` }}>
          <header className="flex flex-col items-center text-center" style={{ gap: pt(8), paddingTop: pt(14) }}>
            <img src="/logo.png" alt="" width={512} height={512} className="shadow-lg" style={{ width: pt(88), height: pt(88), borderRadius: pt(20) }} />
            <p className="font-bold" style={{ fontSize: pt(22) }}>
              enMirror
            </p>
            <p className="text-white/60" style={{ fontSize: pt(15) }}>
              {labels.tagline}
            </p>
            <p className="flex items-center text-white/80 tabular-nums" style={{ gap: pt(5), fontSize: pt(13) }}>
              {labels.version} {appVersion}
            </p>
          </header>

          <Section>
            <Row icon={GiftIcon}>{labels.highlights[0]}</Row>
            <Row icon={WifiOffIcon}>{labels.highlights[1]}</Row>
            <Row icon={SparklesIcon}>{labels.highlights[2]}</Row>
          </Section>

          <Section title={labels.tipsTitle}>
            <Row icon={HandIcon}>{labels.tips[0]}</Row>
            <Row icon={Maximize2Icon}>{labels.tips[1]}</Row>
            <Row icon={RulerIcon}>{labels.tips[2]}</Row>
            <Row icon={LightbulbIcon}>{labels.tips[3]}</Row>
          </Section>

          <Section>
            <Row icon={GlobeIcon} trailing={<span className="text-white/50">{labels.languageName}</span>}>
              {labels.language}
            </Row>
          </Section>

          <Section title={labels.privacyTitle}>
            <Row icon={ShieldCheckIcon}>{labels.privacy}</Row>
            <Row icon={FileTextIcon} href={links.privacy} trailing={chevron}>
              {labels.privacyPolicy}
            </Row>
          </Section>

          <Section title={labels.supportTitle}>
            <Row icon={StarIcon} onPress={onInApp} trailing={chevron}>
              {labels.rate}
            </Row>
            <Row icon={MailIcon} href={`mailto:${links.email}?subject=enMirror`} trailing={chevron}>
              {labels.feedback}
            </Row>
            <Row icon={LifeBuoyIcon} href={links.support} trailing={chevron}>
              {labels.help}
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
        </div>
      </div>
    </div>
  )
}
