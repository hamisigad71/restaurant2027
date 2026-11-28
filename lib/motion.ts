"use client"

import * as React from "react"
import { MotionConfig } from "motion/react"

export const EASE_OUT = [0.23, 1, 0.32, 1] as const
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const

/** Critically damped default for tabs, nav indicators, and layout shifts */
export const SPRING_SNAPPY = {
  type: "spring",
  duration: 0.32,
  bounce: 0,
} as const

/** Subtle bounce reserved for badge count bumps and success checkmarks */
export const SPRING_POP = {
  type: "spring",
  duration: 0.36,
  bounce: 0.18,
} as const

export const FAST_TRANSITION = {
  duration: 0.18,
  ease: EASE_OUT,
} as const

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return React.createElement(
    MotionConfig,
    {
      reducedMotion: "user",
      transition: { duration: 0.2, ease: EASE_OUT },
    },
    children,
  )
}
