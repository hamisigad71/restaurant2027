import { cn } from "@/lib/utils"

interface TableTapLogoProps {
  variant?: "dark" | "light"
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeClasses = {
  sm: {
    container: "inline-flex items-center gap-2.5 select-none",
    icon: "h-10 w-10 shrink-0 object-contain",
    wordmark: "text-xl font-extrabold tracking-[-0.03em] leading-none",
    tagline:
      "mt-1 flex items-center gap-1.5 text-[8.5px] font-semibold uppercase tracking-[0.2em] leading-none",
    dot: "inline-block h-1 w-1 rounded-full shrink-0",
  },
  md: {
    container: "inline-flex items-center gap-3 select-none",
    icon: "h-14 w-14 sm:h-16 sm:w-16 shrink-0 object-contain",
    wordmark:
      "text-[1.75rem] sm:text-[2rem] font-extrabold tracking-[-0.035em] leading-[0.95]",
    tagline:
      "mt-1.5 flex items-center gap-1.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.22em] leading-none",
    dot: "inline-block h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full shrink-0",
  },
  lg: {
    container: "inline-flex items-center gap-4 select-none",
    icon: "h-20 w-20 xl:h-[92px] xl:w-[92px] shrink-0 object-contain",
    wordmark:
      "text-[2.25rem] xl:text-[2.65rem] font-extrabold tracking-[-0.035em] leading-[0.95]",
    tagline:
      "mt-2 flex items-center gap-2 text-[10.5px] xl:text-[11.5px] font-semibold uppercase tracking-[0.26em] leading-none",
    dot: "inline-block h-1.5 w-1.5 rounded-full shrink-0",
  },
} as const

const variantClasses = {
  dark: {
    iconShadow: "drop-shadow-[0_10px_24px_rgba(0,0,0,0.45)]",
    tableText: "text-white",
    tapText:
      "bg-gradient-to-b from-[#A2FF42] via-[#7AE72A] to-[#2FB814] bg-clip-text text-transparent",
    taglineText: "text-white/75",
    dotColor: "bg-[#7AE72A]",
  },
  light: {
    iconShadow: "drop-shadow-[0_6px_14px_rgba(11,59,54,0.18)]",
    tableText: "text-[#06282A]",
    tapText:
      "bg-gradient-to-b from-[#66DB1D] via-[#3BB916] to-[#1C8B14] bg-clip-text text-transparent",
    taglineText: "text-[#082420]/70",
    dotColor: "bg-[#4CC718]",
  },
} as const

/** Transparent, background-free TableTap brand lockup with 3D icon and wordmark. */
export function TableTapLogo({
  variant = "dark",
  size = "lg",
  className,
}: TableTapLogoProps) {
  const s = sizeClasses[size]
  const v = variantClasses[variant]

  return (
    <div
      role="img"
      aria-label="TableTap — Scan, Pay, Done"
      className={cn(s.container, className)}
    >
      <img
        src="/logo-icon.png"
        alt=""
        aria-hidden="true"
        className={cn(s.icon, v.iconShadow)}
      />
      <div className="flex flex-col">
        <span className={s.wordmark}>
          <span className={v.tableText}>Table</span>
          <span className={v.tapText}>Tap</span>
        </span>
        <span className={cn(s.tagline, v.taglineText)}>
          <span>SCAN</span>
          <span className={cn(s.dot, v.dotColor)} />
          <span>PAY</span>
          <span className={cn(s.dot, v.dotColor)} />
          <span>DONE</span>
        </span>
      </div>
    </div>
  )
}
