import { useContext } from "react";
import { DataContext } from "../Context/ContextApi";



const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "from-violet-500 to-fuchsia-500",
    glow: "shadow-violet-500/20",
    tag: "Real-time",
    title: "Live response tracking",
    desc: "Watch responses pour in as they happen. Your analytics update the instant someone submits — no page refreshes, no waiting.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
        <path d="M14 17.5h7M17.5 14v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    color: "from-cyan-500 to-blue-500",
    glow: "shadow-cyan-500/20",
    tag: "Builder",
    title: "Drag & drop poll builder",
    desc: "Create multi-question polls in minutes. Add options, set mandatory fields, configure anonymous mode — all from one intuitive interface.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/20",
    tag: "Security",
    title: "Anonymous or authenticated",
    desc: "Choose who can respond. Lock polls to authenticated users or open them to everyone — with full control over expiry and access.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "from-amber-500 to-orange-500",
    glow: "shadow-amber-500/20",
    tag: "Analytics",
    title: "Rich analytics dashboard",
    desc: "Visualise responses with clean bar charts, option breakdowns, and participation stats — ready to publish or keep private.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "from-rose-500 to-pink-500",
    glow: "shadow-rose-500/20",
    tag: "Expiry",
    title: "Smart poll expiry",
    desc: "Set a date and time for your poll to close automatically. After expiry, responses are locked and results can be published instantly.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "from-indigo-500 to-violet-500",
    glow: "shadow-indigo-500/20",
    tag: "Sharing",
    title: "One-link sharing",
    desc: "Every poll gets a unique shareable link. Share it anywhere — social, email, Slack — and let respondents open it in seconds, no install needed.",
  },
];

export default function Features() {

  const context = useContext(DataContext);
    if(!context){
      throw new Error("dark must be used within ContextApiProvider");
    }
    const {dark} = context;


  return (
    <section
      id="features"
      className={`relative py-24 px-6 overflow-hidden ${dark ? "bg-[#0d0d1a]" : "bg-white"}`}
    >
      {/* Background accent */}
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
            Everything you need
          </span>
          <h2
            className={`text-4xl sm:text-5xl font-black tracking-tight leading-tight ${dark ? "text-white" : "text-gray-950"}`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Built for speed.
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Designed to impress.
            </span>
          </h2>
          <p
            className={`mt-4 text-lg max-w-xl mx-auto ${dark ? "text-gray-400" : "text-gray-500"}`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Every feature in PulseHub is crafted to remove friction from the
            feedback loop — for creators and respondents alike.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon, color, glow, tag, title, desc }) => (
            <div
              key={title}
              className={`group relative rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 cursor-default ${
                dark
                  ? "bg-[#13131f] border-white/[0.06] hover:border-white/10"
                  : "bg-[#fafafa] border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100"
              }`}
            >
              {/* Top row: icon + tag */}
              <div className="flex items-start justify-between mb-5">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg ${glow} transition-transform duration-300 group-hover:scale-110`}
                >
                  {icon}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                    dark ? "bg-white/5 text-gray-500" : "bg-gray-100 text-gray-400"
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {tag}
                </span>
              </div>

              <h3
                className={`text-base font-bold mb-2 ${dark ? "text-white" : "text-gray-900"}`}
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {title}
              </h3>
              <p
                className={`text-sm leading-relaxed ${dark ? "text-gray-500" : "text-gray-500"}`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {desc}
              </p>

              {/* Hover glow */}
              <div
                className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br ${color} opacity-0 group-hover:opacity-[0.03]`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}