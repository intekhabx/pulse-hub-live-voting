import { useNavigate } from "@tanstack/react-router";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import authService from "../../services/authService";
import tokenStore from "../../services/tokenStoreService";
import { Icons } from "./Icons";
import { DataContext } from "../../Context/ContextApi";
import { PollContext } from "../../Context/PollContext";

// ── Top Navbar ─────────────────────────────────────────────────────────────

interface TopNavbarProps {
  collapsed: boolean;
  activeSection: string;
  onMenuClick: () => void;
  onSectionChange: (section: string) => void;
}

const sectionLabels: Record<string, string> = {
  overview: "Overview",
  polls: "My Polls",
  analytics: "Analytics",
  settings: "Settings",
  create: "Create Poll",
};

const MAX_SEARCH_RESULTS = 6;

export function TopNavbar({ collapsed, activeSection, onMenuClick, onSectionChange }: TopNavbarProps) {

  const context = useContext(DataContext);
  if(!context){
    throw new Error("removeAuthUser should be defined in the ContextApi");
  }
  const {removeAuthUser} = context;

  const pollContext = useContext(PollContext);
  if(!pollContext){
    throw new Error("polls should be defined inside the PollContext");
  }
  const {polls} = pollContext;
  const [searchInput, setSearchInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const user = tokenStore.getUser();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
      removeAuthUser();
      localStorage.removeItem("dashboard-section");
      localStorage.removeItem("pulsehub-dashboard-section");
      navigate({ to: "/" });
    } finally {
      setIsLoggingOut(false);
    }
  };


  // debounce the raw input — only re-filter 500ms after the user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchInput.trim().toLowerCase());
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // searching
  const searchResults = useMemo(() => {
    if (!debouncedQuery) return [];
    return polls
      .filter((poll) => poll.title?.toLowerCase().includes(debouncedQuery))
      .slice(0, MAX_SEARCH_RESULTS);
  }, [polls, debouncedQuery]);

  // true while the user is still typing and results haven't caught up yet
  const isSearchPending = searchInput.trim() !== "" && searchInput.trim().toLowerCase() !== debouncedQuery;

  // close the dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // close the dropdown on Escape
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsSearchOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const openPoll = (pollId: string) => {
    setIsSearchOpen(false);
    setSearchInput("");
    navigate({
      to: `/dashboard/poll-edit/${pollId}?mode=edit`,
      params: { pollId },
    });
  };

  const viewAllPolls = () => {
    setIsSearchOpen(false);
    setSearchInput("");
    // Calling navigate() alone doesn't help when we're already on /dashboard —
    // the URL doesn't change, so the router won't remount Dashboard and the
    // section state (only read from localStorage on mount) never updates.
    // Switch the section directly instead.
    onSectionChange("polls");
  };


  return (
    <header
      className={`fixed top-0 right-0 left-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 border-b border-white/[0.06] bg-[#0a0a12]/90 backdrop-blur-xl transition-all duration-300 ${
        collapsed ? "lg:left-16" : "lg:left-56"
      }`}
    >
      {/* Left: hamburger (mobile) + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="lg:hidden w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors border border-white/[0.07]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="hidden sm:flex items-center gap-2 min-w-0">
          <span className="text-xs text-gray-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            PulseHub
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-sm font-semibold text-gray-200 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {sectionLabels[activeSection] || "Dashboard"}
          </span>
        </div>

        {/* Mobile-only current section label (no breadcrumb, saves space) */}
        <span className="sm:hidden text-sm font-semibold text-gray-200 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {sectionLabels[activeSection] || "Dashboard"}
        </span>
      </div>

      {/* Right: search + bell + profile */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Search */}
        <div ref={searchContainerRef} className="relative hidden md:block">
          <div className="flex items-center gap-2 px-3 h-8 rounded-full bg-white/[0.04] border border-white/[0.07] text-gray-200 hover:border-white/10 focus-within:border-violet-500/40 transition-colors">
            {Icons.search}
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search Polls..."
              className="text-xs h-full outline-none bg-transparent w-40 lg:w-56"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>

          {/* Google-style results dropdown */}
          {isSearchOpen && searchInput.trim() !== "" && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-80 rounded-2xl border border-white/[0.08] bg-[#13131f] shadow-2xl shadow-black/50 overflow-hidden z-50">
              {isSearchPending ? (
                <div className="px-4 py-6 text-center">
                  <p className="text-xs text-gray-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Searching…
                  </p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="py-1.5 max-h-80 overflow-y-auto">
                  {searchResults.map((poll) => (
                    <button
                      key={poll._id}
                      onClick={() => openPoll(poll._id)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/[0.05] transition-colors"
                    >
                      <span className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 flex-shrink-0">
                        {Icons.search}
                      </span>
                      <span
                        className="text-sm text-gray-200 truncate"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {poll.title}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-6 text-center">
                  <p className="text-xs text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    No polls found for "{searchInput.trim()}"
                  </p>
                </div>
              )}

              <button
                onClick={viewAllPolls}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-violet-400 hover:text-violet-300 hover:bg-white/[0.03] border-t border-white/[0.06] transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                View all polls
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Notification bell */}
        {/* <button className="relative w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-white/[0.05] transition-colors border border-white/[0.07] flex-shrink-0">
          {Icons.bell}
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet-500" />
        </button> */}

        {/* Profile */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 sm:border-l border-white/[0.07] group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-violet-500/20 flex-shrink-0">
            {user?.name[0]}
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-semibold text-gray-300 leading-none" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {user?.name}
            </div>
            <div className="text-[10px] text-gray-600 mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Pro Plan
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-gray-600 hover:text-rose-400 transition-colors ml-1 cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
            title="Logout"
          >
            {isLoggingOut ? (
              <svg className="animate-spin" width="17" height="17" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
                <path d="M12 3a9 9 0 019 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              Icons.logout
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
