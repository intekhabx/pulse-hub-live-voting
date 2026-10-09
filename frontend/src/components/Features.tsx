
import { useContext } from "react";
import { DataContext } from "../Context/ContextApi";

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    color: "from-violet-500 to-fuchsia-500",
    glow: "shadow-violet-500/20",
    tag: "Real-time",
    title: "Live response tracking",
    desc: "Track responses as they arrive and monitor participation in real time. Your poll analytics stay up to date without manually refreshing the page.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 14l1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1L19 14z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    color: "from-cyan-500 to-blue-500",
    glow: "shadow-cyan-500/20",
    tag: "AI Assistant",
    title: "AI-assisted poll creation",
    desc: "Turn your ideas into structured poll questions and answer options with help from an AI assistant. Create polls more efficiently with less manual effort.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 12l2 2 4-4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    color: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/20",
    tag: "Access Control",
    title: "Flexible participation controls",
    desc: "Choose between anonymous participation and authenticated users. Configure poll access and expiry settings to match your feedback requirements.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 3v18h18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="7" y="11" width="3" height="6" rx="1" fill="currentColor" />
        <rect x="12" y="7" width="3" height="10" rx="1" fill="currentColor" />
        <rect x="17" y="4" width="3" height="13" rx="1" fill="currentColor" />
      </svg>
    ),
    color: "from-amber-500 to-orange-500",
    glow: "shadow-amber-500/20",
    tag: "Pro & Premium",
    title: "Analytics & CSV export",
    desc: "Explore response distributions, compare answer options, and understand participation with detailed analytics. Export poll responses to CSV for reporting and further analysis with Pro and Premium plans.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 8v4l3 3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    color: "from-rose-500 to-pink-500",
    glow: "shadow-rose-500/20",
    tag: "Automation",
    title: "Smart poll expiry",
    desc: "Set a closing date and time for your polls. Automatically close participation when a poll expires and review the collected results.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="3"
          width="7"
          height="7"
          rx="1"
          stroke="currentColor"
          strokeWidth="2"
        />
        <rect
          x="14"
          y="3"
          width="7"
          height="7"
          rx="1"
          stroke="currentColor"
          strokeWidth="2"
        />
        <rect
          x="3"
          y="14"
          width="7"
          height="7"
          rx="1"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M14 14h3v3h-3zM20 14v2M17 20h4M20 18v3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    color: "from-indigo-500 to-violet-500",
    glow: "shadow-indigo-500/20",
    tag: "Link + QR",
    title: "Share polls anywhere",
    desc: "Share polls through unique links or QR codes. Let your audience access polls from social media, messages, email, or printed materials with ease.",
  },
];

export default function Features() {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("Features must be used within ContextApiProvider");
  }

  const { dark } = context;

  return (
    <section
      id="features"
      className={`relative overflow-hidden px-6 py-24 ${
        dark ? "bg-[#0d0d1a]" : "bg-white"
      }`}
    >
      {/* Background accent */}
      <div className="absolute left-1/2 top-0 h-px w-[600px] max-w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <span
            className={`mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold ${
              dark
                ? "border-violet-500/30 bg-violet-500/10 text-violet-300"
                : "border-violet-200 bg-violet-50 text-violet-700"
            }`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Everything you need to run better polls
          </span>

          <h2
            className={`text-4xl font-black leading-tight tracking-tight sm:text-5xl ${
              dark ? "text-white" : "text-gray-950"
            }`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Smarter Polls. {" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Better Decisions.
            </span>
          </h2>

          <p
            className={`mx-auto mt-5 max-w-2xl text-base leading-relaxed sm:text-lg ${
              dark ? "text-gray-400" : "text-gray-500"
            }`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Create polls with AI assistance, share them effortlessly, and
            turn audience responses into meaningful insights, all in one
            place.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon, color, glow, tag, title, desc }) => (
            <div
              key={title}
              className={`group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                dark
                  ? "border-white/[0.06] bg-[#13131f] hover:border-white/10"
                  : "border-gray-100 bg-[#fafafa] hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100"
              }`}
            >
              {/* Icon and tag */}
              <div className="mb-5 flex items-start justify-between gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-lg ${glow} transition-transform duration-300 group-hover:scale-110`}
                >
                  {icon}
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${
                    dark
                      ? "bg-white/5 text-gray-400"
                      : "bg-gray-100 text-gray-500"
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {tag}
                </span>
              </div>

              <h3
                className={`mb-2 text-base font-bold ${
                  dark ? "text-white" : "text-gray-900"
                }`}
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {title}
              </h3>

              <p
                className={`text-sm leading-relaxed ${
                  dark ? "text-gray-400" : "text-gray-500"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {desc}
              </p>

              {/* Subtle hover accent */}
              <div
                className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${color} opacity-0 transition-opacity duration-500 group-hover:opacity-[0.035]`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}