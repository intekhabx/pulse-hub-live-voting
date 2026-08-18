import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { DataContext } from "../Context/ContextApi";
import authService from "../services/authService";


export function AuthCallback() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("dark must be present in the DataContext Contexts");
  }
  const { dark } = context;

  const navigate = useNavigate();
  const { otp, next } = useSearch({ from: "/auth/callback" });


  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  // Guards against React 18 StrictMode / re-render double-invoking the
  // exchange call, since the OTP is single-use and would fail the 2nd time.
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    async function exchangeOtp() {
      if (!otp) {
        setStatus("error");
        setErrorMessage("No login code was found in the URL. Please try signing in again.");
        return;
      }

      try {
        await authService.exchangeOauthOtp(otp.toString());
        navigate({ to: next || "/dashboard" });
      } 
      catch (err: any) {
        setStatus("error");
        setErrorMessage(err.response?.data?.message || "This login link has expired or is invalid. Please try again.");
      }
    }

    exchangeOtp();
  }, []);

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden ${
        dark ? "bg-[#0a0a12]" : "bg-[#f5f4ff]"
      }`}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
          <div className="absolute inset-0 rounded-full bg-fuchsia-600/12 blur-[120px]" />
          <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-violet-500/12 blur-[90px]" />
        </div>
        <svg className={`absolute inset-0 w-full h-full ${dark ? "opacity-[0.035]" : "opacity-[0.07]"}`}>
          <defs>
            <pattern id="callback-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill={dark ? "white" : "black"} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#callback-dots)" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div
          className={`rounded-2xl p-8 border shadow-2xl text-center ${
            dark ? "bg-[#11111c] border-white/[0.07] shadow-black/60" : "bg-white border-gray-100 shadow-gray-200/80"
          }`}
        >
          <div className="relative w-12 h-12 mb-5 mx-auto">
            <div className="absolute inset-0 rounded-[14px] bg-gradient-to-br from-violet-500 to-fuchsia-600 opacity-25 blur-lg" />
            <div className="relative w-12 h-12 rounded-[14px] bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-xl shadow-violet-500/30">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M3 12h3l3-8 4 16 3-8 3 4h2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {status === "loading" ? (
            <>
              <svg className="animate-spin mx-auto mb-4 text-violet-500" width="28" height="28" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <h1 className={`text-xl font-black tracking-tight ${dark ? "text-white" : "text-gray-900"}`} style={{ fontFamily: "'Syne', sans-serif" }}>
                Signing you in…
              </h1>
              <p className={`text-sm mt-1.5 ${dark ? "text-gray-500" : "text-gray-400"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Just a moment while we finish setting up your account.
              </p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="text-rose-400" />
                  <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-rose-400" />
                  <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-rose-400" />
                </svg>
              </div>
              <h1 className={`text-xl font-black tracking-tight ${dark ? "text-white" : "text-gray-900"}`} style={{ fontFamily: "'Syne', sans-serif" }}>
                Sign in failed
              </h1>
              <p className={`text-sm mt-1.5 ${dark ? "text-gray-500" : "text-gray-400"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {errorMessage}
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 mt-6 w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 hover:-translate-y-0.5"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Back to login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}