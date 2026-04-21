"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const statuses = [
  "Initialising your workspace…",
  "Loading table assignments…",
  "Syncing kitchen display…",
  "Fetching menu catalogue…",
  "Almost ready…",
];

const percents = [14, 32, 55, 72, 91];

interface GlassLoaderProps {
  className?: string;
  fullScreen?: boolean;
  autoHideDuration?: number;
}

export function GlassLoader({ className, fullScreen = true, autoHideDuration = 7000 }: GlassLoaderProps) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const pathname = usePathname();
  const isFirstLoad = useRef(true);

  // Hook into route changes to restart the loader
  useEffect(() => {
    // Reset loader whenever the route changes
    setStep(0);
    setVisible(true);
    setIsFadingOut(false);
    setIsComplete(false);

    // If it's a route change (not the first load), we might want a shorter duration,
    // but we will respect the autoHideDuration unless overwritten.
    const activeDuration = isFirstLoad.current ? autoHideDuration : 2000;
    isFirstLoad.current = false;

    // Handle the text step transitions
    const stepTimer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setStep((s) => (s + 1) % statuses.length);
        setVisible(true);
      }, 200);
    }, 800); // Faster transitions for shorter loaders

    // Handle the mandatory display time
    let hideTimer: NodeJS.Timeout;
    let completeTimer: NodeJS.Timeout;

    if (activeDuration > 0) {
      hideTimer = setTimeout(() => {
        setIsFadingOut(true); // Trigger CSS fade out
        
        completeTimer = setTimeout(() => {
          setIsComplete(true); // Then completely remove from DOM
        }, 600); // 600ms matches the fade-out animation duration
      }, activeDuration);
    }

    return () => {
      clearInterval(stepTimer);
      if (hideTimer) clearTimeout(hideTimer);
      if (completeTimer) clearTimeout(completeTimer);
    };
  }, [pathname, autoHideDuration]);

  if (isComplete) return null;

  const pct = percents[step] || 99;

  return (
    <>
      <style>{`
        @keyframes spin-ring  { to { stroke-dashoffset: -502; } }
        @keyframes spin-ring2 { to { stroke-dashoffset:  314; } }
        @keyframes spin-ring3 { to { stroke-dashoffset: -188; } }
        @keyframes pulse-glow { 0%,100%{opacity:.1;} 50%{opacity:.25;} }
        @keyframes float-logo { 0%,100%{transform:translateY(0px);} 50%{transform:translateY(-6px);} }
        @keyframes shimmer     { 0%,100%{opacity:.12;} 50%{opacity:.28;} }
        @keyframes fade-dots   { 0%,100%{opacity:.3;} 50%{opacity:1;} }
        @keyframes glass-in    { from{opacity:0;transform:scale(.94);} to{opacity:1;transform:scale(1);} }
        @keyframes glass-out   { from{opacity:1;transform:scale(1);} to{opacity:0;transform:scale(1.03);} }
        @keyframes orb1 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(18px,-12px)} 66%{transform:translate(-10px,14px)} }
        @keyframes orb2 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(-14px,10px)} 66%{transform:translate(16px,-8px)} }
        @keyframes orb3 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(10px,16px)} 66%{transform:translate(-18px,-10px)} }
        @keyframes text-shimmer { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes shimmer-light { 0%,100%{opacity:0.3} 50%{opacity:0.8} }

        .rl-ring1 {
          stroke: #5b4fa8;
          stroke-dasharray: 502;
          stroke-dashoffset: 100;
          animation: spin-ring 2.2s cubic-bezier(.55,.1,.45,.9) infinite;
          transform-origin: 80px 80px;
        }
        .rl-ring2 {
          stroke: #AEA6BF;
          stroke-dasharray: 377;
          stroke-dashoffset: -80;
          animation: spin-ring2 1.8s cubic-bezier(.55,.1,.45,.9) infinite reverse;
          transform-origin: 80px 80px;
        }
        .rl-ring3 {
          stroke: rgba(91, 79, 168, 0.25);
          stroke-dasharray: 251;
          stroke-dashoffset: 50;
          animation: spin-ring3 3s linear infinite;
          transform-origin: 80px 80px;
        }
        .rl-progress-inner::after {
          content:'';
          position:absolute; right:0; top:0; bottom:0; width:24px;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.6));
          animation:shimmer-light 1.4s ease-in-out infinite;
          border-radius:99px;
        }
        .rl-dot:nth-child(2){ animation-delay:.2s; }
        .rl-dot:nth-child(3){ animation-delay:.4s; }
      `}</style>

      {/* ── Full-screen overlay (Light Mode) ───────────────────────── */}
      <div
        className={cn(className)}
        style={{
          position:       fullScreen ? "fixed" : "absolute",
          inset:          0,
          zIndex:         9999,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          background:     "rgba(250, 249, 252, 0.8)", // Frosted light background
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          overflow:       "hidden",
          animation:      isFadingOut ? "glass-out .6s ease forwards" : "glass-in .5s ease both",
        }}
      >
        {/* Background Light Orbs */}
        {[
          { w:250, h:250, bg:"#EBE6F8", top:"-40px", left:"-30px",  op:.8, anim:"orb1 8s ease-in-out infinite"  },
          { w:200, h:200, bg:"#D6D0EC", bottom:"-20px", right:"-20px", op:.6, anim:"orb2 10s ease-in-out infinite" },
          { w:180, h:180, bg:"#F3E8FF", top:"50%", left:"50%", mt:-90, ml:-90, op:.5, anim:"orb3 12s ease-in-out infinite" },
        ].map((orb, i) => (
          <div
            key={i}
            style={{
              position:     "absolute",
              borderRadius: "50%",
              filter:       "blur(48px)",
              pointerEvents:"none",
              width:        orb.w,
              height:       orb.h,
              background:   orb.bg,
              top:          orb.top,
              left:         orb.left,
              bottom:       (orb as any).bottom,
              right:        (orb as any).right,
              marginTop:    (orb as any).mt,
              marginLeft:   (orb as any).ml,
              opacity:      orb.op,
              animation:    orb.anim,
            }}
          />
        ))}

        {/* Light Glass card (Container without box) */}
        <div
          style={{
            position:           "relative",
            zIndex:             2,
            display:            "flex",
            flexDirection:      "column",
            alignItems:         "center",
            gap:                28,
            padding:            "44px 52px 40px",
          }}
        >
          {/* ── Spinner rings + logo ─────────────────────────────── */}
          <div style={{ position:"relative", width:160, height:160, display:"flex", alignItems:"center", justifyContent:"center" }}>
            {/* Ring 1 */}
            <svg style={{ position:"absolute", top:0, left:0 }} width="160" height="160" viewBox="0 0 160 160" fill="none">
              <circle className="rl-ring1" cx="80" cy="80" r="72" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
            {/* Ring 2 */}
            <svg style={{ position:"absolute", top:0, left:0 }} width="160" height="160" viewBox="0 0 160 160" fill="none">
              <circle className="rl-ring2" cx="80" cy="80" r="60" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
            {/* Ring 3 — dashed */}
            <svg style={{ position:"absolute", top:0, left:0 }} width="160" height="160" viewBox="0 0 160 160" fill="none">
              <circle className="rl-ring3" cx="80" cy="80" r="50" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeDasharray="6 10" />
            </svg>

            {/* Pulse glow */}
            <div
              style={{
                position:     "absolute",
                borderRadius: "50%",
                background:   "radial-gradient(circle, rgba(91,79,168,0.2) 0%, transparent 70%)",
                width:        116,
                height:       116,
                top:          22,
                left:         22,
                animation:    "pulse-glow 2.4s ease-in-out infinite",
                pointerEvents:"none",
              }}
            />

            {/* Logo tile — light mode colors */}
            <div
              style={{
                position:     "absolute",
                width:        96,
                height:       96,
                borderRadius: 24,
             // Primary deep purple
                display:      "flex",
                alignItems:   "center",
                justifyContent:"center",
                animation:    "float-logo 3s ease-in-out infinite",
                boxShadow:    "0 8px 24px rgba(91,79,168,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
                border:       "none",
                outline:      "none",
              }}
            >
              {/* Project Logo Icon */}
              <img 
                src="/logo-icon.png" 
                alt="Resto Logo" 
                className="w-16 h-16 object-contain" 
              />
            </div>
          </div>

          {/* ── Brand name ───────────────────────────────────────── */}
          <div style={{ textAlign:"center" }}>
            <p
              className="font-heading"
              style={{
                fontSize:      28,
                fontWeight:    800,
                letterSpacing: "0.18em",
                color:         "#0D031B", // Dark text for light mode
                textTransform: "uppercase",
                lineHeight:    1,
                margin:        0,
              }}
            >
              Resto
            </p>
            <p
              className="font-sans"
              style={{
                fontSize:      10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color:         "#5b4fa8", // Primary purple
                fontWeight:    700,
                marginTop:     4,
                animation:     "text-shimmer 2.5s ease-in-out infinite",
              }}
            >
              Grande Cuisine
            </p>
          </div>

          {/* ── Shimmer divider ──────────────────────────────────── */}
          <div
            style={{
              width:      "100%",
              height:     1,
              background: "linear-gradient(90deg, transparent, rgba(91,79,168,.15), transparent)",
              animation:  "shimmer-light 2s ease-in-out infinite",
            }}
          />

          {/* ── Status text ──────────────────────────────────────── */}
          <p
            className="font-sans"
            style={{
              fontSize:   14,
              fontWeight: 600,
              color:      "#736C83", // Gray for light mode
              letterSpacing:"0.04em",
              minHeight:  20,
              textAlign:  "center",
              opacity:    visible ? 1 : 0,
              transition: "opacity .2s ease",
              animation:  "text-shimmer 1.8s ease-in-out infinite",
            }}
          >
            {statuses[step]}
          </p>

          {/* ── Progress bar ─────────────────────────────────────── */}
          <div className="font-sans" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, width:"100%" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:220 }}>
              <span style={{ fontSize:12, color:"#736C83", letterSpacing:"0.08em", fontWeight: 700, textTransform:"uppercase" }}>Loading</span>
              <span
                style={{
                  fontSize:   14,
                  fontWeight: 700,
                  color:      "#0D031B", // Dark text
                  fontVariantNumeric:"tabular-nums",
                  transition: "opacity .3s ease",
                  opacity:    visible ? 1 : 0,
                }}
              >
                {pct}%
              </span>
            </div>

            <div
              style={{
                width:        220,
                height:       6, // slightly taller for light mode
                borderRadius: 99,
                background:   "rgba(13,3,27,.06)", // subtle dark track
                overflow:     "hidden",
                position:     "relative",
              }}
            >
              <div
                className="rl-progress-inner"
                style={{
                  height:       "100%",
                  borderRadius: 99,
                  background:   "linear-gradient(90deg, #5b4fa8, #8c7fa6)", // primary to light purple gradient
                  width:        `${pct}%`,
                  position:     "relative",
                  transition:   "width .6s cubic-bezier(.4,0,.2,1)",
                }}
              />
            </div>
          </div>

          {/* ── Pulsing dots ─────────────────────────────────────── */}
          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
            {[0,1,2].map((i) => (
              <div
                key={i}
                className="rl-dot"
                style={{
                  width:        5,
                  height:       5,
                  borderRadius: "50%",
                  background:   "#5b4fa8", // Primary purple
                  animation:    "fade-dots 1.4s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
