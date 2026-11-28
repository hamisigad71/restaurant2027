"use client"

import Link from "next/link"
import { ArrowRightIcon, QrCodeIcon } from "@heroicons/react/24/outline"
import { motion, useReducedMotion } from "motion/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { defaultPortalPath, useAuth } from "@/lib/auth-context"
import { EASE_OUT } from "@/lib/motion"

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=85"

const CAPABILITIES = [
  "QR Table Ordering",
  "Live Kitchen KDS",
  "M-Pesa & Card Checkout",
]

export default function WelcomePage() {
  const { user, isAuthenticated, isAuthReady } = useAuth()
  const reduceMotion = useReducedMotion()

  const enterText = (delay: number) =>
    reduceMotion
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.2, ease: EASE_OUT },
        }
      : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.28, ease: EASE_OUT, delay },
        }

  const enterMedia = reduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.22, ease: EASE_OUT },
      }
    : {
        initial: { opacity: 0, scale: 0.985 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.34, ease: EASE_OUT, delay: 0.06 },
      }

  const hasActiveUser = isAuthReady && isAuthenticated && !!user

  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      {/* ── Minimal Top Bar ───────────────────────────────────────────── */}
      <header className="max-w-6xl w-full mx-auto px-5 sm:px-8 h-16 flex items-center justify-between pt-[env(safe-area-inset-top,0px)]">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="flex size-8 items-center justify-center rounded-lg border border-border bg-card p-1 shadow-xs">
            <img
              src="/logo-icon.png"
              alt="TableTap"
              className="size-full object-contain"
            />
          </div>
          <span className="font-heading text-base font-bold tracking-tight text-foreground">
            TableTap
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {hasActiveUser ? (
            <Button asChild size="sm" className="gap-1.5">
              <Link href={defaultPortalPath[user.role]}>
                <span>Continue to Portal</span>
                <ArrowRightIcon className="size-3.5" />
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      {/* ── Editorial Asymmetric Hero ─────────────────────────────────── */}
      <main className="flex-1 flex items-center">
        <div className="max-w-6xl w-full mx-auto px-5 sm:px-8 py-8 lg:py-12">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Copy & Actions */}
            <div className="lg:col-span-5 space-y-6">
              <motion.div {...enterText(0)} className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  Scan · Pay · Done
                </p>
                <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-[-0.02em] leading-[1.06] text-foreground">
                  Every table, ticket, and payment in quiet sync.
                </h1>
                <p className="text-base text-muted-foreground leading-relaxed max-w-md">
                  QR table ordering, live kitchen displays, and instant M-Pesa
                  checkout—crafted for modern hospitality teams.
                </p>
              </motion.div>

              <motion.div {...enterText(0.1)} className="space-y-3.5">
                <div className="flex flex-wrap items-center gap-3">
                  <Button asChild size="lg" className="h-11 px-6 gap-2">
                    <Link href="/signup">
                      <span>Get Started</span>
                      <ArrowRightIcon className="size-4" />
                    </Link>
                  </Button>

                  <Button asChild variant="outline" size="lg" className="h-11 px-6">
                    <Link href="/login">Sign In</Link>
                  </Button>
                </div>

                <div>
                  {hasActiveUser ? (
                    <Link
                      href={defaultPortalPath[user.role]}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-4"
                    >
                      <span>Continue as {user.name}</span>
                      <ArrowRightIcon className="size-3.5" />
                    </Link>
                  ) : (
                    <Link
                      href="/customer/4"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150"
                    >
                      <QrCodeIcon className="size-4 text-primary" />
                      <span>Preview live guest menu</span>
                      <ArrowRightIcon className="size-3.5" />
                    </Link>
                  )}
                </div>
              </motion.div>

              <motion.div
                {...enterText(0.12)}
                className="pt-4 border-t border-border/70 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground"
              >
                {CAPABILITIES.map((cap, idx) => (
                  <span key={cap} className="inline-flex items-center gap-4">
                    {idx > 0 && <span aria-hidden="true">·</span>}
                    <span>{cap}</span>
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right Framed Restaurant Image */}
            <motion.div {...enterMedia} className="lg:col-span-7">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full rounded-2xl overflow-hidden border border-border/80 bg-muted shadow-lg">
                <img
                  src={HERO_IMAGE}
                  alt="Warm dining room atmosphere with TableTap service"
                  className="size-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 sm:right-auto max-w-xs rounded-xl border border-white/20 bg-black/55 backdrop-blur-md px-3.5 py-2.5 text-white">
                  <div className="flex items-center gap-2 text-xs font-semibold leading-none">
                    <span className="size-2 rounded-full bg-[#7AE72A] shrink-0" />
                    <span>Table 04 · Live QR Order</span>
                  </div>
                  <p className="mt-1 text-[11px] text-white/75 leading-none">
                    Synced to Kitchen KDS
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* ── Minimal Footer ────────────────────────────────────────────── */}
      <footer className="max-w-6xl w-full mx-auto px-5 sm:px-8 py-5 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <p>© 2026 TableTap · Smart Restaurant OS</p>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="link"
            size="xs"
            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            onClick={() =>
              toast.info("TableTap Support", {
                description: "24/7 hospitality desk · support@tabletap.co.ke",
              })
            }
          >
            Support
          </Button>
          <Button
            type="button"
            variant="link"
            size="xs"
            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            onClick={() =>
              toast.info("TableTap Privacy Policy", {
                description: "Order and staff activity data remain within your restaurant tenant.",
              })
            }
          >
            Privacy
          </Button>
          <Button
            type="button"
            variant="link"
            size="xs"
            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            onClick={() =>
              toast.info("TableTap Terms of Service", {
                description: "Standard hospitality workspace terms apply during demo and live operation.",
              })
            }
          >
            Terms
          </Button>
        </div>
      </footer>
    </div>
  )
}
