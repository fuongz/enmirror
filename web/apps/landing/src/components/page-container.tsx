import type * as React from "react"
import { cn } from "cn"

/** The one content width: header, footer and every page line up on it. */
export function PageContainer({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-5xl px-4", className)} {...props} />
}
