import type * as React from "react"
import { BatteryFullIcon, ImageIcon, SignalIcon, WifiIcon } from "lucide-react"
import { cn } from "cn"

// A concept iPhone 15 bezel (the user asked for one; shadcn has no device frame). The bezel is
// black like the hardware; the screen uses the theme so it follows light and dark mode.
//  - `screenshot`: a real app screenshot (1179 × 2556) fills the screen, its own status bar
//    included; `placeholder` labels the empty screen until one exists.
//  - `fullBleed`: `children` fill the whole screen with no status bar or home indicator, as the
//    mirror screen does (it hides both).
//  - otherwise `children` are laid out under a drawn status bar.
//  - `decorative` hides the whole phone from screen readers.
export function IPhoneFrame({
  className,
  screenshot,
  placeholder,
  fullBleed = false,
  decorative = false,
  children,
}: {
  className?: string
  screenshot?: { src: string | null; alt: string }
  placeholder?: string
  fullBleed?: boolean
  decorative?: boolean
  children?: React.ReactNode
}) {
  return (
    <div
      aria-hidden={decorative || undefined}
      className={cn("relative w-72 rounded-[3rem] bg-zinc-950 p-2.5 shadow-2xl ring-1 ring-zinc-700 sm:w-80", className)}
    >
      <span aria-hidden="true" className="absolute top-24 -left-1 h-8 w-1 rounded-l-sm bg-zinc-800" />
      <span aria-hidden="true" className="absolute top-36 -left-1 h-12 w-1 rounded-l-sm bg-zinc-800" />
      <span aria-hidden="true" className="absolute top-52 -left-1 h-12 w-1 rounded-l-sm bg-zinc-800" />
      <span aria-hidden="true" className="absolute top-40 -right-1 h-16 w-1 rounded-r-sm bg-zinc-800" />

      <div className="relative flex aspect-[9/19.5] flex-col overflow-hidden rounded-[2.4rem] bg-background">
        {screenshot ? (
          screenshot.src ? (
            <img src={screenshot.src} alt={screenshot.alt} className="size-full object-cover object-top" />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-2 bg-muted text-sm text-muted-foreground">
              <ImageIcon aria-hidden="true" className="size-6" />
              {placeholder}
            </div>
          )
        ) : fullBleed ? (
          children
        ) : (
          <>
            {/* Status bar laid out like iOS: the time centred in the space left of the island,
                the indicators centred in the space to its right, all on the island's midline. */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-[1.3%] z-10 grid h-[4.3%] grid-cols-[1fr_32%_1fr] items-center text-[0.72rem] font-semibold"
            >
              <span className="text-center">9:41</span>
              <span />
              <span className="flex items-center justify-center gap-1">
                <SignalIcon className="size-3" />
                <WifiIcon className="size-3" />
                <BatteryFullIcon className="size-3.5" />
              </span>
            </div>
            <div aria-hidden="true" className="h-[7%] shrink-0" />
            {children}
            <span aria-hidden="true" className="absolute bottom-2 left-1/2 h-1 w-28 -translate-x-1/2 rounded-full bg-foreground" />
          </>
        )}
        {/* Dynamic Island in iPhone 15 proportions (126 × 37 pt, 11 pt down, on a 393 × 852 pt
            screen), so it sits exactly over the island in a real screenshot. */}
        <span aria-hidden="true" className="absolute top-[1.3%] left-1/2 h-[4.3%] w-[32%] -translate-x-1/2 rounded-full bg-zinc-950" />
      </div>
    </div>
  )
}
