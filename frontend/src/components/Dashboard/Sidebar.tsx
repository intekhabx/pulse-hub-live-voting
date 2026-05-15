import tokenStore from "../../services/tokenStoreService";
import { Icons } from "./Icons";

// ── Sidebar ────────────────────────────────────────────────────────────────

interface SidebarProps {
  active: string;
  setActive: (s: string) => void;
  collapsed: boolean;
  setCollapsed: (b: boolean) => void;
}

export function Sidebar({ active, setActive, collapsed, setCollapsed }: SidebarProps) {
  const user = tokenStore.getUser();

  const navItems = [
    { id: "overview", label: "Overview", icon: Icons.home },
    { id: "polls", label: "My Polls", icon: Icons.polls },
    { id: "analytics", label: "Analytics", icon: Icons.analytics },
    { id: "settings", label: "Settings", icon: Icons.settings },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300 border-r border-white/[0.06] bg-[#0d0d1a] ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      {/* Logo */}
      <div
        className={`flex items-center h-16 px-4 border-b border-white/[0.06] ${
          collapsed ? "justify-center" : "gap-3"
        }`}
      >
        <div className="relative w-8 h-8 flex-shrink-0">
          <div className="absolute inset-0 rounded-[9px] bg-gradient-to-br from-violet-500 to-fuchsia-600 opacity-30 blur-md" />
          <div className="relative w-8 h-8 rounded-[9px] bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30 text-white">
            {Icons.pulse}
          </div>
        </div>
        {!collapsed && (
          <span
            className="text-lg font-black tracking-tight text-white"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Pulse<span className="text-violet-500">Hub</span>
          </span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {/* Create Poll CTA */}
        <button
          onClick={() => setActive("create")}
          className={`w-full flex items-center rounded-xl px-3 py-2.5 mb-3 font-bold text-sm text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/20 transition-all duration-200 hover:-translate-y-0.5 ${
            collapsed ? "justify-center" : "gap-3"
          }`}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {Icons.plus}
          {!collapsed && "Create Poll"}
        </button>

        {navItems.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`w-full flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              collapsed ? "justify-center" : "gap-3"
            } ${
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
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="text-xs font-semibold text-gray-300 truncate"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {user?.name}
              </div>
              <div
                className="text-[10px] text-gray-600 truncate"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {user?.email}
              </div>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-gray-600 hover:text-gray-300 hover:bg-white/[0.04] transition-colors text-xs"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            {collapsed ? (
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            ) : (
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            )}
          </svg>
          {!collapsed && "Collapse"}
        </button>
      </div>
    </aside>
  );
}