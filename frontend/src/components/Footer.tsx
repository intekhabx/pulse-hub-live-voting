import { useContext } from "react";
import { DataContext } from "../Context/ContextApi";


const LINKS = {
  Product: ["Features", "How it Works", "Pricing", "Changelog", "Roadmap"],
  Resources: ["Documentation", "API Reference", "Guides", "Blog", "Status"],
  Company: ["About", "Careers", "Press", "Privacy Policy", "Terms of Service"],
  Community: ["Discord", "Twitter / X", "GitHub", "Newsletter", "Support"],
};

const SOCIALS = [
  {
    label: "Twitter",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "Discord",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export default function Footer() {

  const context = useContext(DataContext);
    if(!context){
      throw new Error("dark must be used within ContextApiProvider");
    }
    const {dark} = context;


  const year = new Date().getFullYear();

  return (
    <footer
      className={`relative pt-20 pb-8 px-6 overflow-hidden border-t ${
        dark
          ? "bg-[#080810] border-white/[0.06]"
          : "bg-[#fafafa] border-gray-100"
      }`}
    >
      {/* Top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-violet-600/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto">
        {/* ── Top: Brand + Links ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group mb-5 w-fit">
              <div className="relative w-9 h-9 flex-shrink-0">
                <div className="absolute inset-0 rounded-[10px] bg-gradient-to-br from-violet-500 to-fuchsia-600 opacity-30 blur-md group-hover:opacity-60 transition-opacity duration-300" />
                <div className="relative w-9 h-9 rounded-[10px] bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 12h3l3-8 4 16 3-8 3 4h2"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <span
                className={`text-xl font-black tracking-tight ${dark ? "text-white" : "text-gray-900"}`}
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Pulse<span className="text-violet-500">Hub</span>
              </span>
            </a>

            <p
              className={`text-sm leading-relaxed mb-6 ${dark ? "text-gray-500" : "text-gray-400"}`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Real-time polling and feedback collection, built for teams who
              move fast.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    dark
                      ? "bg-white/5 text-gray-500 hover:bg-white/10 hover:text-violet-400 border border-white/5"
                      : "bg-gray-100 text-gray-400 hover:bg-violet-50 hover:text-violet-600 border border-gray-200"
                  }`}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {Object.entries(LINKS).map(([category, links]) => (
              <div key={category}>
                <h4
                  className={`text-xs font-bold uppercase tracking-widest mb-4 ${
                    dark ? "text-gray-400" : "text-gray-500"
                  }`}
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {category}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className={`text-sm transition-colors duration-150 ${
                          dark
                            ? "text-gray-600 hover:text-gray-300"
                            : "text-gray-400 hover:text-gray-700"
                        }`}
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Newsletter strip ── */}
        <div
          className={`rounded-2xl p-6 border mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 ${
            dark
              ? "bg-[#13131f] border-white/[0.06]"
              : "bg-white border-gray-100 shadow-sm"
          }`}
        >
          <div>
            <p
              className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`}
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Stay in the loop
            </p>
            <p
              className={`text-xs mt-0.5 ${dark ? "text-gray-500" : "text-gray-400"}`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Product updates, tips and behind-the-scenes — no spam, ever.
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="you@example.com"
              className={`flex-1 sm:w-56 px-4 py-2.5 rounded-xl text-sm border outline-none transition-all duration-200 ${
                dark
                  ? "bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-violet-500/50 focus:bg-white/8"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-400 focus:bg-white"
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
            <button
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/20 transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className={`pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
            dark ? "border-white/[0.06]" : "border-gray-100"
          }`}
        >
          <p
            className={`text-xs ${dark ? "text-gray-600" : "text-gray-400"}`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            © {year} PulseHub. All rights reserved.
          </p>

          <div className="flex items-center gap-1">
            <span className={`text-xs ${dark ? "text-gray-600" : "text-gray-400"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Made with
            </span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#f43f5e" className="mx-1">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            <span className={`text-xs ${dark ? "text-gray-600" : "text-gray-400"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
              by intekhabx
            </span>
          </div>

          <div className="flex items-center gap-4">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                className={`text-xs transition-colors ${
                  dark
                    ? "text-gray-600 hover:text-gray-400"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}