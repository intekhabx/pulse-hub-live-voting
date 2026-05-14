import { useContext, useEffect, useRef } from "react";
import { DataContext } from "../Context/ContextApi";


const STATS = [
  { value: "50K+", label: "Active Polls" },
  { value: "2M+", label: "Responses" },
  { value: "99.9%", label: "Uptime" },
  { value: "180+", label: "Countries" },
];

export default function Hero() {

  const context = useContext(DataContext);
  if(!context){
    throw new Error("dark must be used within ContextApiProvider");
  }
  const {dark} = context;


  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!orbRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 40;
      const y = (clientY / innerHeight - 0.5) * 40;
      orbRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      id="hero"
      className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16 ${
        dark ? "bg-[#0a0a12]" : "bg-[#f5f4ff]"
      }`}
    >
      {/* ── Background orbs / mesh ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          ref={orbRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] transition-transform duration-700 ease-out"
        >
          <div className="absolute inset-0 rounded-full bg-violet-600/20 blur-[120px]" />
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-fuchsia-500/15 blur-[80px]" />
          <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-cyan-500/10 blur-[60px]" />
        </div>
        {/* Grid dots */}
        <svg
          className={`absolute inset-0 w-full h-full ${dark ? "opacity-[0.04]" : "opacity-[0.08]"}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill={dark ? "white" : "black"} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* ── Badge ── */}
      <div className="relative z-10 mb-6 animate-[fadeInUp_0.6s_ease_forwards]">
        <span
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border ${
            dark
              ? "bg-violet-500/10 border-violet-500/30 text-violet-300"
              : "bg-violet-50 border-violet-200 text-violet-700"
          }`}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          Real-time polling, reinvented
        </span>
      </div>

      {/* ── Headline ── */}
      <h1
        className={`relative z-10 text-center text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight max-w-4xl animate-[fadeInUp_0.7s_ease_0.1s_forwards] opacity-0 ${
          dark ? "text-white" : "text-gray-950"
        }`}
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        Collect feedback
        <span className="block relative">
          <span className="relative">
            at the speed of
            <span className="relative ml-3 inline-block">
              <span className="relative z-10 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                thought
              </span>
              <span className="absolute bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" />
            </span>
          </span>
        </span>
      </h1>

      {/* ── Sub ── */}
      <p
        className={`relative z-10 mt-6 text-center text-lg sm:text-xl max-w-2xl leading-relaxed animate-[fadeInUp_0.7s_ease_0.2s_forwards] opacity-0 ${
          dark ? "text-gray-400" : "text-gray-500"
        }`}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        PulseHub lets you build beautiful polls, share them instantly, and watch
        responses roll in — all with live analytics and zero friction.
      </p>

      {/* ── CTAs ── */}
      <div className="relative z-10 mt-10 flex flex-col sm:flex-row items-center gap-4 animate-[fadeInUp_0.7s_ease_0.3s_forwards] opacity-0">
        <a
          href="#getstarted"
          className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Start for free
          <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-200">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </a>
        <a
          href="#how-it-works"
          className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-base font-semibold transition-all duration-200 border ${
            dark
              ? "text-gray-300 border-white/10 hover:bg-white/5 hover:text-white"
              : "text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
          }`}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
          </svg>
          See how it works
        </a>
      </div>

      {/* ── Mock Poll Card ── */}
      <div className="relative z-10 mt-16 w-full max-w-sm animate-[fadeInUp_0.8s_ease_0.4s_forwards] opacity-0">
        <div
          className={`rounded-2xl p-6 border shadow-2xl ${
            dark
              ? "bg-[#13131f] border-white/10 shadow-black/60"
              : "bg-white border-gray-200 shadow-gray-200/80"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs font-semibold uppercase tracking-widest ${dark ? "text-violet-400" : "text-violet-600"}`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Live Poll
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>128 responses</span>
            </span>
          </div>
          <p className={`text-sm font-semibold mb-4 ${dark ? "text-white" : "text-gray-900"}`}
            style={{ fontFamily: "'Syne', sans-serif" }}>
            What's your preferred way to collect feedback?
          </p>
          {[
            { label: "Polls & surveys", pct: 62 },
            { label: "One-on-one interviews", pct: 24 },
            { label: "Focus groups", pct: 14 },
          ].map(({ label, pct }) => (
            <div key={label} className="mb-3">
              <div className="flex justify-between mb-1">
                <span className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
                <span className={`text-xs font-bold ${dark ? "text-gray-300" : "text-gray-700"}`}>{pct}%</span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${dark ? "bg-white/5" : "bg-gray-100"}`}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        {/* Floating badge */}
        <div className={`absolute -top-4 -right-4 px-3 py-1.5 rounded-full text-xs font-bold border shadow-lg ${
          dark ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-700"
        }`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
          ↑ 3 new votes
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="relative z-10 mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-12 animate-[fadeInUp_0.8s_ease_0.5s_forwards] opacity-0">
        {STATS.map(({ value, label }) => (
          <div key={label} className="text-center">
            <div
              className={`text-3xl font-black bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent`}
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {value}
            </div>
            <div className={`text-xs mt-1 ${dark ? "text-gray-500" : "text-gray-400"}`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}