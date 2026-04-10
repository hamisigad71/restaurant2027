"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  UtensilsCrossed, Eye, EyeOff, Shield, Users,
  ChefHat, ShoppingCart, ArrowRight, CheckCircle2,
  Lock, Crown, Check,
} from "lucide-react"
import { Button }    from "@/components/ui/button"
import { Input }     from "@/components/ui/input"
import { Label }     from "@/components/ui/label"
import { Badge }     from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

// ─── Data ─────────────────────────────────────────────────────────────────────
const perks = [
  { icon:Shield,       text:"Role-based access control"        },
  { icon:CheckCircle2, text:"Real-time kitchen sync"           },
  { icon:Lock,         text:"Enterprise-grade security"        },
  { icon:Crown,        text:"AI-powered demand forecasting"    },
]

const roles = [
  { value:"admin",   label:"Admin (Owner)", icon:Shield,       description:"Full system control"  },
  { value:"manager", label:"Manager",       icon:Users,        description:"Operations & reports" },
  { value:"staff",   label:"Staff",         icon:ShoppingCart, description:"Waiters & Support"    },
  { value:"kitchen", label:"Kitchen",       icon:ChefHat,      description:"Preparation & KDS"   },
]

const staffSubRoles = [
  { value:"waiter",   label:"Waiter"   },
  { value:"cleaner",  label:"Cleaner"  },
  { value:"security", label:"Security" },
  { value:"chef",     label:"Chef"     },
]

// ─── Password strength ────────────────────────────────────────────────────────
function getStrength(pw: string) {
  if (!pw) return { level:0, label:"", color:"" }
  let s = 0
  if (pw.length >= 8)          s++
  if (/[A-Z]/.test(pw))        s++
  if (/[0-9]/.test(pw))        s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  if (s <= 1) return { level:1, label:"Weak",   color:"oklch(0.55 0.18 25)"  }
  if (s === 2) return { level:2, label:"Fair",   color:"oklch(0.75 0.15 75)"  }
  if (s === 3) return { level:3, label:"Good",   color:"oklch(0.45 0.12 285)" }
  return              { level:4, label:"Strong", color:"oklch(0.62 0.16 150)" }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SignupPage() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading,    setIsLoading]    = useState(false)
  const [password,     setPassword]     = useState("")
  const [name,         setName]         = useState("")
  const [email,        setEmail]        = useState("")
  const [role,         setRole]         = useState("waiter")

  const strength = getStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    router.push("/login")
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2" style={{ background:"#EBE6F8" }}>

      {/* ── LEFT — brand panel ───────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between p-14 relative overflow-hidden"
        style={{
          background:"linear-gradient(145deg, oklch(0.45 0.12 285) 0%, oklch(0.30 0.15 285) 55%, oklch(0.15 0.10 285) 100%)",
        }}
      >
        {/* Orbs */}
        <div className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full opacity-[0.18] pointer-events-none"
          style={{ background:"radial-gradient(circle, oklch(0.85 0.04 285), transparent 70%)" }} />
        <div className="absolute bottom-0 -left-24 w-[400px] h-[400px] rounded-full opacity-[0.12] pointer-events-none"
          style={{ background:"radial-gradient(circle, oklch(0.7 0.15 150), transparent 70%)" }} />


        <div className="relative z-10 flex flex-col h-full justify-between gap-10">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-11 h-11 rounded-xl border"
              style={{ background:"rgba(255,255,255,0.12)", borderColor:"rgba(255,255,255,0.2)" }}
            >
              <UtensilsCrossed className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-white text-xl font-bold  uppercase leading-none">Resto</p>
              <p className="text-[9px] uppercase  mt-0.5" style={{ color:"rgba(255,255,255,0.5)" }}>
                Grande Cuisine
              </p>
            </div>
          </div>

          {/* Hero */}
          <div className="space-y-7">
            <Badge
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-full border w-fit"
              style={{ background:"rgba(255,255,255,0.1)", borderColor:"rgba(255,255,255,0.2)", color:"white" }}
            >
              <Crown className="h-3 w-3" style={{ color:"#FDE68A" }} />
              Join 500+ restaurants on Resto
            </Badge>

            <div className="space-y-3">
              <h2 className="text-white text-[2.5rem] font-bold leading-[1.1] ">
                Start running your<br />
                <span style={{ color:"rgba(255,255,255,0.45)" }}>restaurant</span>{" "}
                <em className="not-italic" style={{ color:"rgba(255,255,255,0.9)" }}>smarter.</em>
              </h2>
              <p className="text-[15px] leading-relaxed max-w-[340px]" style={{ color:"rgba(255,255,255,0.55)" }}>
                Set up your team, assign roles, and get every portal live
                in under five minutes.
              </p>
            </div>

            {/* Perks */}
            <div className="space-y-3">
              {perks.map((p) => {
                const Icon = p.icon
                return (
                  <div key={p.text} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border"
                      style={{ background:"rgba(255,255,255,0.1)", borderColor:"rgba(255,255,255,0.15)" }}
                    >
                      <Icon className="h-4 w-4" style={{ color:"rgba(255,255,255,0.7)" }} />
                    </div>
                    <p className="text-[14px]" style={{ color:"rgba(255,255,255,0.65)" }}>{p.text}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Free trial badge */}
          <div
            className="rounded-2xl p-4 border flex items-start gap-3"
            style={{ background:"rgba(255,255,255,0.07)", borderColor:"rgba(255,255,255,0.1)" }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{ background:"oklch(0.62 0.16 150 / 0.25)" }}
            >
              <CheckCircle2 className="h-5 w-5" style={{ color:"oklch(0.62 0.16 150)" }} />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Free to get started</p>
              <p className="text-[12px] mt-0.5 leading-relaxed" style={{ color:"rgba(255,255,255,0.45)" }}>
                No credit card required. Full access to all portals during your 14-day trial.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT — form panel ───────────────────────────────────── */}
      <div className="flex flex-col justify-center px-8 py-10" style={{ background:"#EBE6F8" }}>

        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ background:"oklch(0.45 0.12 285)" }}>
            <UtensilsCrossed className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-lg font-bold  uppercase leading-none" style={{ color:"#0D031B" }}>Resto</p>
            <p className="text-[9px] uppercase " style={{ color:"oklch(0.45 0.12 285)" }}>Grande Cuisine</p>
          </div>
        </div>

        <div className="w-full max-w-[380px] mx-auto space-y-6">

          {/* Heading */}
          <div>
            <h1 className="text-[1.7rem] font-bold " style={{ color:"#0D031B" }}>
              Create your account
            </h1>
            <p className="text-sm mt-1" style={{ color:"#736C83" }}>
              Get started with Smart Restaurant OS
            </p>
          </div>

          {/* ── Role picker card ─────────────────────────────────── */}
          <Card
            className="border rounded-3xl shadow-sm overflow-hidden"
            style={{ background:"rgba(255,255,255,0.82)", borderColor:"oklch(0.45 0.12 285 / 0.14)" }}
          >
            <div className="h-[3px]" style={{ background:"oklch(0.45 0.12 285)" }} />
            <CardHeader className="px-5 pt-4 pb-2">
              <CardTitle className="text-[11px] font-medium uppercase " style={{ color:"#9A94AA" }}>
                Choose your role
              </CardTitle>
              <CardDescription className="text-[11px] mt-0.5" style={{ color:"#AEA6BF" }}>
                This determines which portal you access
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="grid grid-cols-2 gap-2">
                {roles.map((r) => {
                  const Icon   = r.icon
                  const active = role === r.value || (r.value === "staff" && staffSubRoles.some(s => s.value === role))
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => { r.value === "staff" ? setRole("waiter") : setRole(r.value) }}
                      className={cn(
                        "group relative flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 text-left",
                        active
                          ? "border-[oklch(0.45_0.12_285)/0.4] bg-[oklch(0.45_0.12_285)/0.06]"
                          : "border-[oklch(0.45_0.12_285)/0.12] bg-white hover:border-[oklch(0.45_0.12_285)/0.35] hover:bg-[oklch(0.45_0.12_285)/0.03]"
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-md shrink-0 transition-all",
                          !active && "bg-[oklch(0.45_0.12_285)/0.06] text-[oklch(0.45_0.12_285)] group-hover:bg-[oklch(0.45_0.12_285)] group-hover:text-white"
                        )}
                        style={
                          active
                            ? { background:"oklch(0.45 0.12 285)", color:"white" }
                            : undefined
                        }
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p
                          className="text-[12px] font-medium leading-none"
                          style={{ color: active ? "oklch(0.45 0.12 285)" : "#0D031B" }}
                        >
                          {r.label}
                        </p>
                        <p className="text-[10px] mt-0.5 truncate text-[#9A94AA]">
                          {r.description}
                        </p>
                      </div>
                    </button>
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
                  label:"Google",
                  svg:(
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  ),
                },
                {
                  label:"Facebook",
                  svg:(
                    <svg className="h-4 w-4" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  ),
                },
              ].map(btn => (
                <button
                  key={btn.label}
                  type="button"
                  className="flex items-center justify-center gap-2.5 h-10 rounded-xl border text-[12px] font-medium transition-all hover:-translate-y-0.5 hover:shadow-sm"
                  style={{ background:"rgba(255,255,255,0.75)", borderColor:"oklch(0.45 0.12 285 / 0.18)", color:"#3D374C" }}
                >
                  {btn.svg}
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Separator className="flex-1" style={{ background:"oklch(0.45 0.12 285 / 0.15)" }} />
              <span className="text-[10px] font-medium uppercase  whitespace-nowrap px-1" style={{ color:"#AEA6BF" }}>
                or create manually
              </span>
              <Separator className="flex-1" style={{ background:"oklch(0.45 0.12 285 / 0.15)" }} />
            </div>
          </div>

          {/* ── Form card ────────────────────────────────────────── */}
          <Card
            className="border rounded-3xl shadow-sm overflow-hidden"
            style={{ background:"rgba(255,255,255,0.82)", borderColor:"oklch(0.45 0.12 285 / 0.14)" }}
          >
            <CardContent className="p-5">
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Full name */}
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-semibold" style={{ color:"#3D374C" }}>Full Name</Label>
                  <Input
                    id="name" type="text" placeholder="John Kamau"
                    value={name} onChange={e => setName(e.target.value)} required
                    className="h-10 rounded-xl text-sm border"
                    style={{ background:"#F5F2FB", borderColor:"oklch(0.45 0.12 285 / 0.2)", color:"#0D031B" }}
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold" style={{ color:"#3D374C" }}>Work Email</Label>
                  <Input
                    id="email" type="email" placeholder="name@restaurant.com"
                    value={email} onChange={e => setEmail(e.target.value)} required
                    className="h-10 rounded-xl text-sm border"
                    style={{ background:"#F5F2FB", borderColor:"oklch(0.45 0.12 285 / 0.2)", color:"#0D031B" }}
                  />
                </div>

                {/* Role select */}
                <div className="space-y-1.5">
                  <Label htmlFor="role-select" className="text-xs font-semibold" style={{ color:"#3D374C" }}>Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger
                      id="role-select"
                      className="h-10 rounded-xl text-sm border"
                      style={{ background:"#F5F2FB", borderColor:"oklch(0.45 0.12 285 / 0.2)", color:"#0D031B" }}
                    >
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent
                      className="rounded-2xl border"
                      style={{ background:"#FDFCFF", borderColor:"oklch(0.45 0.12 285 / 0.15)" }}
                    >
                      {roles.filter(r => r.value !== "staff").map(r => (
                        <SelectItem key={r.value} value={r.value} className="rounded-xl text-sm text-[#3D374C] focus:bg-[oklch(0.45_0.12_285)/0.08] focus:text-[oklch(0.45_0.12_285)] cursor-pointer">
                          {r.label}
                        </SelectItem>
                      ))}
                      <Separator className="my-1" style={{ background:"oklch(0.45 0.12 285 / 0.1)" }} />
                      <div className="px-2 py-1.5 text-[9px] font-bold uppercase " style={{ color:"#AEA6BF" }}>
                        Staff Members
                      </div>
                      {staffSubRoles.map(s => (
                        <SelectItem key={s.value} value={s.value} className="rounded-xl text-sm text-[#3D374C] focus:bg-[oklch(0.45_0.12_285)/0.08] focus:text-[oklch(0.45_0.12_285)] cursor-pointer">
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator style={{ background:"oklch(0.45 0.12 285 / 0.1)" }} />

                {/* Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-semibold" style={{ color:"#3D374C" }}>Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="h-10 rounded-xl text-sm border pr-10"
                      style={{ background:"#F5F2FB", borderColor:"oklch(0.45 0.12 285 / 0.2)", color:"#0D031B" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                      style={{ color:"#AEA6BF" }}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Strength meter */}
                  {password ? (
                    <div className="space-y-1.5">
                      <div className="flex gap-1">
                        {[1,2,3,4].map(i => (
                          <div
                            key={i}
                            className="h-1.5 flex-1 rounded-full transition-all duration-300"
                            style={{
                              background: i <= strength.level ? strength.color : "oklch(0.45 0.12 285 / 0.12)",
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-[10px]" style={{ color:"#736C83" }}>
                        Strength:{" "}
                        <span className="font-semibold" style={{ color: strength.color }}>
                          {strength.label}
                        </span>
                        {strength.level < 3 && " — add numbers & symbols"}
                      </p>
                    </div>
                  ) : (
                    <p className="text-[10px]" style={{ color:"#AEA6BF" }}>
                      Must be at least 8 characters
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2.5 h-11 rounded-2xl font-bold text-[13px] uppercase  text-white transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none relative overflow-hidden group"
                  style={{
                    background:"oklch(0.45 0.12 285)",
                    boxShadow:"0 6px 24px oklch(0.45 0.12 285 / 0.35)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin relative z-10" />
                      <span className="relative z-10">Creating account…</span>
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">Create account</span>
                      <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                <p className="text-center text-[10px] leading-relaxed" style={{ color:"#AEA6BF" }}>
                  By creating an account you agree to our{" "}
                  <Link href="/terms" className="font-semibold hover:opacity-70" style={{ color:"oklch(0.45 0.12 285)" }}>Terms</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="font-semibold hover:opacity-70" style={{ color:"oklch(0.45 0.12 285)" }}>Privacy Policy</Link>.
                </p>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-xs" style={{ color:"#736C83" }}>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold transition-opacity hover:opacity-70" style={{ color:"oklch(0.45 0.12 285)" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}