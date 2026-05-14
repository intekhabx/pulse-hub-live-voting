import { useContext } from "react";
import { DataContext } from "../Context/ContextApi";


const STEPS = [
  {
    number: "01",
    color: "from-violet-500 to-fuchsia-500",
    glow: "shadow-violet-500/30",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    title: "Create your poll",
    desc: "Sign in to PulseHub and use the drag-and-drop builder to craft your questions. Add options, mark mandatory fields, set anonymous mode, and choose an expiry window.",
    visual: (dark: boolean) => (
      <div className={`rounded-xl p-4 border text-xs ${dark ? "bg-[#0f0f1c] border-white/10" : "bg-white border-gray-200"}`}>
        <div className={`font-semibold mb-3 ${dark ? "text-gray-200" : "text-gray-800"}`} style={{ fontFamily: "'Syne', sans-serif" }}>
          New Poll
        </div>
        {["Q1: Preferred stack?", "Q2: Team size?", "Q3: Biggest pain point?"].map((q, i) => (
          <div key={q} className={`flex items-center gap-2 py-1.5 ${i < 2 ? `border-b ${dark ? "border-white/5" : "border-gray-100"}` : ""}`}>
            <span className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">{i + 1}</span>
            <span className={`${dark ? "text-gray-400" : "text-gray-500"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>{q}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    number: "02",
    color: "from-cyan-500 to-blue-500",
    glow: "shadow-cyan-500/30",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    title: "Share the link",
    desc: "Copy your unique poll link and share it anywhere — Slack, email, social media, or embed it. Respondents can open it instantly with no account required (in anonymous mode).",
    visual: (dark: boolean) => (
      <div className={`rounded-xl p-4 border ${dark ? "bg-[#0f0f1c] border-white/10" : "bg-white border-gray-200"}`}>
        <div className={`text-[10px] mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>Your poll link</div>
        <div className={`flex items-center gap-2 rounded-lg px-3 py-2 border ${dark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-cyan-400 flex-shrink-0">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={`text-[11px] flex-1 truncate ${dark ? "text-gray-300" : "text-gray-600"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
            pulsehub.app/p/dev-survey-24
          </span>
          <button className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex-shrink-0" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Copy
          </button>
        </div>
        <div className="mt-3 flex gap-2">
          {["Slack", "Email", "Twitter"].map((p) => (
            <span key={p} className={`text-[10px] px-2 py-1 rounded-md border font-medium ${dark ? "bg-white/5 border-white/10 text-gray-400" : "bg-gray-50 border-gray-200 text-gray-500"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>{p}</span>
          ))}
        </div>
      </div>
    ),
  },
  {
    number: "03",
    color: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/30",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    title: "Collect responses",
    desc: "Respondents open the link, answer your questions, and submit in seconds. Mandatory validation and expiry enforcement happen automatically — you just watch the data come in.",
    visual: (dark: boolean) => (
      <div className={`rounded-xl p-4 border ${dark ? "bg-[#0f0f1c] border-white/10" : "bg-white border-gray-200"}`}>
        <div className={`text-[11px] font-semibold mb-3 ${dark ? "text-white" : "text-gray-800"}`} style={{ fontFamily: "'Syne', sans-serif" }}>Preferred stack?</div>
        {[
          { opt: "React + Node", pct: 58, active: true },
          { opt: "Vue + Laravel", pct: 28, active: false },
          { opt: "Angular + .NET", pct: 14, active: false },
        ].map(({ opt, pct, active }) => (
          <div key={opt} className={`flex items-center gap-2 mb-2 p-2 rounded-lg border transition-colors ${active ? "border-emerald-500/40 bg-emerald-500/10" : dark ? "border-white/5 bg-transparent" : "border-gray-100 bg-gray-50"}`}>
            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 ${active ? "border-emerald-400 bg-emerald-500" : dark ? "border-gray-600" : "border-gray-300"}`}>
              {active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <span className={`text-[11px] flex-1 ${dark ? "text-gray-400" : "text-gray-600"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>{opt}</span>
            <span className={`text-[10px] font-bold ${active ? "text-emerald-400" : dark ? "text-gray-600" : "text-gray-400"}`}>{pct}%</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    number: "04",
    color: "from-amber-500 to-orange-500",
    glow: "shadow-amber-500/30",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    title: "Publish your results",
    desc: "Once the poll closes, dive into the analytics dashboard. When you're satisfied, hit Publish — and your results page goes live at the same link, visible to anyone.",
    visual: (dark: boolean) => (
      <div className={`rounded-xl p-4 border ${dark ? "bg-[#0f0f1c] border-white/10" : "bg-white border-gray-200"}`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-[11px] font-semibold ${dark ? "text-white" : "text-gray-800"}`} style={{ fontFamily: "'Syne', sans-serif" }}>Poll Analytics</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${dark ? "bg-amber-500/20 text-amber-300" : "bg-amber-50 text-amber-700"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>128 responses</span>
        </div>
        {[
          { label: "React + Node", pct: 58, w: "58%" },
          { label: "Vue + Laravel", pct: 28, w: "28%" },
          { label: "Angular + .NET", pct: 14, w: "14%" },
        ].map(({ label, pct, w }) => (
          <div key={label} className="mb-2">
            <div className="flex justify-between mb-0.5">
              <span className={`text-[10px] ${dark ? "text-gray-500" : "text-gray-400"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
              <span className={`text-[10px] font-bold ${dark ? "text-gray-300" : "text-gray-700"}`}>{pct}%</span>
            </div>
            <div className={`h-1.5 rounded-full ${dark ? "bg-white/5" : "bg-gray-100"}`}>
              <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: w }} />
            </div>
          </div>
        ))}
        <button className="mt-3 w-full py-1.5 rounded-lg text-[11px] font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 transition-opacity" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Publish Results →
        </button>
      </div>
    ),
  },
];

export default function HowItWorks() {

  const context = useContext(DataContext);
    if(!context){
      throw new Error("dark must be used within ContextApiProvider");
    }
  const {dark} = context;

  return (
    <section
      id="how-it-works"
      className={`relative py-24 px-6 overflow-hidden ${dark ? "bg-[#0a0a12]" : "bg-[#f9f8ff]"}`}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border mb-5 ${
              dark
                ? "bg-violet-500/10 border-violet-500/30 text-violet-300"
                : "bg-violet-50 border-violet-200 text-violet-700"
            }`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Simple process
          </span>
          <h2
            className={`text-4xl sm:text-5xl font-black tracking-tight leading-tight ${dark ? "text-white" : "text-gray-950"}`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            From idea to insight
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              in four steps.
            </span>
          </h2>
          <p
            className={`mt-4 text-lg max-w-xl mx-auto ${dark ? "text-gray-400" : "text-gray-500"}`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            No technical setup. No integrations needed. PulseHub handles
            everything end-to-end.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {STEPS.map(({ number, color, glow, bg, border, title, desc, visual }) => (
            <div
              key={number}
              className={`group relative rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 ${
                dark
                  ? "bg-[#13131f] border-white/[0.06] hover:border-white/10"
                  : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100"
              }`}
            >
              <div className="flex items-start gap-4 mb-5">
                {/* Step number */}
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-2xl ${bg} border ${border} flex items-center justify-center`}
                >
                  <span
                    className={`text-base font-black bg-gradient-to-r ${color} bg-clip-text text-transparent`}
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {number}
                  </span>
                </div>
                <div>
                  <h3
                    className={`text-lg font-bold leading-snug ${dark ? "text-white" : "text-gray-900"}`}
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {title}
                  </h3>
                  <p
                    className={`mt-1 text-sm leading-relaxed ${dark ? "text-gray-500" : "text-gray-500"}`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {desc}
                  </p>
                </div>
              </div>
              {/* Mini visual */}
              <div className="mt-2">{visual(dark)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}