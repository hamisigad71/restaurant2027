"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { FAST_TRANSITION } from "@/lib/motion"
import {
  EyeIcon as Eye,
  EyeSlashIcon as EyeOff,
  ShieldCheckIcon as Shield,
  TrophyIcon as Crown,
  StarIcon as Star,
  BoltIcon as Bolt,
  CheckIcon as Check,
  XMarkIcon as X,
  BoltIcon as Sparkles,
  ArrowTrendingUpIcon as TrendingUp,
  LockClosedIcon as Lock,
  EnvelopeIcon as Mail,
  ChevronRightIcon as ChevronRight,
} from "@heroicons/react/24/outline"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { TableTapLogo } from "@/components/brand/tabletap-logo"
import { useAuth, type UserRole } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

// ─── Data ─────────────────────────────────────────────────────────────────────
const roleOptions = [
  { role: "admin" as UserRole, label: "Admin", description: "Full access", icon: "/system-administration.png" },
  { role: "manager" as UserRole, label: "Manager", description: "Ops & reports", icon: "/manager.png" },
  { role: "waiter" as UserRole, label: "Staff", description: "Waiter & support", icon: "/staff.png" },
  { role: "kitchen" as UserRole, label: "Kitchen", description: "Preparation", icon: "/kitchen.png" },
]

const defaultRedirects: Record<UserRole, string> = {
  admin: "/admin/dashboard",
  manager: "/manager/dashboard",
  waiter: "/waiter/dashboard",
  kitchen: "/kitchen/kds",
  customer: "/customer",
  cleaner: "/cleaners",
  security: "/security",
}

const stats = [
  { value: "5", label: "Portals", icon: Sparkles },
  { value: "99.9%", label: "Uptime", icon: TrendingUp },
  { value: "Real-time", label: "Sync", icon: Bolt },
]

const testimonials = [
  {
    text: "Resto transformed our operations overnight. Table turns up 40%, zero miscommunications.",
    author: "Chef Amara Osei",
    role: "Executive Chef, Nairobi",
    avatar: "AO",
    rating: 5,
  },
  {
    text: "The KDS alone paid for itself in two weeks. Our kitchen has never run this clean.",
    author: "Grace Wambua",
    role: "Operations Manager",
    avatar: "GW",
    rating: 5,
  },
]

const STAFF_SUB_ROLES = [
  { id: "waiter", label: "Waiter", icon: "/staff.png", desc: "Orders & Tables", path: "/waiter/dashboard" },
  { id: "kitchen", label: "Chef", icon: "/chef-icon.png", desc: "Kitchen KDS", path: "/kitchen/kds" },
  { id: "cleaner", label: "Cleaner", icon: "/office.png", desc: "Facility Maintenance", path: "/cleaners" },
  { id: "security", label: "Security", icon: "/policeman.png", desc: "Safety & Access", path: "/security" },
]

const features = [
  "Floor Plan View",
  "KDS Display",
  "Live Analytics",
  "5 Portals",
  "Real-time Sync",
  "Cloud Storage",
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingRole, setLoadingRole] = useState<UserRole | null>(null)
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showStaffPicker, setShowStaffPicker] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const ok = await login(email, password, selectedRole)
    if (ok) router.push(defaultRedirects[selectedRole])
    setIsLoading(false)
  }

  const handleQuickLogin = async (role: UserRole) => {
    if (role === "waiter" && !showStaffPicker) {
      setShowStaffPicker(true)
      return
    }
    setLoadingRole(role)
    setSelectedRole(role)
    const ok = await login(`${role}@smartrestaurant.co.ke`, "demo123", role)
    if (ok) router.push(defaultRedirects[role])
    setLoadingRole(null)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_1fr] bg-background">
      {/* ── LEFT — brand panel ───────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 xl:p-16 relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #0B3B36 0%, #041816 45%, #03100E 100%)",
        }}
      >
        <div
          className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full opacity-[0.15] pointer-events-none blur-3xl"
          style={{ background: "radial-gradient(circle, #D9F7E0, transparent 65%)" }}
        />
        <div
          className="absolute top-1/3 -left-20 w-[380px] h-[380px] rounded-full opacity-[0.1] pointer-events-none blur-2xl"
          style={{ background: "radial-gradient(circle, oklch(0.75 0.18 150), transparent 70%)" }}
        />

        <div className="relative z-10 flex flex-col h-full justify-between gap-12">
          <div className="flex items-center">
            <TableTapLogo variant="dark" size="lg" />
          </div>

          {/* Hero */}
          <div className="space-y-8 max-w-[480px]">
            <Badge
              variant="outline"
              className="gap-2 px-3.5 py-1.5 text-[11px] font-bold bg-white/10 border-white/25 text-white backdrop-blur-sm"
            >
              <Crown className="h-3.5 w-3.5 text-amber-200" />
              Smart Restaurant OS · v2.0
            </Badge>

            <div className="space-y-4">
              <h2 className="text-white text-[2.8rem] xl:text-[3.2rem] font-bold leading-[1.08]">
                The operating system
                <br />
                <span className="text-white/50">your restaurant</span>{" "}
                <span className="relative inline-block">
                  <em className="not-italic text-white/95">deserves.</em>
                  <div
                    className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                    style={{ background: "linear-gradient(90deg, #FDE68A 0%, transparent 100%)" }}
                  />
                </span>
              </h2>
              <p className="text-[15px] leading-[1.7] max-w-[420px] text-white/65">
                Manage tables, track orders, display kitchen workflows, and
                analyse your business — all from one unified, real-time platform built for excellence.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3.5">
              {stats.map((s) => {
                const Icon = s.icon
                return (
                  <Card
                    key={s.label}
                    size="sm"
                    className="group bg-white/10 border-white/15 text-white backdrop-blur-sm shadow-none transition-colors duration-200 ease-(--ease-out) hover:bg-white/15"
                  >
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-white text-xl font-bold leading-none">{s.value}</p>
                        <Icon className="h-4 w-4 text-amber-200 opacity-70 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-[11px] font-medium text-white/55">{s.label}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              {features.map((f) => (
                <Badge
                  key={f}
                  variant="outline"
                  className="gap-1.5 px-3 py-1.5 text-[11px] font-medium bg-white/10 border-white/20 text-white/85 backdrop-blur-sm"
                >
                  <Check className="h-3 w-3 text-amber-200" />
                  {f}
                </Badge>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="space-y-3.5">
            {testimonials.map((t) => (
              <Card
                key={t.author}
                size="sm"
                className="bg-white/10 border-white/15 text-white backdrop-blur-sm shadow-none"
              >
                <CardContent className="space-y-3">
                  <div className="flex gap-1">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-[13.5px] leading-[1.65] font-medium text-white/85">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="border border-white/30">
                      <AvatarFallback className="bg-white/20 text-white text-[11px] font-bold">
                        {t.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-semibold text-white leading-none">{t.author}</p>
                      <p className="text-[11px] mt-1 font-medium text-white/55">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT — auth panel ───────────────────────────────────── */}
      <div className="flex flex-col justify-center px-6 py-10 lg:px-10 xl:px-14 bg-background">
        <div className="flex lg:hidden items-center mb-10">
          <TableTapLogo variant="light" size="md" />
        </div>

        <div className="w-full max-w-[440px] mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to access your portal and manage your restaurant
            </p>
          </div>

          {/* ── Quick demo ───────────────────────────────────────── */}
          <Card size="sm">
            <CardHeader className="border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg flex items-center justify-center bg-primary/10 border border-primary/15 text-primary">
                  <div
                    className="h-4 w-4 bg-current"
                    style={{
                      maskImage: "url(/demo.png)",
                      maskSize: "contain",
                      maskRepeat: "no-repeat",
                      maskPosition: "center",
                      WebkitMaskImage: "url(/demo.png)",
                      WebkitMaskSize: "contain",
                      WebkitMaskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                    }}
                  />
                </div>
                <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">
                  Quick Demo Access
                </CardTitle>
              </div>
              <CardAction>
                <Badge variant="secondary" className="gap-1.5 text-[10px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  One-click
                </Badge>
              </CardAction>
            </CardHeader>

            <CardContent>
              <div className="min-h-[160px]">
                <AnimatePresence mode="wait" initial={false}>
                  {showStaffPicker ? (
                    <motion.div
                      key="staff-picker"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={FAST_TRANSITION}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
                          Select Staff Role
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          onClick={() => setShowStaffPicker(false)}
                          className="gap-1"
                        >
                          <X className="size-3.5" />
                          Back
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {STAFF_SUB_ROLES.map((sub) => (
                          <Button
                            key={sub.id}
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowStaffPicker(false)
                              handleQuickLogin(sub.id as UserRole)
                            }}
                            className="group h-auto flex-col items-stretch justify-between p-4 text-left hover:bg-accent"
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="flex size-10 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                <div
                                  className="size-5 bg-current"
                                  style={{
                                    maskImage: `url(${sub.icon})`,
                                    maskSize: "contain",
                                    maskRepeat: "no-repeat",
                                    maskPosition: "center",
                                    WebkitMaskImage: `url(${sub.icon})`,
                                    WebkitMaskSize: "contain",
                                    WebkitMaskRepeat: "no-repeat",
                                    WebkitMaskPosition: "center",
                                  }}
                                />
                              </div>
                              <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                            </div>

                            <div className="mt-3 space-y-0.5 min-w-0 w-full">
                              <p className="text-sm font-semibold text-foreground leading-snug truncate">
                                {sub.label}
                              </p>
                              <p className="text-xs font-normal text-muted-foreground leading-snug truncate">
                                {sub.desc}
                              </p>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="role-picker"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={FAST_TRANSITION}
                      className="grid grid-cols-2 gap-3"
                    >
                      {roleOptions.map((opt) => {
                        const busy = loadingRole === opt.role
                        return (
                          <Button
                            key={opt.role}
                            type="button"
                            variant={busy ? "secondary" : "outline"}
                            onClick={() => handleQuickLogin(opt.role)}
                            disabled={!!loadingRole}
                            className={cn(
                              "group h-auto flex-col items-stretch justify-between p-4 text-left",
                              busy && "border-primary ring-2 ring-primary/20",
                            )}
                          >
                            <div className="flex items-center justify-between w-full">
                              <div
                                className={cn(
                                  "flex size-10 items-center justify-center rounded-xl border shrink-0 transition-colors",
                                  busy
                                    ? "bg-primary border-primary text-primary-foreground"
                                    : "bg-primary/10 border-primary/15 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
                                )}
                              >
                                {busy ? (
                                  <Spinner className="size-4" />
                                ) : (
                                  <div
                                    className="size-5 bg-current"
                                    style={{
                                      maskImage: `url(${opt.icon})`,
                                      maskSize: "contain",
                                      maskRepeat: "no-repeat",
                                      maskPosition: "center",
                                      WebkitMaskImage: `url(${opt.icon})`,
                                      WebkitMaskSize: "contain",
                                      WebkitMaskRepeat: "no-repeat",
                                      WebkitMaskPosition: "center",
                                    }}
                                  />
                                )}
                              </div>

                              <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                            </div>

                            <div className="mt-3 space-y-0.5 min-w-0 w-full">
                              <p className="text-sm font-semibold text-foreground leading-snug truncate">
                                {opt.label}
                              </p>
                              <p className="text-xs font-normal text-muted-foreground leading-snug truncate">
                                {opt.description}
                              </p>
                            </div>
                          </Button>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Social */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap px-1 text-muted-foreground">
                Social login
              </span>
              <Separator className="flex-1" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Google",
                  svg: (
                    <svg className="size-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  ),
                },
                {
                  label: "Facebook",
                  svg: (
                    <svg className="size-4" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  ),
                },
              ].map((btn) => (
                <Button key={btn.label} type="button" variant="outline" className="h-11 gap-2.5">
                  {btn.svg}
                  {btn.label}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap px-1 text-muted-foreground">
                or continue with email
              </span>
              <Separator className="flex-1" />
            </div>
          </div>

          {/* ── Manual login form ────────────────────────────────── */}
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email" className="text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5">
                      <Mail className="size-3.5 text-primary" />
                      Email Address
                    </FieldLabel>
                    <InputGroup className="h-11">
                      <InputGroupInput
                        id="email"
                        type="email"
                        placeholder="name@restaurant.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </InputGroup>
                  </Field>

                  <Field>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="password" className="text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5">
                        <Lock className="size-3.5 text-primary" />
                        Password
                      </FieldLabel>
                      <Link
                        href="/forgot-password"
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <InputGroup className="h-11">
                      <InputGroupInput
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          type="button"
                          size="icon-xs"
                          variant="ghost"
                          onClick={() => setShowPassword((v) => !v)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>

                  <Field>
                    <FieldLabel className="text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5">
                      <Shield className="size-3.5 text-primary" />
                      Select Portal
                    </FieldLabel>
                    <div className="grid grid-cols-4 gap-2">
                      {roleOptions.map((opt) => {
                        const active = selectedRole === opt.role
                        return (
                          <Button
                            key={opt.role}
                            type="button"
                            variant={active ? "secondary" : "outline"}
                            onClick={() => setSelectedRole(opt.role)}
                            className={cn(
                              "h-auto flex-col gap-1.5 py-3 px-1 text-[11px]",
                              active && "border-primary bg-primary/10 text-primary",
                            )}
                          >
                            <div
                              className={cn("size-4 bg-current", !active && "opacity-60")}
                              style={{
                                maskImage: `url(${opt.icon})`,
                                maskSize: "contain",
                                maskRepeat: "no-repeat",
                                maskPosition: "center",
                                WebkitMaskImage: `url(${opt.icon})`,
                                WebkitMaskSize: "contain",
                                WebkitMaskRepeat: "no-repeat",
                                WebkitMaskPosition: "center",
                              }}
                            />
                            <span>{opt.label}</span>
                          </Button>
                        )
                      })}
                    </div>
                  </Field>

                  <Button type="submit" size="lg" disabled={isLoading} className="w-full h-11 gap-2">
                    {isLoading ? (
                      <>
                        <Spinner className="size-4" />
                        <span>Signing in…</span>
                      </>
                    ) : (
                      <>
                        <span>Sign in</span>
                        <ChevronRight className="size-4" />
                      </>
                    )}
                  </Button>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
