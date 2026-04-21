import { 
  BoltIcon as UtensilsCrossed, 
  BoltIcon as Crown, 
  StarIcon as Star, 
  CheckIcon as Check 
} from "@heroicons/react/24/outline"
import { Badge } from "@/components/ui/badge"
import { stats, features, testimonials } from "./constants"

export function BrandPanel() {
  return (
    <div
      className="hidden lg:flex flex-col justify-between p-12 xl:p-16 relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, oklch(0.42 0.14 285) 0%, oklch(0.32 0.16 285) 45%, oklch(0.18 0.12 285) 100%)",
      }}
    >
      {/* Enhanced Orbs */}
      <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full opacity-[0.15] pointer-events-none blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.9 0.06 285), transparent 65%)" }} />
      <div className="absolute top-1/3 -left-20 w-[380px] h-[380px] rounded-full opacity-[0.1] pointer-events-none blur-2xl"
        style={{ background: "radial-gradient(circle, oklch(0.75 0.18 150), transparent 70%)" }} />
      <div className="absolute bottom-20 right-1/4 w-[280px] h-[280px] rounded-full opacity-[0.08] pointer-events-none blur-2xl"
        style={{ background: "radial-gradient(circle, oklch(0.8 0.2 200), transparent 70%)" }} />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: "url(data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E)" }} />

      <div className="relative z-10 flex flex-col h-full justify-between gap-12">
        {/* Logo */}
        <div className="flex items-center gap-3.5">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-2xl border backdrop-blur-sm"
            style={{ background: "rgba(255,255,255,0.14)", borderColor: "rgba(255,255,255,0.25)", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
          >
            <UtensilsCrossed className="h-5.5 w-5.5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-white text-[22px] font-bold uppercase leading-none">Resto</p>
            <p className="text-[9px] uppercase mt-1 font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
              Grande Cuisine
            </p>
          </div>
        </div>

        {/* Hero */}
        <div className="space-y-8 max-w-[480px]">
          <Badge
            className="flex items-center gap-2 px-3.5 py-2 text-[11px] font-bold rounded-full border w-fit backdrop-blur-sm"
            style={{ background: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.25)", color: "white", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}
          >
            <Crown className="h-3.5 w-3.5" style={{ color: "#FDE68A" }} />
            Smart Restaurant OS · v2.0
          </Badge>

          <div className="space-y-4">
            <h2 className="text-white text-[2.8rem] xl:text-[3.2rem] font-bold leading-[1.08]">
              The operating system
              <br />
              <span style={{ color: "rgba(255,255,255,0.5)" }}>your restaurant</span>{" "}
              <span className="relative inline-block">
                <em className="not-italic" style={{ color: "rgba(255,255,255,0.95)" }}>deserves.</em>
                <div className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                  style={{ background: "linear-gradient(90deg, #FDE68A 0%, transparent 100%)" }} />
              </span>
            </h2>
            <p className="text-[15px] leading-[1.7] max-w-[420px]" style={{ color: "rgba(255,255,255,0.65)" }}>
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
                    background: "rgba(255,255,255,0.09)",
                    borderColor: "rgba(255,255,255,0.15)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
                  }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-white text-xl font-bold leading-none">{s.value}</p>
                    <Icon className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" style={{ color: "#FDE68A" }} />
                  </div>
                  <p className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>{s.label}</p>
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
                  background: "rgba(255,255,255,0.09)",
                  borderColor: "rgba(255,255,255,0.18)",
                  color: "rgba(255,255,255,0.85)",
                  animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both`
                }}
              >
                <Check className="h-3 w-3" style={{ color: "#FDE68A" }} />
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
                background: "rgba(255,255,255,0.08)",
                borderColor: "rgba(255,255,255,0.14)",
                animation: `fadeInUp 0.6s ease-out ${i * 0.2}s both`
              }}
            >
              <div className="flex gap-1 mb-3">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-[13.5px] leading-[1.65] font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>
                "{t.text}"
              </p>
              <div className="flex items-center gap-3 mt-3.5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 border"
                  style={{
                    background: "rgba(255,255,255,0.18)",
                    color: "white",
                    borderColor: "rgba(255,255,255,0.3)"
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-[12.5px] font-semibold text-white leading-none">{t.author}</p>
                  <p className="text-[10.5px] mt-1.5 font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
