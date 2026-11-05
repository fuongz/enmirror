import { cn } from "cn"

// The app icon: the hand mirror on the enMirror purple gradient (ios/EnMirror/AppIcon.icon), as a
// 512 px PNG in public/logo.png (scripts/make-icons.swift). Decorative next to the "enMirror"
// wordmark, so it has no alt text.
export function Logo({ className }: { className?: string }) {
  return <img src="/logo.png" alt="" width={512} height={512} className={cn("size-8 shrink-0", className)} />
}
