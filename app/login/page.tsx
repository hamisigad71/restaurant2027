"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  SparklesIcon as UtensilsCrossed, 
  EyeIcon as Eye, 
  EyeSlashIcon as EyeOff, 
  ShieldCheckIcon as Shield, 
  UserGroupIcon as Users,
  CakeIcon as ChefHat, 
  ShoppingCartIcon as ShoppingCart, 
  ArrowRightIcon as ArrowRight, 
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
import { Button }    from "@/components/ui/button"
import { Input }     from "@/components/ui/input"
import { Label }     from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge }     from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth, type UserRole } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

// ─── Data ─────────────────────────────────────────────────────────────────────
const roleOptions = [
  { role:"admin"   as UserRole, label:"Admin",   description:"Full access",      icon:Shield       },
  { role:"manager" as UserRole, label:"Manager", description:"Ops & reports",    icon:"/manager.png" },
  { role:"waiter"  as UserRole, label:"Staff",   description:"Waiter & support", icon:"/staff.png" },
  { role:"kitchen" as UserRole, label:"Kitchen", description:"Preparation",      icon:"/kitchen.png" },
]

const defaultRedirects: Record<UserRole, string> = {
  admin:    "/admin/dashboard",
  manager:  "/manager/dashboard",
  waiter:   "/waiter/dashboard",
  kitchen:  "/kitchen/kds",
  customer: "/customer",
  cleaner:  "/cleaners",
  security: "/security",
}

const stats = [
  { value:"5",          label:"Portals",  icon:Sparkles },
  { value:"99.9%",      label:"Uptime",   icon:TrendingUp },
  { value:"Real-time",  label:"Sync",     icon:Bolt },
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
  { id:"waiter",   label:"Waiter",   icon:"/staff.png",  desc:"Orders & Tables",       path:"/waiter/dashboard" },
  { id:"kitchen",  label:"Chef",     icon:ChefHat,       desc:"Kitchen KDS",            path:"/kitchen/kds"      },
  { id:"cleaner",  label:"Cleaner",  icon:UtensilsCrossed, desc:"Facility Maintenance", path:"/cleaners"         },
  { id:"security", label:"Security", icon:Shield,        desc:"Safety & Access",        path:"/security"         },
]

const features = [
  "Floor Plan View",
  "KDS Display",
  "Live Analytics",
  "5 Portals",
  "Real-time Sync",
  "Cloud Storage"
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()

  const [showPassword,    setShowPassword]    = useState(false)
  const [isLoading,       setIsLoading]       = useState(false)
  const [loadingRole,     setLoadingRole]     = useState<UserRole | null>(null)
  const [selectedRole,    setSelectedRole]    = useState<UserRole>("admin")
  const [email,           setEmail]           = useState("")
  const [password,        setPassword]        = useState("")
  const [showStaffPicker, setShowStaffPicker] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const ok = await login(email, password, selectedRole)
    if (ok) router.push(defaultRedirects[selectedRole])
    setIsLoading(false)
  }

  const handleQuickLogin = async (role: UserRole) => {
    if (role === "waiter" && !showStaffPicker) { setShowStaffPicker(true); return }
    setLoadingRole(role)
    setSelectedRole(role)
    const ok = await login(`${role}@smartrestaurant.co.ke`, "demo123", role)
    if (ok) router.push(defaultRedirects[role])
    setLoadingRole(null)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_1fr]" style={{ background:"#F8F6FC" }}>

      {/* ── LEFT — brand panel ───────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 xl:p-16 relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, oklch(0.42 0.14 285) 0%, oklch(0.32 0.16 285) 45%, oklch(0.18 0.12 285) 100%)",
        }}
      >
        {/* Enhanced Orbs */}
        <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full opacity-[0.15] pointer-events-none blur-3xl"
          style={{ background:"radial-gradient(circle, oklch(0.9 0.06 285), transparent 65%)" }} />
        <div className="absolute top-1/3 -left-20 w-[380px] h-[380px] rounded-full opacity-[0.1] pointer-events-none blur-2xl"
          style={{ background:"radial-gradient(circle, oklch(0.75 0.18 150), transparent 70%)" }} />
        <div className="absolute bottom-20 right-1/4 w-[280px] h-[280px] rounded-full opacity-[0.08] pointer-events-none blur-2xl"
          style={{ background:"radial-gradient(circle, oklch(0.8 0.2 200), transparent 70%)" }} />

        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
          style={{ backgroundImage:"url(data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E)" }} />

        <div className="relative z-10 flex flex-col h-full justify-between gap-12">

          {/* Project Logo */}
          <div className="flex items-center gap-4">
            <img src="/logo-full.png" alt="Resto Logo" className="h-16 w-auto brightness-0 invert" />
          </div>

          {/* Hero */}
          <div className="space-y-8 max-w-[480px]">
            <Badge
              className="flex items-center gap-2 px-3.5 py-2 text-[11px] font-bold rounded-full border w-fit backdrop-blur-sm"
              style={{ background:"rgba(255,255,255,0.12)", borderColor:"rgba(255,255,255,0.25)", color:"white", boxShadow:"0 4px 16px rgba(0,0,0,0.1)" }}
            >
              <Crown className="h-3.5 w-3.5" style={{ color:"#FDE68A" }} />
              Smart Restaurant OS · v2.0
            </Badge>

            <div className="space-y-4">
              <h2 className="text-white text-[2.8rem] xl:text-[3.2rem] font-bold leading-[1.08] ">
                The operating system
                <br />
                <span style={{ color:"rgba(255,255,255,0.5)" }}>your restaurant</span>{" "}
                <span className="relative inline-block">
                  <em className="not-italic" style={{ color:"rgba(255,255,255,0.95)" }}>deserves.</em>
                  <div className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full" 
                    style={{ background:"linear-gradient(90deg, #FDE68A 0%, transparent 100%)" }} />
                </span>
              </h2>
              <p className="text-[15px] leading-[1.7] max-w-[420px]" style={{ color:"rgba(255,255,255,0.65)" }}>
                Manage tables, track orders, display kitchen workflows, and
                analyse your business — all from one unified, real-time platform built for excellence.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3.5">
              {stats.map((s) => {
                const Icon = s.icon
                return (
                  <div
                    key={s.label}
                    className="group rounded-2xl p-4 border space-y-2 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-default"
                    style={{ 
                      background:"rgba(255,255,255,0.09)", 
                      borderColor:"rgba(255,255,255,0.15)",
                      boxShadow:"0 4px 16px rgba(0,0,0,0.08)"
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-white text-xl font-bold leading-none">{s.value}</p>
                      <Icon className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" style={{ color:"#FDE68A" }} />
                    </div>
                    <p className="text-[11px] font-medium" style={{ color:"rgba(255,255,255,0.5)" }}>{s.label}</p>
                  </div>
                )
              })}
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2.5">
              {features.map((f, i) => (
                <span
                  key={f}
                  className="flex items-center gap-2 text-[11px] font-medium rounded-full px-3.5 py-2 border backdrop-blur-sm transition-all duration-200 hover:scale-105 cursor-default"
                  style={{
                    background:"rgba(255,255,255,0.09)",
                    borderColor:"rgba(255,255,255,0.18)",
                    color:"rgba(255,255,255,0.85)",
                    animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both`
                  }}
                >
                  <Check className="h-3 w-3" style={{ color:"#FDE68A" }} />
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="space-y-3.5">
            {testimonials.map((t, i) => (
              <div
                key={t.author}
                className="rounded-2xl p-4.5 border backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-lg"
                style={{ 
                  background:"rgba(255,255,255,0.08)", 
                  borderColor:"rgba(255,255,255,0.14)",
                  animation: `fadeInUp 0.6s ease-out ${i * 0.2}s both`
                }}
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(t.rating)].map((_,i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-[13.5px] leading-[1.65] font-medium" style={{ color:"rgba(255,255,255,0.85)" }}>
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 mt-3.5">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 border"
                    style={{ 
                      background:"rgba(255,255,255,0.18)", 
                      color:"white",
                      borderColor:"rgba(255,255,255,0.3)"
                    }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-[12.5px] font-semibold text-white leading-none">{t.author}</p>
                    <p className="text-[10.5px] mt-1.5 font-medium" style={{ color:"rgba(255,255,255,0.5)" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT — auth panel ───────────────────────────────────── */}
      <div
        className="flex flex-col justify-center px-6 py-10 lg:px-10 xl:px-14"
        style={{ background:"#F8F6FC" }}
      >
        {/* Project Logo Mobile */}
        <div className="flex lg:hidden items-center mb-10">
          <img src="/logo-full.png" alt="Resto Logo" className="h-12 w-auto" />
        </div>

        <div className="w-full max-w-[440px] mx-auto space-y-7">

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-[2rem] font-bold " style={{ color:"#0D031B" }}>
              Welcome back
            </h1>
            <p className="text-[14px] leading-relaxed" style={{ color:"#736C83" }}>
              Sign in to access your portal and manage your restaurant
            </p>
          </div>

          {/* ── Quick demo ───────────────────────────────────────── */}
          <Card
            className="border rounded-[20px] shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
            style={{ background:"white", borderColor:"oklch(0.42 0.14 285 / 0.12)" }}
          >
            <div className="h-[4px]" style={{ background:"linear-gradient(90deg, oklch(0.42 0.14 285) 0%, oklch(0.55 0.18 270) 100%)" }} />
            <CardHeader className="px-6 pt-5 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" 
                    style={{ background:"oklch(0.42 0.14 285 / 0.1)" }}>
                    <Bolt className="h-4 w-4" style={{ color:"oklch(0.42 0.14 285)" }} />
                  </div>
                  <CardTitle className="text-[12px] font-semibold uppercase " style={{ color:"#3D374C" }}>
                    Quick Demo Access
                  </CardTitle>
                </div>
                <Badge
                  className="text-[9px] font-bold px-2.5 py-1 rounded-full border"
                  style={{
                    background:"oklch(0.42 0.14 285 / 0.08)",
                    color:"oklch(0.42 0.14 285)",
                    borderColor:"oklch(0.42 0.14 285 / 0.25)",
                  }}
                >
                  One-click
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="px-6 pb-6">
              <div className="min-h-[160px]">
                {showStaffPicker ? (
                  <div className="animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[12px] font-semibold uppercase " style={{ color:"#0D031B" }}>
                        Select Staff Role
                      </p>
                      <button
                        onClick={() => setShowStaffPicker(false)}
                        className="flex items-center justify-center w-7 h-7 rounded-lg transition-all hover:bg-[#F0ECF9] active:scale-95"
                        style={{ color:"#9A94AA" }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {STAFF_SUB_ROLES.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => { setShowStaffPicker(false); handleQuickLogin(sub.id as UserRole) }}
                          className="group flex items-center gap-2.5 p-3.5 rounded-xl border transition-all duration-200 text-left hover:shadow-md active:scale-[0.98]"
                          style={{
                            background:"white",
                            borderColor:"oklch(0.42 0.14 285 / 0.14)"
                          }}
                        >
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
                            style={{
                              background:"oklch(0.42 0.14 285 / 0.08)",
                              color:"oklch(0.42 0.14 285)"
                            }}
                          >
                            {typeof sub.icon === 'string' ? (
                              <img src={sub.icon} className="h-5 w-5 brightness-0" style={{ filter: 'invert(37%) sepia(93%) saturate(541%) hue-rotate(221deg) brightness(85%) contrast(89%)' }} />
                            ) : (
                              <sub.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-medium leading-none text-[#0D031B]">{sub.label}</p>
                            <p className="text-[10px] mt-1.5 truncate text-[#9A94AA]">{sub.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5 animate-in fade-in zoom-in-95 duration-300">
                    {roleOptions.map((opt) => {
                      const Icon  = opt.icon
                      const busy  = loadingRole === opt.role
                      return (
                        <button
                          key={opt.role}
                          onClick={() => handleQuickLogin(opt.role)}
                          disabled={!!loadingRole}
                          className={cn(
                            "group relative flex items-center gap-2.5 p-4 rounded-xl border transition-all duration-200 text-left overflow-hidden",
                            "disabled:opacity-60 disabled:cursor-not-allowed",
                            !busy && "hover:shadow-md active:scale-[0.98]",
                            busy && "ring-2 ring-[oklch(0.42_0.14_285_/_0.2)]",
                          )}
                          style={
                            busy
                              ? { 
                                  borderColor:"oklch(0.42 0.14 285 / 0.4)", 
                                  background:"oklch(0.42 0.14 285 / 0.06)",
                                }
                              : { borderColor:"oklch(0.42 0.14 285 / 0.14)", background:"white" }
                          }
                        >
                          {!busy && (
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[oklch(0.42_0.14_285_/_0.03)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          )}
                          <div
                            className={cn(
                              "flex items-center justify-center w-10 h-10 rounded-lg shrink-0 transition-all duration-200 relative z-10",
                            )}
                            style={
                              busy
                                ? { background:"oklch(0.42 0.14 285)", color:"white" }
                                : { background:"oklch(0.42 0.14 285 / 0.08)", color:"oklch(0.42 0.14 285)" }
                            }
                          >
                            {busy
                              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              : typeof opt.icon === 'string' ? (
                                <img src={opt.icon} className="h-5 w-5 brightness-0" style={{ filter: 'invert(37%) sepia(93%) saturate(541%) hue-rotate(221deg) brightness(85%) contrast(89%)' }} />
                              ) : (
                                <opt.icon className="h-4.5 w-4.5 transition-transform group-hover:scale-110" />
                              )
                            }
                          </div>
                          <div className="min-w-0 relative z-10">
                            <p className="text-[13px] font-medium leading-none text-[#0D031B]">{opt.label}</p>
                            <p className="text-[10.5px] mt-1.5 truncate text-[#9A94AA]">{opt.description}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Social */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Separator className="flex-1" style={{ background:"oklch(0.42 0.14 285 / 0.12)" }} />
              <span className="text-[10px] font-bold uppercase  whitespace-nowrap px-1" style={{ color:"#AEA6BF" }}>
                Social login
              </span>
              <Separator className="flex-1" style={{ background:"oklch(0.42 0.14 285 / 0.12)" }} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Google",
                  svg: (
                    <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  ),
                },
                {
                  label: "Facebook",
                  svg: (
                    <svg className="h-4.5 w-4.5" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  ),
                },
              ].map((btn) => (
                <button
                  key={btn.label}
                  className="flex items-center justify-center gap-2.5 h-11 rounded-xl border text-[13px] font-semibold transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                  style={{
                    background:"white",
                    borderColor:"oklch(0.42 0.14 285 / 0.16)",
                    color:"#3D374C",
                  }}
                >
                  {btn.svg}
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Separator className="flex-1" style={{ background:"oklch(0.42 0.14 285 / 0.12)" }} />
              <span className="text-[10px] font-bold uppercase  whitespace-nowrap px-1" style={{ color:"#AEA6BF" }}>
                or continue with email
              </span>
              <Separator className="flex-1" style={{ background:"oklch(0.42 0.14 285 / 0.12)" }} />
            </div>
          </div>

          {/* ── Manual login form ────────────────────────────────── */}
          <Card
            className="border rounded-[20px] shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
            style={{ background:"white", borderColor:"oklch(0.42 0.14 285 / 0.12)" }}
          >
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[12px] font-bold uppercase  flex items-center gap-2" style={{ color:"#3D374C" }}>
                    <Mail className="h-3.5 w-3.5" style={{ color:"oklch(0.42 0.14 285)" }} />
                    Email Address
                  </Label>
                  <div className="relative group">
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@restaurant.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="h-12 rounded-xl text-[14px] border-2 transition-all duration-200 pl-4 pr-4 focus:shadow-md"
                      style={{
                        background:"#FAFAFE",
                        borderColor:"oklch(0.42 0.14 285 / 0.14)",
                        color:"#0D031B",
                      }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-[12px] font-bold uppercase  flex items-center gap-2" style={{ color:"#3D374C" }}>
                      <Lock className="h-3.5 w-3.5" style={{ color:"oklch(0.42 0.14 285)" }} />
                      Password
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-[11px] font-semibold transition-all hover:underline"
                      style={{ color:"oklch(0.42 0.14 285)" }}
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="h-12 rounded-xl text-[14px] border-2 transition-all duration-200 pl-4 pr-12 focus:shadow-md"
                      style={{
                        background:"#FAFAFE",
                        borderColor:"oklch(0.42 0.14 285 / 0.14)",
                        color:"#0D031B",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 transition-all hover:scale-110 active:scale-95"
                      style={{ color:"#AEA6BF" }}
                    >
                      {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                </div>

                {/* Portal selector */}
                <div className="space-y-2.5">
                  <Label className="text-[12px] font-bold uppercase  flex items-center gap-2" style={{ color:"#3D374C" }}>
                    <Shield className="h-3.5 w-3.5" style={{ color:"oklch(0.42 0.14 285)" }} />
                    Select Portal
                  </Label>
                  <div className="grid grid-cols-4 gap-2">
                    {roleOptions.map((opt) => {
                      const Icon   = opt.icon
                      const active = selectedRole === opt.role
                      return (
                        <button
                          key={opt.role}
                          type="button"
                          onClick={() => setSelectedRole(opt.role)}
                          className="relative flex flex-col items-center gap-2 py-3.5 px-1 rounded-xl border-2 text-[10px] font-bold transition-all duration-200 overflow-hidden active:scale-95"
                          style={
                            active
                              ? { 
                                  background:"oklch(0.42 0.14 285 / 0.06)", 
                                  borderColor:"oklch(0.42 0.14 285)", 
                                  color:"oklch(0.42 0.14 285)",
                                  boxShadow:"0 8px 24px oklch(0.42 0.14 285 / 0.15)"
                                }
                              : { 
                                  background:"#FAFAFE", 
                                  borderColor:"oklch(0.42 0.14 285 / 0.14)", 
                                  color:"#736C83" 
                                }
                          }
                        >
                          {active && (
                            <div className="absolute inset-0 bg-gradient-to-br from-oklch(0.42 0.14 285 / 0.05) to-transparent" />
                          )}
                          {typeof opt.icon === 'string' ? (
                            <img src={opt.icon} className={cn("h-4 w-4 relative z-10 transition-transform", active && "scale-110 brightness-0")} style={active ? { filter: 'invert(37%) sepia(93%) saturate(541%) hue-rotate(221deg) brightness(85%) contrast(89%)' } : { opacity: 0.7 }} />
                          ) : (
                            <Icon className={cn("h-4 w-4 relative z-10 transition-transform", active && "scale-110")} />
                          )}
                          <span className="relative z-10">{opt.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 h-12 rounded-2xl font-bold text-[13px] uppercase  text-white transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl active:translate-y-0 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none relative overflow-hidden group"
                  style={{
                    background:"linear-gradient(135deg, oklch(0.42 0.14 285) 0%, oklch(0.38 0.16 275) 100%)",
                    boxShadow:"0 8px 32px oklch(0.42 0.14 285 / 0.35)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  {isLoading ? (
                    <>
                      <div className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin relative z-10" />
                      <span className="relative z-10">Signing in…</span>
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">Sign in</span>
                      <ChevronRight className="h-4.5 w-4.5 relative z-10 transition-transform group-hover:translate-x-1" strokeWidth={3} />
                    </>
                  )}
                </button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-[13px]" style={{ color:"#736C83" }}>
            Don't have an account?{" "}
            <Link href="/signup" className="font-bold transition-all hover:underline" style={{ color:"oklch(0.42 0.14 285)" }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}