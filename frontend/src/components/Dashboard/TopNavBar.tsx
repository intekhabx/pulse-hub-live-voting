import { useNavigate } from "@tanstack/react-router";
import authService from "../../services/authService";
import tokenStore from "../../services/tokenStoreService";
import { Icons } from "./Icons";

// ── Top Navbar ─────────────────────────────────────────────────────────────

interface TopNavbarProps {
  collapsed: boolean;
  activeSection: string;
}

const sectionLabels: Record<string, string> = {
  overview: "Overview",
  polls: "My Polls",
  analytics: "Analytics",
  settings: "Settings",
  create: "Create Poll",
};

export function TopNavbar({ collapsed, activeSection }: TopNavbarProps) {
  const user = tokenStore.getUser();
  const navigate = useNavigate();

  const handleLogout = async()=>{
    await authService.logout();
    navigate({ to: "/"});
  }

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 flex items-center justify-between px-6 border-b border-white/[0.06] bg-[#0a0a12]/90 backdrop-blur-xl transition-all duration-300 ${
        collapsed ? "left-16" : "left-56"
      }`}
    >
      {/* Left: breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          PulseHub
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M9 18l6-6-6-6" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span
          className="text-sm font-semibold text-gray-200"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {sectionLabels[activeSection] || "Dashboard"}
        </span>
      </div>

      {/* Right: search + bell + profile */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-gray-500 hover:border-white/10 transition-colors cursor-pointer">
          {Icons.search}
          <span className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Search polls…
          </span>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/[0.06] text-gray-600 ml-2"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            ⌘K
          </span>
        </div>

        {/* Notification bell */}
        <button className="relative w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-white/[0.05] transition-colors border border-white/[0.07]">
          {Icons.bell}
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet-500" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-white/[0.07] cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-violet-500/20">
            {user?.name[0]}
          </div>
          <div className="hidden sm:block">
            <div
              className="text-xs font-semibold text-gray-300 leading-none"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {user?.name}
            </div>
            <div
              className="text-[10px] text-gray-600 mt-0.5"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Pro Plan
            </div>
          </div>
          <button 
          onClick={handleLogout}
          className="text-gray-600 hover:text-rose-400 transition-colors ml-1" title="Logout">
            {Icons.logout}
          </button>
        </div>
      </div>
    </header>
  );
}