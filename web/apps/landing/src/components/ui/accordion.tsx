import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { cn } from "cn"
import { ChevronDownIcon } from "lucide-react"
import type { HTMLMotionProps, MotionStyle, Variants } from "motion/react"
import * as m from "motion/react-m"

import { easeOut } from "@/lib/motion"

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("not-last:border-b", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-left text-sm font-medium transition-colors outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring aria-disabled:pointer-events-none aria-disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
          className
        )}
        // enMirror: one chevron that turns with Motion instead of two icons swapped instantly.
        render={(triggerProps, state) => (
          <button {...triggerProps}>
            {triggerProps.children}
            <m.span
              aria-hidden="true"
              className="pointer-events-none flex shrink-0"
              initial={false}
              animate={{ transform: state.open ? "rotate(180deg)" : "rotate(0deg)" }}
              transition={{ duration: 0.2, ease: easeOut }}
            >
              <ChevronDownIcon data-slot="accordion-trigger-icon" />
            </m.span>
          </button>
        )}
        {...props}
      >
        {children}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

// enMirror: the panel opens and closes with Motion (height + opacity, 200 ms strong ease-out),
// interruptible mid-way. Base UI only waits for CSS/WAAPI animations before hiding a closing
// panel, and Motion animates height in JS, so the panel stays mounted and Motion owns the
// collapse: `hidden` is dropped and the closed panel is `inert` instead.
const panelVariants: Variants = {
  open: { height: "auto", opacity: 1 },
  closed: { height: 0, opacity: 0 },
}

function AccordionContent({
  className,
  children,
  ...props
}: Omit<AccordionPrimitive.Panel.Props, "keepMounted" | "hiddenUntilFound" | "render">) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      keepMounted
      className="overflow-hidden text-sm"
      render={({ hidden: _hidden, style, ...panelProps }, state) => (
        <m.div
          {...(panelProps as HTMLMotionProps<"div">)}
          style={style as MotionStyle}
          inert={!state.open}
          variants={panelVariants}
          initial={false}
          animate={state.open ? "open" : "closed"}
          transition={{ duration: 0.2, ease: easeOut }}
        />
      )}
      {...props}
    >
      <div
        className={cn(
          "pt-0 pb-2.5 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
