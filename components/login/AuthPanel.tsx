import {
  BoltIcon as Zap,
  XMarkIcon as X,
  ChevronRightIcon as ChevronRight,
  EnvelopeIcon as Mail,
  LockClosedIcon as Lock,
  EyeIcon as Eye,
  EyeSlashIcon as EyeOff,
  ShieldCheckIcon as Shield,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
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
    <div className="flex flex-col justify-center px-6 py-10 lg:px-10 xl:px-24 bg-background">
      <div className="flex lg:hidden items-center mb-10 shrink-0">
        <TableTapLogo variant="light" size="md" />
      </div>

      <div className="w-full max-w-[440px] mx-auto space-y-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to access your portal and manage your restaurant
          </p>
        </div>

        <Card size="sm" className="overflow-hidden shadow-sm">
          <CardHeader className="border-b">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-secondary text-primary">
                <Zap className="size-4" />
              </div>
              <CardTitle className="text-xs font-semibold uppercase tracking-wider">
                Quick Demo Access
              </CardTitle>
            </div>
            <CardAction>
              <Badge variant="secondary" className="gap-1.5">
                <span className="size-1.5 rounded-full bg-accent" />
                One-click
              </Badge>
            </CardAction>
          </CardHeader>

          <CardContent>
            <div className="min-h-[160px]">
              {showStaffPicker ? (
                <div className="animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold uppercase text-foreground">
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
                          setShowStaffPicker(false);
                          handleQuickLogin(sub.id as UserRole);
                        }}
                        className="group h-auto flex-col items-stretch justify-between p-3.5 text-left rounded-xl hover:border-primary/40 hover:bg-secondary/40"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary group-hover:bg-primary group-hover:text-accent transition-colors">
                            {typeof sub.icon === "string" ? (
                              <div
                                className="size-4 bg-current"
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
                              <sub.icon className="size-4" />
                            )}
                          </div>
                          <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
                        </div>
                        <div className="mt-3 space-y-0.5 min-w-0 w-full">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {sub.label}
                          </p>
                          <p className="text-xs text-muted-foreground font-normal truncate">
                            {sub.desc}
                          </p>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 animate-in fade-in zoom-in-95 duration-200">
                  {roleOptions.map((opt) => {
                    const Icon = opt.icon;
                    const busy = loadingRole === opt.role;
                    return (
                      <Button
                        key={opt.role}
                        type="button"
                        variant="outline"
                        onClick={() => handleQuickLogin(opt.role)}
                        disabled={!!loadingRole}
                        className={cn(
                          "group h-auto flex-col items-stretch justify-between p-3.5 text-left rounded-xl hover:border-primary/40 hover:bg-secondary/40",
                          busy && "border-primary bg-secondary ring-2 ring-ring/40",
                        )}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div
                            className={cn(
                              "flex size-9 items-center justify-center rounded-lg transition-colors",
                              busy
                                ? "bg-primary text-accent"
                                : "bg-secondary text-primary group-hover:bg-primary group-hover:text-accent",
                            )}
                          >
                            {busy ? (
                              <Spinner className="size-4" />
                            ) : typeof opt.icon === "string" ? (
                              <div
                                className="size-4 bg-current"
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
                              <Icon className="size-4" />
                            )}
                          </div>
                          <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
                        </div>
                        <div className="mt-3 space-y-0.5 min-w-0 w-full">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {opt.label}
                          </p>
                          <p className="text-xs text-muted-foreground font-normal truncate">
                            {opt.description}
                          </p>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-[10px] font-semibold uppercase text-muted-foreground whitespace-nowrap">
            or continue with
          </span>
          <Separator className="flex-1" />
        </div>

        <Card className="shadow-sm">
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup className="gap-5">
                <Field>
                  <FieldLabel htmlFor="email" className="text-xs font-semibold uppercase">
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
                    <FieldLabel htmlFor="password" className="text-xs font-semibold uppercase">
                      <Lock className="size-3.5 text-primary" />
                      Password
                    </FieldLabel>
                    <Link
                      href="/forgot-password"
                      title="Forgot password?"
                      className="text-xs font-medium text-primary hover:underline"
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
                        size="icon-sm"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </Field>

                <Field>
                  <FieldLabel className="text-xs font-semibold uppercase">
                    <Shield className="size-3.5 text-primary" />
                    Select Portal
                  </FieldLabel>
                  <div className="grid grid-cols-4 gap-2">
                    {roleOptions.map((opt) => {
                      const Icon = opt.icon;
                      const active = selectedRole === opt.role;
                      return (
                        <Button
                          key={opt.role}
                          type="button"
                          variant={active ? "default" : "outline"}
                          onClick={() => setSelectedRole(opt.role)}
                          className="h-auto flex-col gap-1.5 py-3 px-1 text-[11px]"
                        >
                          {typeof opt.icon === "string" ? (
                            <div
                              className="size-4 bg-current"
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
                            <Icon className="size-4" />
                          )}
                          <span>{opt.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </Field>

                <Button type="submit" disabled={isLoading} size="lg" className="w-full">
                  {isLoading ? (
                    <>
                      <Spinner />
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
          <Link href="/signup" title="Create one" className="font-semibold text-primary hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
