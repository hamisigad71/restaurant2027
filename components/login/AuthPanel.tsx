import { 
  BoltIcon as Zap, 
  XMarkIcon as X, 
  ChevronRightIcon as ChevronRight, 
  EnvelopeIcon as Mail, 
  LockClosedIcon as Lock, 
  EyeIcon as Eye, 
  EyeSlashIcon as EyeOff, 
  BoltIcon as UtensilsCrossed, 
  ShieldCheckIcon as Shield,
  ArrowRightIcon,
  BoltIcon
} from "@heroicons/react/24/outline"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { roleOptions, STAFF_SUB_ROLES, type UserRole } from "./constants"

interface AuthPanelProps {
  showStaffPicker: boolean
  setShowStaffPicker: (v: boolean) => void
  loadingRole: UserRole | null
  handleQuickLogin: (role: UserRole) => void
  handleSubmit: (e: React.FormEvent) => void
  email: string
  setEmail: (v: string) => void
  password: string
  setPassword: (v: string) => void
  showPassword: boolean
  setShowPassword: (v: (prev: boolean) => boolean) => void
  selectedRole: UserRole
  setSelectedRole: (role: UserRole) => void
  isLoading: boolean
}

export function AuthPanel({
  showStaffPicker,
  setShowStaffPicker,
  loadingRole,
  handleQuickLogin,
  handleSubmit,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  selectedRole,
  setSelectedRole,
  isLoading
}: AuthPanelProps) {
  return (
    <div
      className="flex flex-col justify-center px-6 py-10 lg:px-10 xl:px-14"
      style={{ background: "#F8F6FC" }}
    >
      {/* Mobile logo */}
      <div className="flex lg:hidden items-center mb-10 shrink-0">
        <img src="/logo-full.png" alt="Resto Logo" className="h-12 w-auto object-contain" />
      </div>

      <div className="w-full max-w-[440px] mx-auto space-y-7">
        <div className="space-y-2">
          <h1 className="text-[2rem] font-bold" style={{ color: "#0D031B" }}>
            Welcome back
          </h1>
          <p className="text-[14px] leading-relaxed" style={{ color: "#736C83" }}>
            Sign in to access your portal and manage your restaurant
          </p>
        </div>

        {/* Quick Demo Access */}
        <Card
          className="border rounded-[20px] shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
          style={{ background: "white", borderColor: "oklch(0.42 0.14 285 / 0.12)" }}
        >
          <div className="h-[4px]" style={{ background: "linear-gradient(90deg, oklch(0.42 0.14 285) 0%, oklch(0.55 0.18 270) 100%)" }} />
          <CardHeader className="px-6 pt-5 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "oklch(0.42 0.14 285 / 0.1)" }}>
                  <Zap className="h-4 w-4" style={{ color: "oklch(0.42 0.14 285)" }} />
                </div>
                <CardTitle className="text-[12px] font-semibold uppercase" style={{ color: "#3D374C" }}>
                  Quick Demo Access
                </CardTitle>
              </div>
              <Badge
                className="text-[9px] font-bold px-2.5 py-1 rounded-full border"
                style={{
                  background: "oklch(0.42 0.14 285 / 0.08)",
                  color: "oklch(0.42 0.14 285)",
                  borderColor: "oklch(0.42 0.14 285 / 0.25)",
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
                    <p className="text-[12px] font-semibold uppercase" style={{ color: "#0D031B" }}>
                      Select Staff Role
                    </p>
                    <button
                      onClick={() => setShowStaffPicker(false)}
                      className="flex items-center justify-center w-7 h-7 rounded-lg transition-all hover:bg-[#F0ECF9] active:scale-95"
                      style={{ color: "#9A94AA" }}
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
                        style={{ background: "white", borderColor: "oklch(0.42 0.14 285 / 0.14)" }}
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
                          style={{ background: "oklch(0.42 0.14 285 / 0.08)", color: "oklch(0.42 0.14 285)" }}
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
                    const Icon = opt.icon
                    const busy = loadingRole === opt.role
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
                            ? { borderColor: "oklch(0.42 0.14 285 / 0.4)", background: "oklch(0.42 0.14 285 / 0.06)" }
                            : { borderColor: "oklch(0.42 0.14 285 / 0.14)", background: "white" }
                        }
                      >
                        {!busy && <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[oklch(0.42_0.14_285_/_0.03)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />}
                        <div
                          className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 transition-all duration-200 relative z-10"
                          style={
                            busy
                              ? { background: "oklch(0.42 0.14 285)", color: "white" }
                              : { background: "oklch(0.42 0.14 285 / 0.08)", color: "oklch(0.42 0.14 285)" }
                          }
                        >
                          {busy
                            ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            : typeof opt.icon === 'string' ? (
                              <img src={opt.icon} className={cn("h-5 w-5 brightness-0", busy && "invert")} style={!busy ? { filter: 'invert(37%) sepia(93%) saturate(541%) hue-rotate(221deg) brightness(85%) contrast(89%)' } : undefined} />
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

        {/* Social login or email form... keeping it slightly simplified for readability */}
        <div className="space-y-4">
           <div className="flex items-center gap-4">
              <Separator className="flex-1" style={{ background:"oklch(0.42 0.14 285 / 0.12)" }} />
              <span className="text-[10px] font-bold uppercase whitespace-nowrap px-1" style={{ color:"#AEA6BF" }}>
                or continue with
              </span>
              <Separator className="flex-1" style={{ background:"oklch(0.42 0.14 285 / 0.12)" }} />
            </div>
            {/* Social Buttons would go here */}
        </div>

        <Card
          className="border rounded-[20px] shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
          style={{ background: "white", borderColor: "oklch(0.42 0.14 285 / 0.12)" }}
        >
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[12px] font-bold uppercase flex items-center gap-2" style={{ color: "#3D374C" }}>
                  <Mail className="h-3.5 w-3.5" style={{ color: "oklch(0.42 0.14 285)" }} />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@restaurant.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-xl text-[14px] border-2 transition-all duration-200 pl-4 pr-4 focus:shadow-md"
                  style={{ background: "#FAFAFE", borderColor: "oklch(0.42 0.14 285 / 0.14)", color: "#0D031B" }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[12px] font-bold uppercase flex items-center gap-2" style={{ color: "#3D374C" }}>
                    <Lock className="h-3.5 w-3.5" style={{ color: "oklch(0.42 0.14 285)" }} />
                    Password
                  </Label>
                  <Link href="/forgot-password" title="Forgot password?" className="text-[11px] font-semibold transition-all hover:underline" style={{ color: "oklch(0.42 0.14 285)" }}>
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
                    style={{ background: "#FAFAFE", borderColor: "oklch(0.42 0.14 285 / 0.14)", color: "#0D031B" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-all hover:scale-110 active:scale-95"
                    style={{ color: "#AEA6BF" }}
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                <Label className="text-[12px] font-bold uppercase flex items-center gap-2" style={{ color: "#3D374C" }}>
                  <Shield className="h-3.5 w-3.5" style={{ color: "oklch(0.42 0.14 285)" }} />
                  Select Portal
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {roleOptions.map((opt) => {
                    const Icon = opt.icon
                    const active = selectedRole === opt.role
                    return (
                      <button
                        key={opt.role}
                        type="button"
                        onClick={() => setSelectedRole(opt.role)}
                        className="relative flex flex-col items-center gap-2 py-3.5 px-1 rounded-xl border-2 text-[10px] font-bold transition-all duration-200 overflow-hidden active:scale-95"
                        style={
                          active
                            ? { background: "oklch(0.42 0.14 285 / 0.06)", borderColor: "oklch(0.42 0.14 285)", color: "oklch(0.42 0.14 285)", boxShadow: "0 8px 24px oklch(0.42 0.14 285 / 0.15)" }
                            : { background: "#FAFAFE", borderColor: "oklch(0.42 0.14 285 / 0.14)", color: "#736C83" }
                        }
                      >
                        {active && <div className="absolute inset-0 bg-gradient-to-br from-oklch(0.42 0.14 285 / 0.05) to-transparent" />}
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 h-12 rounded-2xl font-bold text-[13px] uppercase text-white transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl active:translate-y-0 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none relative overflow-hidden group"
                style={{
                  background: "linear-gradient(135deg, oklch(0.42 0.14 285) 0%, oklch(0.38 0.16 275) 100%)",
                  boxShadow: "0 8px 32px oklch(0.42 0.14 285 / 0.35)",
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

        <p className="text-center text-[13px]" style={{ color: "#736C83" }}>
          Don't have an account?{" "}
          <Link href="/signup" title="Create one" className="font-bold transition-all hover:underline" style={{ color: "oklch(0.42 0.14 285)" }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
