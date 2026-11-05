// Liquid Glass (Apple's material) for the floating header capsule: a translucent fill over a backdrop blur with extra saturation, a bright top edge where light
// catches the glass, a soft lift shadow; solid with "Reduce transparency".
export const glassSurface =
  "border-white/60 bg-white/55 text-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.9),inset_0_-1px_0_rgb(0_0_0/0.04),0_6px_20px_-6px_rgb(0_0_0/0.18)] backdrop-blur-xl backdrop-saturate-150 dark:border-white/15 dark:bg-white/10 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_6px_20px_-6px_rgb(0_0_0/0.6)] [@media(prefers-reduced-transparency:reduce)]:bg-background [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none"
