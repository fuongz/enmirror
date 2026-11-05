import type * as React from "react"
import { cn } from "cn"

// The text styles from shadcn/ui's Typography page (ui.shadcn.com/docs/components/typography),
// which ships as recipes rather than a registry component.

export function TypographyP({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("leading-7", className)} {...props} />
}

export function TypographyList({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul className={cn("ml-6 flex list-disc flex-col gap-2", className)} {...props} />
}

export function TypographyLink({ className, ...props }: React.ComponentProps<"a">) {
  return <a className={cn("font-medium text-primary underline underline-offset-4", className)} {...props} />
}

export function TypographyLead({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-xl text-muted-foreground", className)} {...props} />
}
