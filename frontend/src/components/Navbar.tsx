import { useState, useEffect, useContext } from "react";
import { DataContext } from "../Context/ContextApi";
import { Link } from "@tanstack/react-router";
import tokenStore from "../services/tokenStoreService";


interface IUser {
  email: string;
  name: string;
  role: string;
  userId: string;
}


export default function Navbar() {

  const context = useContext(DataContext);
  if(!context){
    throw new Error("dark and toggleTheme must be used within ContextApiProvider");
  }
  const {dark, toggleTheme} = context;


  const [user, setUser] = useState<IUser | null>(null);

  useEffect(()=> {
    const authenticateUser = ()=> {
      const user = tokenStore.getUser();
      const accessToken = tokenStore.getAccessToken();
  
      if(user && accessToken){
        setUser(user);
      }
    }
    authenticateUser();
  }, [])

  

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = ["Features", "How it Works", "Pricing", "Docs"];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? dark
            ? "bg-[#0a0a12]/90 backdrop-blur-2xl border-b border-white/[0.06] shadow-2xl shadow-black/40"
            : "bg-white/90 backdrop-blur-2xl border-b border-black/[0.06] shadow-xl shadow-black/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">

        {/* ── Logo ── */}
        <a href="#" className="flex items-center gap-3 group select-none">
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
            className={`text-[1.35rem] font-black tracking-tight transition-colors duration-300 ${
              dark ? "text-white" : "text-gray-900"
            }`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Pulse<span className="text-violet-500">Hub</span>
          </span>
        </a>

        {/* ── Desktop Nav Links ── */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                className={`text-sm font-medium tracking-wide transition-colors duration-200 hover:text-violet-500 ${
                  dark ? "text-gray-400" : "text-gray-500"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-3">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
              dark
                ? "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10"
                : "bg-black/5 hover:bg-black/10 text-gray-500 hover:text-gray-900 border border-black/10"
            }`}
          >
            {dark ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          {/* Sign In */}
          {
            user ? "" :
            <Link
              to="/login"
              className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                dark
                  ? "text-gray-300 hover:text-white hover:bg-white/5 border border-white/10"
                  : "text-gray-600 hover:text-gray-900 hover:bg-black/5 border border-black/10"
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Sign In
            </Link>
          }

          {/* Get Started */}
          <Link
            to={user ? "/dashboard" : "/register"}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {user ? "Go to Dashboard" : "Get Started"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className={`md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-200 ${
              dark ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-gray-500 hover:text-gray-900 hover:bg-black/5"
            }`}
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 8h18M3 16h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        } ${dark ? "bg-[#0a0a12]/95 border-t border-white/[0.06]" : "bg-white/95 border-t border-black/[0.06]"}`}
      >
        <div className="px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium py-1.5 transition-colors ${
                dark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {link}
            </a>
          ))}
          {
            user ? "" :
            <Link
              to="/login"
              className={`text-sm font-semibold py-1.5 ${dark ? "text-gray-300" : "text-gray-700"}`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Sign In
            </Link>
          }
        </div>
      </div>

    </nav>
  );
}