import { useState, useEffect, useRef } from "react";

/* ─── TYPES ─────────────────────────────────────── */
type Page = "home" | "login" | "register";

/* ─── NAVBAR ─────────────────────────────────────── */
function Navbar({ dark, toggleTheme, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const el = document.getElementById("preview-scroll");
    if (!el) return;
    const fn = () => setScrolled(el.scrollTop > 20);
    el.addEventListener("scroll", fn);
    return () => el.removeEventListener("scroll", fn);
  }, []);
  const links = ["Features", "How it Works", "Pricing"];
  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? dark ? "bg-[#0a0a12]/95 backdrop-blur-xl border-b border-white/[0.06] shadow-xl shadow-black/40" : "bg-white/95 backdrop-blur-xl border-b border-black/[0.06] shadow-lg" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => setPage("home")} className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-[9px] bg-gradient-to-br from-violet-500 to-fuchsia-600 opacity-25 blur-md group-hover:opacity-50 transition-opacity" />
            <div className="relative w-8 h-8 rounded-[9px] bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-md shadow-violet-500/30">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M3 12h3l3-8 4 16 3-8 3 4h2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
          <span className={`text-lg font-black tracking-tight ${dark ? "text-white" : "text-gray-900"}`} style={{ fontFamily: "'Syne',sans-serif" }}>
            Pulse<span className="text-violet-500">Hub</span>
          </span>
        </button>
        {/* Links */}
        <div className="hidden sm:flex items-center gap-6">
          {links.map(l => (
            <a key={l} href="#" className={`text-sm font-medium hover:text-violet-500 transition-colors ${dark ? "text-gray-400" : "text-gray-500"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>{l}</a>
          ))}
        </div>
        {/* Actions */}
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all border ${dark ? "bg-white/5 hover:bg-white/10 text-gray-400 border-white/10" : "bg-black/5 hover:bg-black/10 text-gray-500 border-black/10"}`}>
            {dark ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </button>
          <button onClick={() => setPage("login")} className={`hidden sm:flex px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${dark ? "text-gray-300 hover:text-white border-white/10 hover:bg-white/5" : "text-gray-600 border-gray-200 hover:bg-gray-50"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>Sign In</button>
          <button onClick={() => setPage("register")} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 transition-all hover:-translate-y-0.5" style={{ fontFamily: "'DM Sans',sans-serif" }}>
            Get Started
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ─── HERO ─────────────────────────────────────── */
function Hero({ dark, setPage }) {
  return (
    <section className={`relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-5 py-20 ${dark ? "bg-[#0a0a12]" : "bg-[#f5f4ff]"}`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
          <div className="absolute inset-0 rounded-full bg-violet-600/20 blur-[100px]" />
          <div className="absolute top-10 left-10 w-56 h-56 rounded-full bg-fuchsia-500/15 blur-[70px]" />
        </div>
        <svg className={`absolute inset-0 w-full h-full ${dark ? "opacity-[0.04]" : "opacity-[0.07]"}`}>
          <defs><pattern id="h-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill={dark?"white":"black"} /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#h-dots)" />
        </svg>
      </div>
      <div className="relative z-10 text-center max-w-3xl">
        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border mb-6 ${dark ? "bg-violet-500/10 border-violet-500/30 text-violet-300" : "bg-violet-50 border-violet-200 text-violet-700"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" /> Real-time polling, reinvented
        </span>
        <h1 className={`text-5xl sm:text-6xl font-black leading-[1.06] tracking-tight mb-6 ${dark ? "text-white" : "text-gray-950"}`} style={{ fontFamily: "'Syne',sans-serif" }}>
          Collect feedback<br />
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">at the speed of thought</span>
        </h1>
        <p className={`text-lg max-w-xl mx-auto leading-relaxed mb-10 ${dark ? "text-gray-400" : "text-gray-500"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>
          PulseHub lets you build beautiful polls, share them instantly, and watch responses roll in — with live analytics and zero friction.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={() => setPage("register")} className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-xl shadow-violet-500/30 transition-all hover:-translate-y-1" style={{ fontFamily: "'DM Sans',sans-serif" }}>
            Start for free
            <span className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </button>
          <button className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-base font-semibold border transition-all ${dark ? "text-gray-300 border-white/10 hover:bg-white/5" : "text-gray-700 border-gray-200 hover:bg-gray-50"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M10 8l6 4-6 4V8z" fill="currentColor"/></svg>
            See how it works
          </button>
        </div>
        {/* Mock card */}
        <div className="mt-14 max-w-xs mx-auto">
          <div className={`rounded-2xl p-5 border shadow-2xl text-left ${dark ? "bg-[#13131f] border-white/10" : "bg-white border-gray-200"}`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-semibold uppercase tracking-widest ${dark ? "text-violet-400" : "text-violet-600"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>Live Poll</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/><span className={`text-xs ${dark?"text-gray-500":"text-gray-400"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>128 responses</span></span>
            </div>
            <p className={`text-sm font-semibold mb-3 ${dark?"text-white":"text-gray-900"}`} style={{ fontFamily: "'Syne',sans-serif" }}>Preferred feedback method?</p>
            {[{l:"Polls & surveys",p:62},{l:"Interviews",p:24},{l:"Focus groups",p:14}].map(({l,p})=>(
              <div key={l} className="mb-2">
                <div className="flex justify-between mb-0.5">
                  <span className={`text-xs ${dark?"text-gray-400":"text-gray-500"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>{l}</span>
                  <span className={`text-xs font-bold ${dark?"text-gray-300":"text-gray-700"}`}>{p}%</span>
                </div>
                <div className={`h-1.5 rounded-full ${dark?"bg-white/5":"bg-gray-100"}`}>
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" style={{width:`${p}%`}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Stats */}
        <div className="mt-12 grid grid-cols-4 gap-6">
          {[["50K+","Polls"],["2M+","Responses"],["99.9%","Uptime"],["180+","Countries"]].map(([v,l])=>(
            <div key={l} className="text-center">
              <div className="text-2xl font-black bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent" style={{ fontFamily: "'Syne',sans-serif" }}>{v}</div>
              <div className={`text-xs mt-0.5 ${dark?"text-gray-600":"text-gray-400"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FEATURES ─────────────────────────────────────── */
function Features({ dark }) {
  const feats = [
    { icon:"⚡", color:"from-violet-500 to-fuchsia-500", tag:"Real-time", title:"Live response tracking", desc:"Watch responses arrive instantly with Socket.io-powered live updates — no page refresh needed." },
    { icon:"🧱", color:"from-cyan-500 to-blue-500", tag:"Builder", title:"Drag & drop builder", desc:"Multi-question polls in minutes. Set mandatory fields, options, anonymous mode — from one clean UI." },
    { icon:"🔒", color:"from-emerald-500 to-teal-500", tag:"Security", title:"Anonymous or authenticated", desc:"Full control over who can respond — with smart expiry and access rules built in." },
    { icon:"📊", color:"from-amber-500 to-orange-500", tag:"Analytics", title:"Rich analytics dashboard", desc:"Bar charts, option breakdowns, participation stats — ready to publish or keep private." },
    { icon:"⏱️", color:"from-rose-500 to-pink-500", tag:"Expiry", title:"Smart poll expiry", desc:"Set a close date/time and polls lock automatically. Results publish instantly after." },
    { icon:"🔗", color:"from-indigo-500 to-violet-500", tag:"Sharing", title:"One-link sharing", desc:"A unique shareable link for every poll. Open in seconds anywhere — no install needed." },
  ];
  return (
    <section className={`py-20 px-5 ${dark?"bg-[#0d0d1a]":"bg-white"}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border mb-4 ${dark?"bg-violet-500/10 border-violet-500/30 text-violet-300":"bg-violet-50 border-violet-200 text-violet-700"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>Everything you need</span>
          <h2 className={`text-4xl font-black tracking-tight ${dark?"text-white":"text-gray-950"}`} style={{ fontFamily: "'Syne',sans-serif" }}>
            Built for speed.<br /><span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Designed to impress.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {feats.map(({icon,color,tag,title,desc})=>(
            <div key={title} className={`group rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 ${dark?"bg-[#13131f] border-white/[0.06] hover:border-white/10":"bg-[#fafafa] border-gray-100 hover:border-gray-200 hover:shadow-xl"}`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform`}>{icon}</div>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${dark?"bg-white/5 text-gray-500":"bg-gray-100 text-gray-400"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>{tag}</span>
              </div>
              <h3 className={`text-sm font-bold mb-1.5 ${dark?"text-white":"text-gray-900"}`} style={{ fontFamily: "'Syne',sans-serif" }}>{title}</h3>
              <p className={`text-xs leading-relaxed ${dark?"text-gray-500":"text-gray-500"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── HOW IT WORKS ─────────────────────────────────────── */
function HowItWorks({ dark }) {
  const steps = [
    { n:"01", color:"from-violet-500 to-fuchsia-500", bg:"bg-violet-500/10", title:"Create your poll", desc:"Use the poll builder to add questions, set options, mark mandatory fields, and pick an expiry." },
    { n:"02", color:"from-cyan-500 to-blue-500", bg:"bg-cyan-500/10", title:"Share the link", desc:"Copy your unique poll URL and send it via Slack, email, or social. Works on any device." },
    { n:"03", color:"from-emerald-500 to-teal-500", bg:"bg-emerald-500/10", title:"Collect responses", desc:"Respondents answer in seconds. Validation and expiry enforcement happen automatically." },
    { n:"04", color:"from-amber-500 to-orange-500", bg:"bg-amber-500/10", title:"Publish results", desc:"Review your analytics dashboard then hit Publish — results go live at the same link." },
  ];
  return (
    <section className={`py-20 px-5 ${dark?"bg-[#0a0a12]":"bg-[#f9f8ff]"}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border mb-4 ${dark?"bg-violet-500/10 border-violet-500/30 text-violet-300":"bg-violet-50 border-violet-200 text-violet-700"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>Simple process</span>
          <h2 className={`text-4xl font-black tracking-tight ${dark?"text-white":"text-gray-950"}`} style={{ fontFamily: "'Syne',sans-serif" }}>
            From idea to insight<br /><span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">in four steps.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {steps.map(({n,color,bg,title,desc})=>(
            <div key={n} className={`rounded-2xl p-6 border transition-all hover:-translate-y-1 ${dark?"bg-[#13131f] border-white/[0.06]":"bg-white border-gray-100 hover:shadow-xl"}`}>
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-11 h-11 rounded-2xl ${bg} flex items-center justify-center`}>
                  <span className={`text-base font-black bg-gradient-to-r ${color} bg-clip-text text-transparent`} style={{ fontFamily: "'Syne',sans-serif" }}>{n}</span>
                </div>
                <div>
                  <h3 className={`text-base font-bold mb-1 ${dark?"text-white":"text-gray-900"}`} style={{ fontFamily: "'Syne',sans-serif" }}>{title}</h3>
                  <p className={`text-sm leading-relaxed ${dark?"text-gray-500":"text-gray-500"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─────────────────────────────────────── */
function Footer({ dark }) {
  const cols = {
    Product: ["Features","Pricing","Changelog","Roadmap"],
    Resources: ["Docs","API Ref","Guides","Blog"],
    Company: ["About","Careers","Privacy","Terms"],
  };
  return (
    <footer className={`pt-16 pb-8 px-5 border-t relative overflow-hidden ${dark?"bg-[#080810] border-white/[0.06]":"bg-[#fafafa] border-gray-100"}`}>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-violet-600/5 blur-[80px] rounded-full pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-md shadow-violet-500/30">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M3 12h3l3-8 4 16 3-8 3 4h2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span className={`text-lg font-black tracking-tight ${dark?"text-white":"text-gray-900"}`} style={{ fontFamily: "'Syne',sans-serif" }}>Pulse<span className="text-violet-500">Hub</span></span>
            </div>
            <p className={`text-xs leading-relaxed mb-4 ${dark?"text-gray-600":"text-gray-400"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>Real-time polling built for teams who move fast.</p>
            <div className="flex gap-1.5">
              {["𝕏","gh","in","dc"].map(s=>(
                <div key={s} className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold border transition-colors cursor-pointer ${dark?"bg-white/5 border-white/8 text-gray-500 hover:text-violet-400":"bg-gray-100 border-gray-200 text-gray-400 hover:text-violet-600"}`}>{s}</div>
              ))}
            </div>
          </div>
          {/* Link cols */}
          {Object.entries(cols).map(([cat,links])=>(
            <div key={cat}>
              <h4 className={`text-xs font-bold uppercase tracking-widest mb-4 ${dark?"text-gray-500":"text-gray-500"}`} style={{ fontFamily: "'Syne',sans-serif" }}>{cat}</h4>
              <ul className="space-y-2">
                {links.map(l=>(
                  <li key={l}><a href="#" className={`text-xs transition-colors ${dark?"text-gray-600 hover:text-gray-300":"text-gray-400 hover:text-gray-700"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Newsletter */}
        <div className={`rounded-2xl p-5 border mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${dark?"bg-[#13131f] border-white/[0.06]":"bg-white border-gray-100 shadow-sm"}`}>
          <div>
            <p className={`text-sm font-bold ${dark?"text-white":"text-gray-900"}`} style={{ fontFamily: "'Syne',sans-serif" }}>Stay in the loop</p>
            <p className={`text-xs mt-0.5 ${dark?"text-gray-500":"text-gray-400"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>Product updates — no spam, ever.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input type="email" placeholder="you@example.com" className={`flex-1 sm:w-48 px-3.5 py-2 rounded-xl text-xs border outline-none ${dark?"bg-white/5 border-white/10 text-white placeholder-gray-600":"bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"}`} style={{ fontFamily: "'DM Sans',sans-serif" }} />
            <button className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 whitespace-nowrap" style={{ fontFamily: "'DM Sans',sans-serif" }}>Subscribe</button>
          </div>
        </div>
        {/* Bottom bar */}
        <div className={`pt-5 border-t flex flex-col sm:flex-row items-center justify-between gap-2 ${dark?"border-white/[0.06]":"border-gray-100"}`}>
          <p className={`text-xs ${dark?"text-gray-700":"text-gray-400"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>© {new Date().getFullYear()} PulseHub. All rights reserved.</p>
          <p className={`text-xs flex items-center gap-1 ${dark?"text-gray-700":"text-gray-400"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>Built with <span className="text-rose-500">♥</span> for the community</p>
          <div className="flex gap-4">
            {["Privacy","Terms","Cookies"].map(i=>(
              <a key={i} href="#" className={`text-xs transition-colors ${dark?"text-gray-700 hover:text-gray-400":"text-gray-400 hover:text-gray-600"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>{i}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── LOGIN ─────────────────────────────────────── */
function Login({ dark, setPage }) {
  const [form, setForm] = useState({ email:"", password:"" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Min. 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = field => e => {
    setForm(p => ({ ...p, [field]: e.target.value }));
    setErrors(p => ({ ...p, [field]: undefined }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setSuccess(true);
  };

  const ib = `w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all border ${dark?"bg-white/[0.04] text-white placeholder-gray-600":"bg-gray-50 text-gray-900 placeholder-gray-400"}`;
  const in_ = dark ? "border-white/[0.08] focus:border-violet-500/50" : "border-gray-200 focus:border-violet-400 focus:bg-white";
  const ie = "border-rose-500/50";

  const ErrMsg = ({msg}) => msg ? <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1" style={{ fontFamily: "'DM Sans',sans-serif" }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>{msg}</p> : null;

  return (
    <div className={`min-h-screen flex flex-col ${dark?"bg-[#0a0a12]":"bg-[#f5f4ff]"}`}>
      {/* Back btn */}
      <div className="p-5">
        <button onClick={() => setPage("home")} className={`flex items-center gap-2 text-sm transition-colors ${dark?"text-gray-500 hover:text-white":"text-gray-400 hover:text-gray-900"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back to home
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-8 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px]"><div className="absolute inset-0 rounded-full bg-violet-600/15 blur-[80px]"/></div>
        </div>
        <div className={`relative z-10 w-full max-w-md rounded-2xl p-8 border shadow-2xl ${dark?"bg-[#11111c] border-white/[0.07] shadow-black/50":"bg-white border-gray-100"}`}>
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-11 h-11 mb-4">
              <div className="absolute inset-0 rounded-[12px] bg-gradient-to-br from-violet-500 to-fuchsia-600 opacity-25 blur-lg"/>
              <div className="relative w-11 h-11 rounded-[12px] bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 12h3l3-8 4 16 3-8 3 4h2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
            <h1 className={`text-2xl font-black tracking-tight ${dark?"text-white":"text-gray-900"}`} style={{ fontFamily: "'Syne',sans-serif" }}>Welcome back</h1>
            <p className={`text-sm mt-1 ${dark?"text-gray-500":"text-gray-400"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>Sign in to your <span className="text-violet-500 font-semibold">PulseHub</span> account</p>
          </div>

          {success ? (
            <div className={`rounded-xl p-5 text-center border ${dark?"bg-emerald-500/10 border-emerald-500/20":"bg-emerald-50 border-emerald-200"}`}>
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <p className={`font-bold text-sm ${dark?"text-emerald-300":"text-emerald-700"}`} style={{ fontFamily: "'Syne',sans-serif" }}>Login successful!</p>
              <p className={`text-xs mt-1 ${dark?"text-emerald-500":"text-emerald-600"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>Redirecting to your dashboard…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Email */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${dark?"text-gray-400":"text-gray-600"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>Email address</label>
                <div className="relative">
                  <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${errors.email?"text-rose-400":dark?"text-gray-600":"text-gray-400"}`}><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                  <input type="email" value={form.email} onChange={handleChange("email")} placeholder="you@example.com" className={`${ib} ${errors.email?ie:in_}`} style={{ fontFamily: "'DM Sans',sans-serif" }} />
                </div>
                <ErrMsg msg={errors.email} />
              </div>
              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`text-xs font-semibold ${dark?"text-gray-400":"text-gray-600"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>Password</label>
                  <a href="#" className="text-xs text-violet-500 hover:text-violet-400 font-medium" style={{ fontFamily: "'DM Sans',sans-serif" }}>Forgot?</a>
                </div>
                <div className="relative">
                  <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${errors.password?"text-rose-400":dark?"text-gray-600":"text-gray-400"}`}><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                  <input type={showPw?"text":"password"} value={form.password} onChange={handleChange("password")} placeholder="••••••••" className={`${ib} pr-11 ${errors.password?ie:in_}`} style={{ fontFamily: "'DM Sans',sans-serif" }} />
                  <button type="button" onClick={()=>setShowPw(s=>!s)} className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${dark?"text-gray-600 hover:text-gray-400":"text-gray-400 hover:text-gray-600"}`}>
                    {showPw?<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>:<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>}
                  </button>
                </div>
                <ErrMsg msg={errors.password} />
              </div>
              {/* Submit */}
              <button type="submit" disabled={loading} className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 flex items-center justify-center gap-2" style={{ fontFamily: "'DM Sans',sans-serif" }}>
                {loading?<><svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>Signing in…</>:<>Sign In <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg></>}
              </button>
            </form>
          )}

          <p className={`text-center text-sm mt-6 ${dark?"text-gray-600":"text-gray-400"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>
            Don't have an account?{" "}
            <button onClick={()=>setPage("register")} className="text-violet-500 hover:text-violet-400 font-semibold">Create one free</button>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── REGISTER ─────────────────────────────────────── */
function PasswordStrength({ password }) {
  const checks = [
    { label:"8+ chars", pass: password.length >= 8 },
    { label:"Uppercase", pass: /[A-Z]/.test(password) },
    { label:"Number", pass: /\d/.test(password) },
    { label:"Symbol", pass: /[^a-zA-Z0-9]/.test(password) },
  ];
  const score = checks.filter(c=>c.pass).length;
  const barColors = ["bg-rose-500","bg-orange-400","bg-amber-400","bg-emerald-500"];
  const labels = ["Weak","Fair","Good","Strong"];
  if (!password) return null;
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">{[0,1,2,3].map(i=><div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i<score?barColors[score-1]:"bg-gray-700/30"}`}/>)}</div>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
          {checks.map(({label,pass})=>(
            <span key={label} className={`text-[10px] flex items-center gap-0.5 ${pass?"text-emerald-400":"text-gray-600"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none">{pass?<path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>:<circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5"/>}</svg>{label}
            </span>
          ))}
        </div>
        {score>0&&<span className={`text-[10px] font-bold ${["text-rose-400","text-orange-400","text-amber-400","text-emerald-400"][score-1]}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>{labels[score-1]}</span>}
      </div>
    </div>
  );
}

function Register({ dark, setPage }) {
  const [form, setForm] = useState({ name:"", email:"", password:"", confirmPassword:"" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [showCp, setShowCp] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    else if (form.name.trim().length < 2) e.name = "Min. 2 characters";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Min. 8 characters";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = field => e => {
    setForm(p => ({ ...p, [field]: e.target.value }));
    setErrors(p => ({ ...p, [field]: undefined }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    setLoading(false);
    setSuccess(true);
  };

  const ib = `w-full pl-10 py-3 rounded-xl text-sm outline-none transition-all border ${dark?"bg-white/[0.04] text-white placeholder-gray-600":"bg-gray-50 text-gray-900 placeholder-gray-400"}`;
  const in_ = dark ? "border-white/[0.08] focus:border-violet-500/50" : "border-gray-200 focus:border-violet-400 focus:bg-white";
  const ie = "border-rose-500/50";

  const ErrMsg = ({msg}) => msg ? <p className="text-rose-400 text-xs mt-1 flex items-center gap-1" style={{ fontFamily: "'DM Sans',sans-serif" }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>{msg}</p> : null;

  return (
    <div className={`min-h-screen flex flex-col ${dark?"bg-[#0a0a12]":"bg-[#f5f4ff]"}`}>
      <div className="p-5">
        <button onClick={()=>setPage("home")} className={`flex items-center gap-2 text-sm transition-colors ${dark?"text-gray-500 hover:text-white":"text-gray-400 hover:text-gray-900"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back to home
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-6 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px]"><div className="absolute inset-0 rounded-full bg-fuchsia-600/12 blur-[80px]"/></div>
        </div>
        <div className={`relative z-10 w-full max-w-md rounded-2xl p-8 border shadow-2xl ${dark?"bg-[#11111c] border-white/[0.07] shadow-black/50":"bg-white border-gray-100"}`}>
          <div className="flex flex-col items-center mb-7">
            <div className="relative w-11 h-11 mb-4">
              <div className="absolute inset-0 rounded-[12px] bg-gradient-to-br from-violet-500 to-fuchsia-600 opacity-25 blur-lg"/>
              <div className="relative w-11 h-11 rounded-[12px] bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 12h3l3-8 4 16 3-8 3 4h2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
            <h1 className={`text-2xl font-black tracking-tight ${dark?"text-white":"text-gray-900"}`} style={{ fontFamily: "'Syne',sans-serif" }}>Create your account</h1>
            <p className={`text-sm mt-1 ${dark?"text-gray-500":"text-gray-400"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>Join <span className="text-violet-500 font-semibold">PulseHub</span> — free forever</p>
          </div>

          {success ? (
            <div className={`rounded-xl p-5 text-center border ${dark?"bg-emerald-500/10 border-emerald-500/20":"bg-emerald-50 border-emerald-200"}`}>
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/30">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <p className={`font-black text-base ${dark?"text-emerald-300":"text-emerald-700"}`} style={{ fontFamily: "'Syne',sans-serif" }}>Account created! 🎉</p>
              <p className={`text-sm mt-1 ${dark?"text-emerald-500":"text-emerald-600"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>Welcome, {form.name.split(" ")[0]}! Redirecting…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Name */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${dark?"text-gray-400":"text-gray-600"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>Full name</label>
                <div className="relative">
                  <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${errors.name?"text-rose-400":dark?"text-gray-600":"text-gray-400"}`}><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/></svg></span>
                  <input type="text" value={form.name} onChange={handleChange("name")} placeholder="Alex Johnson" className={`${ib} pr-4 ${errors.name?ie:in_}`} style={{ fontFamily: "'DM Sans',sans-serif" }}/>
                </div>
                <ErrMsg msg={errors.name}/>
              </div>
              {/* Email */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${dark?"text-gray-400":"text-gray-600"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>Email address</label>
                <div className="relative">
                  <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${errors.email?"text-rose-400":dark?"text-gray-600":"text-gray-400"}`}><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                  <input type="email" value={form.email} onChange={handleChange("email")} placeholder="you@example.com" className={`${ib} pr-4 ${errors.email?ie:in_}`} style={{ fontFamily: "'DM Sans',sans-serif" }}/>
                </div>
                <ErrMsg msg={errors.email}/>
              </div>
              {/* Password */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${dark?"text-gray-400":"text-gray-600"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>Password</label>
                <div className="relative">
                  <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${errors.password?"text-rose-400":dark?"text-gray-600":"text-gray-400"}`}><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                  <input type={showPw?"text":"password"} value={form.password} onChange={handleChange("password")} placeholder="Min. 8 characters" className={`${ib} pr-11 ${errors.password?ie:in_}`} style={{ fontFamily: "'DM Sans',sans-serif" }}/>
                  <button type="button" onClick={()=>setShowPw(s=>!s)} className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${dark?"text-gray-600 hover:text-gray-400":"text-gray-400 hover:text-gray-600"}`}>{showPw?<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>:<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>}</button>
                </div>
                <ErrMsg msg={errors.password}/>
                <PasswordStrength password={form.password}/>
              </div>
              {/* Confirm Password */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${dark?"text-gray-400":"text-gray-600"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>Confirm password</label>
                <div className="relative">
                  <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${errors.confirmPassword?"text-rose-400":form.confirmPassword&&form.password===form.confirmPassword?"text-emerald-400":dark?"text-gray-600":"text-gray-400"}`}><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                  <input type={showCp?"text":"password"} value={form.confirmPassword} onChange={handleChange("confirmPassword")} placeholder="Re-enter your password" className={`${ib} pr-11 ${errors.confirmPassword?ie:form.confirmPassword&&form.password===form.confirmPassword?dark?"border-emerald-500/40":"border-emerald-400":in_}`} style={{ fontFamily: "'DM Sans',sans-serif" }}/>
                  <button type="button" onClick={()=>setShowCp(s=>!s)} className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${dark?"text-gray-600 hover:text-gray-400":"text-gray-400 hover:text-gray-600"}`}>{showCp?<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>:<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>}</button>
                </div>
                {form.confirmPassword&&form.password===form.confirmPassword&&!errors.confirmPassword&&<p className="text-emerald-400 text-xs mt-1 flex items-center gap-1" style={{ fontFamily: "'DM Sans',sans-serif" }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>Passwords match</p>}
                <ErrMsg msg={errors.confirmPassword}/>
              </div>
              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer mt-1">
                <div onClick={()=>setAgreed(a=>!a)} className={`flex-shrink-0 mt-0.5 rounded-md border transition-all flex items-center justify-center ${agreed?"bg-violet-600 border-violet-600":dark?"border-white/20 bg-white/[0.03] hover:border-violet-500/40":"border-gray-300 hover:border-violet-400"}`} style={{width:17,height:17}}>
                  {agreed&&<svg width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span className={`text-xs leading-relaxed ${dark?"text-gray-500":"text-gray-500"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>
                  I agree to PulseHub's <a href="#" className="text-violet-500 hover:text-violet-400 font-medium">Terms of Service</a> and <a href="#" className="text-violet-500 hover:text-violet-400 font-medium">Privacy Policy</a>
                </span>
              </label>
              {/* Submit */}
              <button type="submit" disabled={loading} className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 flex items-center justify-center gap-2 mt-2" style={{ fontFamily: "'DM Sans',sans-serif" }}>
                {loading?<><svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>Creating account…</>:<>Create free account <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg></>}
              </button>
            </form>
          )}

          <p className={`text-center text-sm mt-5 ${dark?"text-gray-600":"text-gray-400"}`} style={{ fontFamily: "'DM Sans',sans-serif" }}>
            Already have an account?{" "}
            <button onClick={()=>setPage("login")} className="text-violet-500 hover:text-violet-400 font-semibold">Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── APP ROOT ─────────────────────────────────────── */
export default function App() {
  const [dark, setDark] = useState(true);
  const [page, setPage] = useState("home");

  if (page === "login") return <Login dark={dark} setPage={setPage} />;
  if (page === "register") return <Register dark={dark} setPage={setPage} />;

  return (
    <div id="preview-scroll" className="h-screen overflow-y-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Navbar dark={dark} toggleTheme={() => setDark(d => !d)} setPage={setPage} />
      <main>
        <Hero dark={dark} setPage={setPage} />
        <Features dark={dark} />
        <HowItWorks dark={dark} />
      </main>
      <Footer dark={dark} />
    </div>
  );
}