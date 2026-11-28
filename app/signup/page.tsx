"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  LockClosedIcon,
  BoltIcon,
} from "@heroicons/react/24/outline"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { TableTapLogo } from "@/components/brand/tabletap-logo"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// ─── Data ─────────────────────────────────────────────────────────────────────
const perks = [
  { icon: ShieldCheckIcon, text: "Role-based access control" },
  { icon: CheckCircleIcon, text: "Real-time kitchen sync" },
  { icon: LockClosedIcon, text: "Enterprise-grade security" },
  { icon: BoltIcon, text: "AI-powered demand forecasting" },
]

const roles = [
  { value: "admin", label: "Admin (Owner)", icon: ShieldCheckIcon, description: "Full system control" },
  { value: "manager", label: "Manager", icon: "/manager.png", description: "Operations & reports" },
  { value: "staff", label: "Staff", icon: "/staff.png", description: "Waiters & Support" },
  { value: "kitchen", label: "Kitchen", icon: "/kitchen.png", description: "Preparation & KDS" },
]

const staffSubRoles = [
  { value: "waiter", label: "Waiter" },
  { value: "cleaner", label: "Cleaner" },
  { value: "security", label: "Security" },
  { value: "chef", label: "Chef" },
]

// ─── Password strength ────────────────────────────────────────────────────────
function getStrength(pw: string) {
  if (!pw) return { level: 0, label: "", barClass: "", textClass: "" }
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  if (s <= 1) return { level: 1, label: "Weak", barClass: "bg-destructive", textClass: "text-destructive" }
  if (s === 2) return { level: 2, label: "Fair", barClass: "bg-amber-500", textClass: "text-amber-600 dark:text-amber-400" }
  if (s === 3) return { level: 3, label: "Good", barClass: "bg-primary", textClass: "text-primary" }
  return { level: 4, label: "Strong", barClass: "bg-emerald-500", textClass: "text-emerald-600 dark:text-emerald-400" }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SignupPage() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("waiter")

  const strength = getStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    router.push("/login")
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* ── LEFT — brand panel ───────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between p-14 relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #0B3B36 0%, #062421 55%, #03100E 100%)",
        }}
      >
        <div
          className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full opacity-[0.18] pointer-events-none"
          style={{ background: "radial-gradient(circle, #D9F7E0, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 -left-24 w-[400px] h-[400px] rounded-full opacity-[0.12] pointer-events-none"
          style={{ background: "radial-gradient(circle, oklch(0.7 0.15 150), transparent 70%)" }}
        />

        <div className="relative z-10 flex flex-col h-full justify-between gap-10">
          <div className="flex items-center">
            <TableTapLogo variant="dark" size="lg" />
          </div>

          <div className="space-y-7">
            <Badge
              variant="outline"
              className="gap-1.5 px-3 py-1.5 text-[11px] font-bold bg-white/10 border-white/20 text-white"
            >
              <BoltIcon className="h-3 w-3 text-amber-200" />
              Join 500+ restaurants on Resto
            </Badge>

            <div className="space-y-3">
              <h2 className="text-white text-[2.5rem] font-bold leading-[1.1]">
                Start running your
                <br />
                <span className="text-white/45">restaurant</span>{" "}
                <em className="not-italic text-white/90">smarter.</em>
              </h2>
              <p className="text-[15px] leading-relaxed max-w-[340px] text-white/60">
                Set up your team, assign roles, and get every portal live
                in under five minutes.
              </p>
            </div>

            <div className="space-y-3">
              {perks.map((p) => {
                const Icon = p.icon
                return (
                  <div key={p.text} className="flex items-center gap-3">
                    <div className="size-8 rounded-xl flex items-center justify-center shrink-0 border border-white/15 bg-white/10 text-white/75">
                      <Icon className="size-4" />
                    </div>
                    <p className="text-sm text-white/70">{p.text}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <Card size="sm" className="bg-white/10 border-white/15 text-white shadow-none">
            <CardContent className="flex items-start gap-3">
              <div className="size-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-emerald-500/25 text-emerald-400">
                <CheckCircleIcon className="size-5" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Free to get started</p>
                <p className="text-xs mt-0.5 leading-relaxed text-white/55">
                  No credit card required. Full access to all portals during your 14-day trial.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── RIGHT — form panel ───────────────────────────────────── */}
      <div className="flex flex-col justify-center px-8 py-10 bg-background">
        <div className="flex lg:hidden items-center mb-8">
          <TableTapLogo variant="light" size="md" />
        </div>

        <div className="w-full max-w-[400px] mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Create your account
            </h1>
            <p className="text-sm mt-1 text-muted-foreground">
              Get started with Smart Restaurant OS
            </p>
          </div>

          {/* ── Role picker card ─────────────────────────────────── */}
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">
                Choose your role
              </CardTitle>
              <CardDescription className="text-xs">
                This determines which portal you access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((r) => {
                  const Icon = r.icon
                  const active =
                    role === r.value ||
                    (r.value === "staff" && staffSubRoles.some((s) => s.value === role))
                  return (
                    <Button
                      key={r.value}
                      type="button"
                      variant={active ? "secondary" : "outline"}
                      onClick={() => {
                        r.value === "staff" ? setRole("waiter") : setRole(r.value)
                      }}
                      className={cn(
                        "group h-auto justify-start gap-2.5 p-3 text-left",
                        active && "border-primary bg-primary/10",
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center size-8 rounded-md shrink-0 transition-colors",
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
                        )}
                      >
                        {typeof r.icon === "string" ? (
                          <div
                            className="size-4 bg-current"
                            style={{
                              maskImage: `url(${r.icon})`,
                              maskSize: "contain",
                              maskRepeat: "no-repeat",
                              maskPosition: "center",
                              WebkitMaskImage: `url(${r.icon})`,
                              WebkitMaskSize: "contain",
                              WebkitMaskRepeat: "no-repeat",
                              WebkitMaskPosition: "center",
                            }}
                          />
                        ) : (
                          <Icon className="size-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold leading-none text-foreground">
                          {r.label}
                        </p>
                        <p className="text-[11px] mt-1 truncate font-normal text-muted-foreground">
                          {r.description}
                        </p>
                      </div>
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Social */}
          <div className="space-y-3">
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
                <Button key={btn.label} type="button" variant="outline" className="h-10 gap-2.5">
                  {btn.svg}
                  {btn.label}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap px-1 text-muted-foreground">
                or create manually
              </span>
              <Separator className="flex-1" />
            </div>
          </div>

          {/* ── Form card ────────────────────────────────────────── */}
          <Card size="sm">
            <CardContent>
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name" className="text-xs font-semibold">
                      Full Name
                    </FieldLabel>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Kamau"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email" className="text-xs font-semibold">
                      Work Email
                    </FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@restaurant.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="role-select" className="text-xs font-semibold">
                      Role
                    </FieldLabel>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger id="role-select" className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles
                          .filter((r) => r.value !== "staff")
                          .map((r) => (
                            <SelectItem key={r.value} value={r.value}>
                              {r.label}
                            </SelectItem>
                          ))}
                        <Separator className="my-1" />
                        <div className="px-2 py-1 text-[10px] font-semibold uppercase text-muted-foreground">
                          Staff Members
                        </div>
                        {staffSubRoles.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Separator />

                  <Field>
                    <FieldLabel htmlFor="password" className="text-xs font-semibold">
                      Password
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
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
                          {showPassword ? <EyeSlashIcon className="size-4" /> : <EyeIcon className="size-4" />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>

                    {password ? (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={cn(
                                "h-1.5 flex-1 rounded-full transition-colors duration-200 ease-(--ease-out)",
                                i <= strength.level ? strength.barClass : "bg-muted",
                              )}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Strength:{" "}
                          <span className={cn("font-semibold", strength.textClass)}>
                            {strength.label}
                          </span>
                          {strength.level < 3 && " — add numbers & symbols"}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground pt-1">
                        Must be at least 8 characters
                      </p>
                    )}
                  </Field>

                  <Button type="submit" size="lg" disabled={isLoading} className="w-full h-11 gap-2">
                    {isLoading ? (
                      <>
                        <Spinner className="size-4" />
                        <span>Creating account…</span>
                      </>
                    ) : (
                      <>
                        <span>Create account</span>
                        <ArrowRightIcon className="size-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-xs leading-relaxed text-muted-foreground">
                    By creating an account you agree to our{" "}
                    <Button
                      type="button"
                      variant="link"
                      size="xs"
                      onClick={() =>
                        toast.info("TableTap Terms of Service", {
                          description: "Standard hospitality workspace terms apply during demo and live operation.",
                        })
                      }
                      className="h-auto p-0 text-xs font-semibold underline underline-offset-2"
                    >
                      Terms
                    </Button>{" "}
                    and{" "}
                    <Button
                      type="button"
                      variant="link"
                      size="xs"
                      onClick={() =>
                        toast.info("TableTap Privacy Policy", {
                          description: "Order and staff activity data remain within your restaurant tenant.",
                        })
                      }
                      className="h-auto p-0 text-xs font-semibold underline underline-offset-2"
                    >
                      Privacy Policy
                    </Button>
                    .
                  </p>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
