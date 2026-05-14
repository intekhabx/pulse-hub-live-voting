import { useState } from "react";
import tokenStore from "../services/tokenStoreService";

// ── Types ──────────────────────────────────────────────────────────────────
interface Poll {
  id: string;
  title: string;
  status: "active" | "expired" | "draft";
  responses: number;
  questions: number;
  expiresAt: string;
  isPublished: boolean;
  allowAnonymous: boolean;
}

// ── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_POLLS: Poll[] = [
  { id: "1", title: "Developer Experience Survey 2024", status: "active", responses: 128, questions: 6, expiresAt: "2025-06-10", isPublished: false, allowAnonymous: true },
  { id: "2", title: "Product Roadmap Feedback Q2", status: "active", responses: 74, questions: 4, expiresAt: "2025-05-30", isPublished: false, allowAnonymous: false },
  { id: "3", title: "Team Retrospective — Sprint 42", status: "expired", responses: 23, questions: 5, expiresAt: "2025-04-20", isPublished: true, allowAnonymous: true },
  { id: "4", title: "Tech Stack Preferences", status: "expired", responses: 210, questions: 8, expiresAt: "2025-03-15", isPublished: true, allowAnonymous: true },
  { id: "5", title: "Onboarding Experience Check", status: "draft", responses: 0, questions: 3, expiresAt: "2025-07-01", isPublished: false, allowAnonymous: false },
];

const RECENT_ACTIVITY = [
  { id: 1, poll: "Developer Experience Survey 2024", action: "New response received", time: "2 min ago", icon: "response" },
  { id: 2, poll: "Product Roadmap Feedback Q2", action: "New response received", time: "15 min ago", icon: "response" },
  { id: 3, poll: "Team Retrospective — Sprint 42", action: "Results published", time: "2 hours ago", icon: "publish" },
  { id: 4, poll: "Tech Stack Preferences", action: "Poll expired", time: "Yesterday", icon: "expire" },
  { id: 5, poll: "Onboarding Experience Check", action: "Poll created", time: "Yesterday", icon: "create" },
];

// ── Icons ──────────────────────────────────────────────────────────────────
const Icons = {
  home: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  polls: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  analytics: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="2"/></svg>,
  plus: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  bell: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  logout: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  pulse: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 12h3l3-8 4 16 3-8 3 4h2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  eye: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>,
  link: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  trash: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  menu: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  close: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
};

// ── Status Badge ───────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Poll["status"] }) {
  const map = {
    active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    expired: "bg-gray-500/15 text-gray-400 border-gray-500/20",
    draft: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${map[status]}`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === "active" ? "bg-emerald-400 animate-pulse" : status === "draft" ? "bg-amber-400" : "bg-gray-500"}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, gradient }: {
  label: string; value: string; sub: string; icon: React.ReactNode; gradient: string;
}) {
  return (
    <div className="relative rounded-2xl p-5 border border-white/[0.07] bg-[#13131f] overflow-hidden group hover:border-white/10 transition-all duration-300">
      <div className={`absolute top-0 right-0 w-28 h-28 rounded-full ${gradient} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500 -translate-y-6 translate-x-6`} />
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-black text-white mb-0.5" style={{ fontFamily: "'Syne', sans-serif" }}>{value}</div>
      <div className="text-xs font-semibold text-gray-400 mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
      <div className="text-[11px] text-gray-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>{sub}</div>
    </div>
  );
}

// ── Activity Icon ──────────────────────────────────────────────────────────
function ActivityIcon({ type }: { type: string }) {
  const map: Record<string, { bg: string; icon: React.ReactNode }> = {
    response: { bg: "bg-violet-500/20 text-violet-400", icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    publish: { bg: "bg-emerald-500/20 text-emerald-400", icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    expire: { bg: "bg-gray-500/20 text-gray-400", icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
    create: { bg: "bg-cyan-500/20 text-cyan-400", icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
  };
  const { bg, icon } = map[type] || map.create;
  return <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${bg}`}>{icon}</div>;
}

// ── Sidebar ────────────────────────────────────────────────────────────────
function Sidebar({ active, setActive, collapsed, setCollapsed }: {
  active: string;
  setActive: (s: string) => void;
  collapsed: boolean;
  setCollapsed: (b: boolean) => void;
}) {

  const user = tokenStore.getUser();
  const navItems = [
    { id: "overview", label: "Overview", icon: Icons.home },
    { id: "polls", label: "My Polls", icon: Icons.polls },
    { id: "analytics", label: "Analytics", icon: Icons.analytics },
    { id: "settings", label: "Settings", icon: Icons.settings },
  ];

  return (
    <aside className={`fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300 border-r border-white/[0.06] bg-[#0d0d1a] ${collapsed ? "w-16" : "w-56"}`}>
      {/* Logo */}
      <div className={`flex items-center h-16 px-4 border-b border-white/[0.06] ${collapsed ? "justify-center" : "gap-3"}`}>
        <div className="relative w-8 h-8 flex-shrink-0">
          <div className="absolute inset-0 rounded-[9px] bg-gradient-to-br from-violet-500 to-fuchsia-600 opacity-30 blur-md" />
          <div className="relative w-8 h-8 rounded-[9px] bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30 text-white">
            {Icons.pulse}
          </div>
        </div>
        {!collapsed && (
          <span className="text-lg font-black tracking-tight text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            Pulse<span className="text-violet-500">Hub</span>
          </span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {/* Create Poll CTA */}
        <button
          onClick={() => setActive("create")}
          className={`w-full flex items-center rounded-xl px-3 py-2.5 mb-3 font-bold text-sm text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/20 transition-all duration-200 hover:-translate-y-0.5 ${collapsed ? "justify-center" : "gap-3"}`}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {Icons.plus}
          {!collapsed && "Create Poll"}
        </button>

        {navItems.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`w-full flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${collapsed ? "justify-center" : "gap-3"} ${
              active === id
                ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]"
            }`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            title={collapsed ? label : undefined}
          >
            <span className={active === id ? "text-violet-400" : ""}>{icon}</span>
            {!collapsed && label}
            {!collapsed && active === id && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />
            )}
          </button>
        ))}
      </nav>

      {/* Collapse Toggle + User */}
      <div className="border-t border-white/[0.06] p-3 space-y-2">
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{user?.name[0]}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-300 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{user?.name}</div>
              <div className="text-[10px] text-gray-600 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{user?.email}</div>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-gray-600 hover:text-gray-300 hover:bg-white/[0.04] transition-colors text-xs"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            {collapsed
              ? <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              : <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>}
          </svg>
          {!collapsed && "Collapse"}
        </button>
      </div>
    </aside>
  );
}

// ── Top Navbar ─────────────────────────────────────────────────────────────
function TopNavbar({ collapsed, activeSection }: { collapsed: boolean; activeSection: string }) {

  const user = tokenStore.getUser();

  const sectionLabels: Record<string, string> = {
    overview: "Overview",
    polls: "My Polls",
    analytics: "Analytics",
    settings: "Settings",
    create: "Create Poll",
  };

  return (
    <header className={`fixed top-0 right-0 z-30 h-16 flex items-center justify-between px-6 border-b border-white/[0.06] bg-[#0a0a12]/90 backdrop-blur-xl transition-all duration-300 ${collapsed ? "left-16" : "left-56"}`}>
      {/* Left: breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>PulseHub</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span className="text-sm font-semibold text-gray-200" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {sectionLabels[activeSection] || "Dashboard"}
        </span>
      </div>

      {/* Right: search + bell + profile */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-gray-500 hover:border-white/10 transition-colors cursor-pointer">
          {Icons.search}
          <span className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>Search polls…</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/[0.06] text-gray-600 ml-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>⌘K</span>
        </div>

        {/* Notification bell */}
        <button className="relative w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-white/[0.05] transition-colors border border-white/[0.07]">
          {Icons.bell}
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet-500" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-white/[0.07] cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-violet-500/20">{user?.name[0]}</div>
          <div className="hidden sm:block">
            <div className="text-xs font-semibold text-gray-300 leading-none" style={{ fontFamily: "'DM Sans', sans-serif" }}>{user?.name}</div>
            <div className="text-[10px] text-gray-600 mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Pro Plan</div>
          </div>
          <button className="text-gray-600 hover:text-rose-400 transition-colors ml-1" title="Logout">
            {Icons.logout}
          </button>
        </div>
      </div>
    </header>
  );
}

// ── Overview Section ───────────────────────────────────────────────────────
function OverviewSection({ setActive }: { setActive: (s: string) => void }) {
  const user = tokenStore.getUser();

  const activePolls = MOCK_POLLS.filter(p => p.status === "active").length;
  const totalResponses = MOCK_POLLS.reduce((a, p) => a + p.responses, 0);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            Welcome {user?.name}👋
          </h1>
          <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Here's what's happening with your polls today.
          </p>
        </div>
        <button
          onClick={() => setActive("create")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 transition-all hover:-translate-y-0.5 whitespace-nowrap"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {Icons.plus} Create Poll
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Polls" value={String(MOCK_POLLS.length)} sub="+1 this week"
          gradient="from-violet-500 to-fuchsia-500"
          icon={Icons.polls}
        />
        <StatCard
          label="Active Polls" value={String(activePolls)} sub="Collecting responses"
          gradient="from-emerald-500 to-teal-500"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        />
        <StatCard
          label="Total Responses" value={String(totalResponses)} sub="Across all polls"
          gradient="from-cyan-500 to-blue-500"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        />
        <StatCard
          label="Published Results" value={String(MOCK_POLLS.filter(p => p.isPublished).length)} sub="Publicly visible"
          gradient="from-amber-500 to-orange-500"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        />
      </div>

      {/* Bottom: Recent Polls + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Polls */}
        <div className="lg:col-span-2 rounded-2xl border border-white/[0.07] bg-[#13131f] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Recent Polls</h2>
            <button onClick={() => setActive("polls")} className="text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>View all →</button>
          </div>
          <div className="space-y-3">
            {MOCK_POLLS.slice(0, 4).map(poll => (
              <div key={poll.id} className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{poll.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{poll.responses} responses · {poll.questions} questions</p>
                </div>
                <StatusBadge status={poll.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#13131f] p-5">
          <h2 className="text-sm font-bold text-white mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>Recent Activity</h2>
          <div className="space-y-3">
            {RECENT_ACTIVITY.map(item => (
              <div key={item.id} className="flex items-start gap-3">
                <ActivityIcon type={item.icon} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-300 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.action}</p>
                  <p className="text-[11px] text-gray-600 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.poll}</p>
                  <p className="text-[10px] text-gray-700 mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Polls Section ──────────────────────────────────────────────────────────
function PollsSection({ setActive }: { setActive: (s: string) => void }) {
  const [filter, setFilter] = useState<"all" | "active" | "expired" | "draft">("all");
  const filtered = filter === "all" ? MOCK_POLLS : MOCK_POLLS.filter(p => p.status === filter);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>My Polls</h1>
          <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Manage and track all your polls</p>
        </div>
        <button
          onClick={() => setActive("create")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 transition-all hover:-translate-y-0.5 whitespace-nowrap"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {Icons.plus} New Poll
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit">
        {(["all", "active", "expired", "draft"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 capitalize ${filter === f ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20" : "text-gray-500 hover:text-gray-300"}`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Polls table */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#13131f] overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/[0.05]">
          {["Poll Title", "Status", "Responses", "Expires", "Actions"].map(h => (
            <div key={h} className={`text-[11px] font-bold text-gray-600 uppercase tracking-widest ${h === "Poll Title" ? "col-span-4" : h === "Actions" ? "col-span-2 text-right" : "col-span-2"}`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}>{h}</div>
          ))}
        </div>
        {filtered.map(poll => (
          <div key={poll.id} className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors group">
            <div className="col-span-4">
              <p className="text-sm font-medium text-gray-200 leading-snug" style={{ fontFamily: "'DM Sans', sans-serif" }}>{poll.title}</p>
              <p className="text-xs text-gray-600 mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {poll.questions} questions · {poll.allowAnonymous ? "Anonymous" : "Authenticated"}
                {poll.isPublished && <span className="ml-2 text-emerald-500">· Published</span>}
              </p>
            </div>
            <div className="col-span-2 flex items-center"><StatusBadge status={poll.status} /></div>
            <div className="col-span-2 flex items-center">
              <span className="text-sm font-semibold text-gray-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>{poll.responses}</span>
            </div>
            <div className="col-span-2 flex items-center">
              <span className="text-xs text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {new Date(poll.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
            <div className="col-span-2 flex items-center justify-end gap-2">
              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-violet-400 hover:bg-violet-500/10 transition-colors" title="View">{Icons.eye}</button>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors" title="Copy link">{Icons.link}</button>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors" title="Delete">{Icons.trash}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Analytics Section ──────────────────────────────────────────────────────
function AnalyticsSection() {
  const topPoll = MOCK_POLLS.reduce((a, b) => a.responses > b.responses ? a : b);
  const totalResponses = MOCK_POLLS.reduce((a, p) => a + p.responses, 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Analytics</h1>
        <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Insights across all your polls</p>
      </div>

      {/* Response bar chart (visual) */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#13131f] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Responses per Poll</h2>
          <span className="text-xs text-gray-500 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]" style={{ fontFamily: "'DM Sans', sans-serif" }}>All time</span>
        </div>
        <div className="space-y-4">
          {MOCK_POLLS.map(poll => (
            <div key={poll.id}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-gray-400 truncate max-w-[60%]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{poll.title}</span>
                <span className="text-xs font-bold text-gray-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>{poll.responses}</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ${
                    poll.status === "active" ? "from-violet-500 to-fuchsia-500" :
                    poll.status === "expired" ? "from-gray-600 to-gray-500" :
                    "from-amber-500 to-orange-500"
                  }`}
                  style={{ width: `${Math.round((poll.responses / topPoll.responses) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Avg. responses per poll", value: Math.round(totalResponses / MOCK_POLLS.length), suffix: "" },
          { label: "Highest response poll", value: topPoll.responses, suffix: " responses" },
          { label: "Anonymous polls", value: MOCK_POLLS.filter(p => p.allowAnonymous).length, suffix: ` / ${MOCK_POLLS.length}` },
        ].map(({ label, value, suffix }) => (
          <div key={label} className="rounded-2xl border border-white/[0.07] bg-[#13131f] p-5">
            <div className="text-2xl font-black text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
              {value}<span className="text-sm text-gray-500 font-medium">{suffix}</span>
            </div>
            <div className="text-xs text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Create Poll Section ────────────────────────────────────────────────────
function CreatePollSection({ setActive }: { setActive: (s: string) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [allowAnonymous, setAllowAnonymous] = useState(true);
  const [expiresAt, setExpiresAt] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", required: false, options: [{ optionText: "" }, { optionText: "" }] }
  ]);

  const addQuestion = () => setQuestions(q => [...q, { questionText: "", required: false, options: [{ optionText: "" }, { optionText: "" }] }]);
  const removeQuestion = (i: number) => setQuestions(q => q.filter((_, idx) => idx !== i));
  const addOption = (qi: number) => setQuestions(q => q.map((qu, i) => i === qi ? { ...qu, options: [...qu.options, { optionText: "" }] } : qu));
  const removeOption = (qi: number, oi: number) => setQuestions(q => q.map((qu, i) => i === qi ? { ...qu, options: qu.options.filter((_, j) => j !== oi) } : qu));

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-sm text-white bg-white/[0.04] border border-white/[0.08] outline-none focus:border-violet-500/50 transition-all placeholder-gray-600";

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center gap-3">
        <button onClick={() => setActive("polls")} className="text-gray-600 hover:text-gray-300 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Create Poll</h1>
          <p className="text-sm text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>Build and publish a new poll</p>
        </div>
      </div>

      {/* Poll Details */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#13131f] p-6 space-y-4">
        <h2 className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Poll Details</h2>
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Poll Title *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Team Feedback Survey" className={inputCls} style={{ fontFamily: "'DM Sans', sans-serif" }} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Description (optional)</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Add context for your respondents…" rows={2} className={`${inputCls} resize-none`} style={{ fontFamily: "'DM Sans', sans-serif" }} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Expires At</label>
            <input type="datetime-local" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} className={inputCls} style={{ fontFamily: "'DM Sans', sans-serif" }} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Response Mode</label>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => setAllowAnonymous(!allowAnonymous)}
                className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${allowAnonymous ? "bg-violet-600" : "bg-white/10"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${allowAnonymous ? "translate-x-4" : "translate-x-0.5"}`} />
              </button>
              <span className="text-xs text-gray-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>{allowAnonymous ? "Anonymous" : "Authenticated"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((q, qi) => (
          <div key={qi} className="rounded-2xl border border-white/[0.07] bg-[#13131f] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-violet-400 uppercase tracking-widest" style={{ fontFamily: "'DM Sans', sans-serif" }}>Question {qi + 1}</span>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <input type="checkbox" checked={q.required} onChange={e => setQuestions(qs => qs.map((qu, i) => i === qi ? { ...qu, required: e.target.checked } : qu))} className="accent-violet-500" />
                  Required
                </label>
                {questions.length > 1 && (
                  <button onClick={() => removeQuestion(qi)} className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">{Icons.trash}</button>
                )}
              </div>
            </div>
            <input
              value={q.questionText}
              onChange={e => setQuestions(qs => qs.map((qu, i) => i === qi ? { ...qu, questionText: e.target.value } : qu))}
              placeholder="Enter your question…"
              className={inputCls}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
            <div className="space-y-2 pl-2 border-l-2 border-violet-500/20">
              {q.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border border-gray-600 flex-shrink-0" />
                  <input
                    value={opt.optionText}
                    onChange={e => setQuestions(qs => qs.map((qu, i) => i === qi ? { ...qu, options: qu.options.map((o, j) => j === oi ? { optionText: e.target.value } : o) } : qu))}
                    placeholder={`Option ${oi + 1}`}
                    className="flex-1 px-3 py-1.5 rounded-lg text-sm text-gray-300 bg-white/[0.03] border border-white/[0.06] outline-none focus:border-violet-500/40 transition-all placeholder-gray-700"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                  {q.options.length > 2 && (
                    <button onClick={() => removeOption(qi, oi)} className="text-gray-700 hover:text-rose-400 transition-colors flex-shrink-0">{Icons.trash}</button>
                  )}
                </div>
              ))}
              <button onClick={() => addOption(qi)} className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1 mt-1 pl-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                Add option
              </button>
            </div>
          </div>
        ))}
        <button onClick={addQuestion} className="w-full py-3 rounded-2xl border border-dashed border-white/10 text-sm text-gray-500 hover:text-gray-300 hover:border-violet-500/30 transition-all flex items-center justify-center gap-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {Icons.plus} Add Question
        </button>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <button className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 transition-all hover:-translate-y-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Create & Share Poll
        </button>
        <button onClick={() => setActive("polls")} className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-400 border border-white/[0.08] hover:bg-white/[0.04] transition-all" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Settings Section ───────────────────────────────────────────────────────
function SettingsSection() {
  const {name, email} = tokenStore.getUser();
  const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-sm text-white bg-white/[0.04] border border-white/[0.08] outline-none focus:border-violet-500/50 transition-all";
  return (
    <div className="space-y-5 max-w-xl">
      <div>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Settings</h1>
        <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Manage your account preferences</p>
      </div>
      {[
        { title: "Profile", fields: [{ label: "Full Name", val: name, type: "text" }, { label: "Email", val: email, type: "email" }] },
        { title: "Security", fields: [{ label: "Current Password", val: "", type: "password" }, { label: "New Password", val: "", type: "password" }] },
      ].map(({ title, fields }) => (
        <div key={title} className="rounded-2xl border border-white/[0.07] bg-[#13131f] p-6 space-y-4">
          <h2 className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>{title}</h2>
          {fields.map(({ label, val, type }) => (
            <div key={label}>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</label>
              <input type={type} defaultValue={val} className={inputCls} style={{ fontFamily: "'DM Sans', sans-serif" }} />
            </div>
          ))}
          <button className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 transition-opacity" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Save Changes
          </button>
        </div>
      ))}
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6">
        <h2 className="text-sm font-bold text-rose-400 mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Danger Zone</h2>
        <p className="text-xs text-gray-500 mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Once you delete your account, all your polls and data will be permanently removed.</p>
        <button className="px-5 py-2 rounded-xl text-sm font-semibold text-rose-400 border border-rose-500/30 hover:bg-rose-500/10 transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Delete Account
        </button>
      </div>
    </div>
  );
}

// ── MAIN DASHBOARD ─────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case "overview": return <OverviewSection setActive={setActiveSection} />;
      case "polls": return <PollsSection setActive={setActiveSection} />;
      case "analytics": return <AnalyticsSection />;
      case "create": return <CreatePollSection setActive={setActiveSection} />;
      case "settings": return <SettingsSection />;
      default: return <OverviewSection setActive={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a12]">
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Sidebar active={activeSection} setActive={setActiveSection} collapsed={collapsed} setCollapsed={setCollapsed} />
      <TopNavbar collapsed={collapsed} activeSection={activeSection} />
      <main className={`transition-all duration-300 pt-16 min-h-screen ${collapsed ? "ml-16" : "ml-56"}`}>
        <div className="p-6 max-w-6xl">
          {renderSection()}
        </div>
      </main>
    </div>
  );
}