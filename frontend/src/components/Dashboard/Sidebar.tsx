import { useEffect } from "react";
import tokenStore from "../../services/tokenStoreService";
import { Icons } from "./Icons";

// ── Sidebar ────────────────────────────────────────────────────────────────

interface SidebarProps {
  active: string;
  setActive: (s: string) => void;
  collapsed: boolean;
  setCollapsed: (b: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (b: boolean) => void;
}

export function Sidebar({ active, setActive, collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  const user = tokenStore.getUser();

  const navItems = [
    { id: "overview", label: "Overview", icon: Icons.home },
    { id: "polls", label: "My Polls", icon: Icons.polls },
    { id: "analytics", label: "Analytics", icon: Icons.analytics },
    { id: "settings", label: "Settings", icon: Icons.settings },
  ];

  const handleNav = (id: string) => {
    setActive(id);
    setMobileOpen(false);
  };

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px]"
        />
      )}

      {/* Sidebar / mobile drawer */}
      <aside
        className={`fixed left-0 top-0 h-full z-50 flex flex-col border-r border-white/[0.06] bg-[#0d0d1a] transition-transform duration-300 ease-out
        w-64 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:transition-[width] lg:duration-300 ${collapsed ? "lg:w-16" : "lg:w-56"}`}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 px-4 border-b border-white/[0.06] ${collapsed ? "lg:justify-center" : "gap-3"}`}>
          <div className="relative w-8 h-8 flex-shrink-0">
            <div className="absolute inset-0 rounded-[9px] bg-gradient-to-br from-violet-500 to-fuchsia-600 opacity-30 blur-md" />
            <div className="relative w-8 h-8 rounded-[9px] bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30 text-white">
              {Icons.pulse}
            </div>
          </div>
          {(!collapsed || mobileOpen) && (
            <span className="text-lg font-black tracking-tight text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
              Pulse<span className="text-violet-500">Hub</span>
            </span>
          )}
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="lg:hidden ml-auto w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {/* Create Poll CTA */}
          <button
            onClick={() => handleNav("create")}
            className={`w-full flex items-center rounded-xl px-3 py-2.5 mb-3 font-bold text-sm text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/20 transition-all duration-200 hover:-translate-y-0.5 ${
              collapsed && !mobileOpen ? "lg:justify-center" : "gap-3"
            }`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            title={collapsed && !mobileOpen ? "Create Poll" : undefined}
          >
            {Icons.plus}
            {(!collapsed || mobileOpen) && "Create Poll"}
          </button>

          {navItems.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={`relative w-full flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                collapsed && !mobileOpen ? "lg:justify-center" : "gap-3"
              } ${
                active === id
                  ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.04] border border-transparent"
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              title={collapsed && !mobileOpen ? label : undefined}
            >
              {active === id && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-gradient-to-b from-violet-400 to-fuchsia-400" />
              )}
              <span className={active === id ? "text-violet-400" : ""}>{icon}</span>
              {(!collapsed || mobileOpen) && label}
              {(!collapsed || mobileOpen) && active === id && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />
              )}
            </button>
          ))}
        </nav>

        {/* Collapse Toggle + User */}
        <div className="border-t border-white/[0.06] p-3 space-y-2">
          {(!collapsed || mobileOpen) && (
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group">
              <div className="relative w-8 h-8 flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white/[0.08] group-hover:ring-violet-500/30 transition-all">
                  {user?.name[0]}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0d0d1a]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-gray-300 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {user?.name}
                </div>
                <div className="text-[10px] text-gray-600 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {user?.email}
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-full items-center justify-center gap-2 py-2 rounded-xl text-gray-600 hover:text-gray-300 hover:bg-white/[0.04] transition-colors text-xs"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              {collapsed ? (
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
            {!collapsed && "Collapse"}
          </button>
        </div>
      </aside>
    </>
  );
}