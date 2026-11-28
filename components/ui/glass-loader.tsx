"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { EASE_OUT, FAST_TRANSITION } from "@/lib/motion"
import { cn } from "@/lib/utils"

const STATUS_MESSAGES = [
  "Initialising your workspace…",
  "Loading table assignments…",
  "Syncing kitchen display…",
  "Almost ready…",
]

const STATUS_PERCENTS = [24, 52, 78, 100]

export interface GlassLoaderProps {
  className?: string
  fullScreen?: boolean
  initialDuration?: number
  routeDuration?: number
  /** Backwards-compatible alias for initialDuration */
  autoHideDuration?: number
}

export function GlassLoader({
  className,
  fullScreen = true,
  initialDuration = 1150,
  routeDuration = 420,
  autoHideDuration,
}: GlassLoaderProps) {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()
  const isFirstLoad = useRef(true)

  const [visible, setVisible] = useState(true)
  const [step, setStep] = useState(0)
  const [isInitialCycle, setIsInitialCycle] = useState(true)

  const resolvedInitial = autoHideDuration ?? initialDuration

  useLayoutEffect(() => {
    if (visible) {
      document.body.setAttribute("data-loading", "true")
    } else {
      document.body.removeAttribute("data-loading")
    }
    return () => {
      document.body.removeAttribute("data-loading")
    }
  }, [visible])

  useEffect(() => {
    const first = isFirstLoad.current
    isFirstLoad.current = false
    setIsInitialCycle(first)
    setStep(first ? 0 : STATUS_MESSAGES.length - 1)
    setVisible(true)

    const baseDuration = first ? resolvedInitial : routeDuration
    const duration = reduceMotion ? Math.min(baseDuration, 250) : baseDuration

    const stepInterval = first && duration > 400
      ? setInterval(() => {
          setStep((prev) => (prev < STATUS_MESSAGES.length - 1 ? prev + 1 : prev))
        }, Math.max(180, Math.floor(duration / STATUS_MESSAGES.length)))
      : null

    const hideTimer = setTimeout(() => {
      setStep(STATUS_MESSAGES.length - 1)
      setVisible(false)
      document.body.removeAttribute("data-loading")
    }, duration)

    return () => {
      if (stepInterval) clearInterval(stepInterval)
      clearTimeout(hideTimer)
    }
  }, [pathname, resolvedInitial, routeDuration, reduceMotion])

  const pct = STATUS_PERCENTS[step] ?? 100
  const statusText = isInitialCycle ? STATUS_MESSAGES[step] : "Loading view…"

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="tabletap-glass-loader"
          role="status"
          aria-live="polite"
          aria-label={statusText}
          initial={{ opacity: 0.96, scale: reduceMotion ? 1 : 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: reduceMotion ? 1 : 1.02, pointerEvents: "none" }}
          transition={{ duration: 0.22, ease: EASE_OUT }}
          className={cn(
            fullScreen ? "fixed inset-0" : "absolute inset-0",
            "z-[9999] flex items-center justify-center overflow-hidden bg-background/95 backdrop-blur-xl",
            className,
          )}
        >
          {/* Ambient theme accents */}
          <div className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-accent/15 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center gap-6 px-8 py-8">
            {/* Spinner rings + logo */}
            <div className="relative flex size-36 items-center justify-center">
              <motion.svg
                className="absolute inset-0 size-full"
                viewBox="0 0 144 144"
                fill="none"
                animate={reduceMotion ? undefined : { rotate: 360 }}
                transition={
                  reduceMotion
                    ? undefined
                    : { repeat: Infinity, duration: 2.4, ease: "linear" }
                }
              >
                <circle
                  cx="72"
                  cy="72"
                  r="64"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="160 240"
                  className="stroke-primary/70"
                />
              </motion.svg>

              <motion.svg
                className="absolute inset-0 size-full"
                viewBox="0 0 144 144"
                fill="none"
                animate={reduceMotion ? undefined : { rotate: -360 }}
                transition={
                  reduceMotion
                    ? undefined
                    : { repeat: Infinity, duration: 1.9, ease: "linear" }
                }
              >
                <circle
                  cx="72"
                  cy="72"
                  r="53"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeDasharray="90 240"
                  className="stroke-accent"
                />
              </motion.svg>

              <motion.div
                initial={{ opacity: 0.9, scale: reduceMotion ? 1 : 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
                className="flex size-20 items-center justify-center rounded-2xl border border-border bg-card shadow-md"
              >
                <img
                  src="/logo-icon.png"
                  alt="TableTap Logo"
                  className="size-12 object-contain"
                />
              </motion.div>
            </div>

            {/* Brand wordmark */}
            <div className="text-center space-y-1">
              <p className="font-heading text-2xl font-bold tracking-tight text-foreground">
                TableTap
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
                Scan · Pay · Done
              </p>
            </div>

            {/* Status line */}
            <div className="min-h-5 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={statusText}
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduceMotion ? 0 : -4 }}
                  transition={FAST_TRANSITION}
                  className="text-xs font-medium text-muted-foreground text-center"
                >
                  {statusText}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* GPU-composited progress bar */}
            <div className="w-52 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold uppercase tracking-wider text-muted-foreground">
                  Loading
                </span>
                <span className="font-semibold tabular-nums text-foreground">
                  {pct}%
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full w-full rounded-full bg-gradient-to-r from-primary to-accent"
                  style={{ transformOrigin: "left" }}
                  initial={{ scaleX: isInitialCycle ? 0.12 : 0.35 }}
                  animate={{ scaleX: pct / 100 }}
                  transition={{ duration: 0.28, ease: EASE_OUT }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
