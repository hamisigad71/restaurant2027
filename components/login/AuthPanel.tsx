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
  BoltIcon,
} from "@heroicons/react/24/outline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TableTapLogo } from "@/components/brand/tabletap-logo";
import { roleOptions, STAFF_SUB_ROLES, type UserRole } from "./constants";

interface AuthPanelProps {
  showStaffPicker: boolean;
  setShowStaffPicker: (v: boolean) => void;
  loadingRole: UserRole | null;
  handleQuickLogin: (role: UserRole) => void;
  handleSubmit: (e: React.FormEvent) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: (prev: boolean) => boolean) => void;
  selectedRole: UserRole;
  setSelectedRole: (role: UserRole) => void;
  isLoading: boolean;
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
  isLoading,
}: AuthPanelProps) {
  return (
    <div
      className="flex flex-col justify-center px-6 py-10 lg:px-10 xl:px-24"
      style={{ background: "#F4FAF7" }}
    >
      {/* Mobile logo */}
      <div className="flex lg:hidden items-center mb-10 shrink-0">
        <TableTapLogo variant="light" size="md" />
      </div>

      <div className="w-full max-w-[440px] mx-auto space-y-7">
        <div className="space-y-2">
          <h1 className="text-[2rem] font-bold" style={{ color: "#082420" }}>
            Welcome back
          </h1>
          <p
            className="text-[14px] leading-relaxed"
            style={{ color: "#4B6E67" }}
          >
            Sign in to access your portal and manage your restaurant
          </p>
        </div>

        {/* Quick Demo Access */}
        <Card className="border border-[#0B3B36]/12 rounded-2xl bg-white shadow-[0_8px_30px_-12px_rgba(11,59,54,0.12)] overflow-hidden">
          <div
            className="h-[3px]"
            style={{
              background: "linear-gradient(90deg, #0B3B36 0%, #166558 65%, #7AE72A 100%)",
            }}
          />
          <CardHeader className="px-6 pt-5 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#E7F5EE] border border-[#0B3B36]/10">
                  <Zap className="h-4 w-4 text-[#0B3B36]" />
                </div>
                <CardTitle className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#133D38]">
                  Quick Demo Access
                </CardTitle>
              </div>
              <Badge className="bg-[#E7F5EE] text-[#0B3B36] border border-[#0B3B36]/15 text-[10px] font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 shadow-none hover:bg-[#E7F5EE]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4CC718]" />
                One-click
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            <div className="min-h-[160px]">
              {showStaffPicker ? (
                <div className="animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between mb-3.5">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[#082420]">
                      Select Staff Role
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowStaffPicker(false)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-[#4B6E67] hover:text-[#082420] hover:bg-[#E7F5EE] transition-colors active:scale-[0.97]"
                    >
                      <X className="h-3.5 w-3.5" />
                      Back
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {STAFF_SUB_ROLES.map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => {
                          setShowStaffPicker(false);
                          handleQuickLogin(sub.id as UserRole);
                        }}
                        className={cn(
                          "group relative flex flex-col justify-between p-4 rounded-2xl border text-left select-none",
                          "bg-[#F8FCFA] border-[#0B3B36]/12 shadow-[0_1px_2px_rgba(11,59,54,0.04)]",
                          "transition-[transform,background-color,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3B36]/40 focus-visible:ring-offset-2",
                          "hover:bg-white hover:border-[#0B3B36]/35 hover:shadow-[0_10px_24px_-10px_rgba(11,59,54,0.22)] active:scale-[0.97]",
                        )}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border shrink-0 bg-[#E7F5EE] border-[#0B3B36]/10 text-[#0B3B36] transition-[background-color,border-color,color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:bg-[#0B3B36] group-hover:border-[#0B3B36] group-hover:text-[#7AE72A]">
                            {typeof sub.icon === "string" ? (
                              <div
                                className="h-5 w-5 bg-current"
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
                            ) : (
                              <sub.icon className="h-5 w-5" />
                            )}
                          </div>
                          <ChevronRight
                            className="h-4 w-4 text-[#0B3B36]/25 transition-[transform,color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:text-[#0B3B36] group-hover:translate-x-0.5"
                            strokeWidth={2.25}
                          />
                        </div>
                        <div className="mt-3.5 space-y-0.5 min-w-0 w-full">
                          <p className="text-[14px] font-bold tracking-[-0.01em] text-[#082420] leading-snug truncate">
                            {sub.label}
                          </p>
                          <p className="text-[11.5px] font-medium text-[#52756E] leading-snug truncate">
                            {sub.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 animate-in fade-in zoom-in-95 duration-200">
                  {roleOptions.map((opt) => {
                    const Icon = opt.icon;
                    const busy = loadingRole === opt.role;
                    return (
                      <button
                        key={opt.role}
                        type="button"
                        onClick={() => handleQuickLogin(opt.role)}
                        disabled={!!loadingRole}
                        className={cn(
                          "group relative flex flex-col justify-between p-4 rounded-2xl border text-left select-none",
                          "bg-[#F8FCFA] border-[#0B3B36]/12 shadow-[0_1px_2px_rgba(11,59,54,0.04)]",
                          "transition-[transform,background-color,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3B36]/40 focus-visible:ring-offset-2",
                          "disabled:opacity-60 disabled:cursor-not-allowed",
                          !busy &&
                            "hover:bg-white hover:border-[#0B3B36]/35 hover:shadow-[0_10px_24px_-10px_rgba(11,59,54,0.22)] active:scale-[0.97]",
                          busy && "bg-[#EDF8F2] border-[#0B3B36] ring-2 ring-[#7AE72A]/45",
                        )}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-xl border shrink-0",
                              "transition-[background-color,border-color,color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]",
                              busy
                                ? "bg-[#0B3B36] border-[#0B3B36] text-[#7AE72A]"
                                : "bg-[#E7F5EE] border-[#0B3B36]/10 text-[#0B3B36] group-hover:bg-[#0B3B36] group-hover:border-[#0B3B36] group-hover:text-[#7AE72A]",
                            )}
                          >
                            {busy ? (
                              <div className="h-4 w-4 rounded-full border-2 border-[#7AE72A]/30 border-t-[#7AE72A] animate-spin" />
                            ) : typeof opt.icon === "string" ? (
                              <div
                                className="h-5 w-5 bg-current"
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
                            ) : (
                              <Icon className="h-5 w-5" />
                            )}
                          </div>
                          <ChevronRight
                            className="h-4 w-4 text-[#0B3B36]/25 transition-[transform,color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:text-[#0B3B36] group-hover:translate-x-0.5"
                            strokeWidth={2.25}
                          />
                        </div>
                        <div className="mt-3.5 space-y-0.5 min-w-0 w-full">
                          <p className="text-[14px] font-bold tracking-[-0.01em] text-[#082420] leading-snug truncate">
                            {opt.label}
                          </p>
                          <p className="text-[11.5px] font-medium text-[#52756E] leading-snug truncate">
                            {opt.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Social login or email form... keeping it slightly simplified for readability */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Separator
              className="flex-1"
              style={{ background: "rgba(11, 59, 54,  0.12)" }}
            />
            <span
              className="text-[10px] font-bold uppercase whitespace-nowrap px-1"
              style={{ color: "var(--icon-primary)" }}
            >
              or continue with
            </span>
            <Separator
              className="flex-1"
              style={{ background: "rgba(11, 59, 54,  0.12)" }}
            />
          </div>
          {/* Social Buttons would go here */}
        </div>

        <Card
          className="border rounded-[20px] shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
          style={{
            background: "white",
            borderColor: "rgba(11, 59, 54,  0.12)",
          }}
        >
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-[12px] font-bold uppercase flex items-center gap-2"
                  style={{ color: "#133D38" }}
                >
                  <Mail className="h-3.5 w-3.5" style={{ color: "#0B3B36" }} />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@restaurant.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-xl text-[14px] border-2 transition-all duration-200 pl-4 pr-4 focus:shadow-md"
                  style={{
                    background: "#F4FAF7",
                    borderColor: "rgba(11, 59, 54,  0.14)",
                    color: "#082420",
                  }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-[12px] font-bold uppercase flex items-center gap-2"
                    style={{ color: "#133D38" }}
                  >
                    <Lock
                      className="h-3.5 w-3.5"
                      style={{ color: "#0B3B36" }}
                    />
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    title="Forgot password?"
                    className="text-[11px] font-semibold transition-all hover:underline"
                    style={{ color: "#0B3B36" }}
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
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 rounded-xl text-[14px] border-2 transition-all duration-200 pl-4 pr-12 focus:shadow-md"
                    style={{
                      background: "#F4FAF7",
                      borderColor: "rgba(11, 59, 54,  0.14)",
                      color: "#082420",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-all hover:scale-110 active:scale-95"
                    style={{ color: "var(--icon-primary)" }}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4.5 w-4.5" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                <Label
                  className="text-[12px] font-bold uppercase flex items-center gap-2"
                  style={{ color: "#133D38" }}
                >
                  <Shield
                    className="h-3.5 w-3.5"
                    style={{ color: "#0B3B36" }}
                  />
                  Select Portal
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {roleOptions.map((opt) => {
                    const Icon = opt.icon;
                    const active = selectedRole === opt.role;
                    return (
                      <button
                        key={opt.role}
                        type="button"
                        onClick={() => setSelectedRole(opt.role)}
                        className="relative flex flex-col items-center gap-2 py-3.5 px-1 rounded-xl border-2 text-[10px] font-bold transition-all duration-200 overflow-hidden active:scale-95"
                        style={
                          active
                            ? {
                                background: "rgba(11, 59, 54,  0.06)",
                                borderColor: "#0B3B36",
                                color: "#0B3B36",
                                boxShadow: "0 8px 24px rgba(11, 59, 54,  0.15)",
                              }
                            : {
                                background: "#F4FAF7",
                                borderColor: "rgba(11, 59, 54,  0.14)",
                                color: "#4B6E67",
                              }
                        }
                      >
                        {active && (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#0B3B36]/5 to-transparent" />
                        )}
                        {typeof opt.icon === "string" ? (
                          <img
                            src={opt.icon}
                            className={cn(
                              "h-4 w-4 relative z-10 transition-transform",
                              active && "scale-110 brightness-0",
                            )}
                            style={
                              active
                                ? {
                                    filter:
                                      "invert(17%) sepia(50%) saturate(1475%) hue-rotate(125deg) brightness(94%) contrast(96%)",
                                  }
                                : { opacity: 0.7 }
                            }
                          />
                        ) : (
                          <Icon
                            className={cn(
                              "h-4 w-4 relative z-10 transition-transform",
                              active && "scale-110",
                            )}
                          />
                        )}
                        <span className="relative z-10">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 h-12 rounded-2xl font-bold text-[13px] uppercase text-white transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl active:translate-y-0 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none relative overflow-hidden group"
                style={{
                  background:
                    "linear-gradient(135deg, #0B3B36 0%, #062421 100%)",
                  boxShadow: "0 8px 32px rgba(11, 59, 54,  0.35)",
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
                    <ChevronRight
                      className="h-4.5 w-4.5 relative z-10 transition-transform group-hover:translate-x-1"
                      strokeWidth={3}
                    />
                  </>
                )}
              </button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-[13px]" style={{ color: "#4B6E67" }}>
          Don't have an account?{" "}
          <Link
            href="/signup"
            title="Create one"
            className="font-bold transition-all hover:underline"
            style={{ color: "#0B3B36" }}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
