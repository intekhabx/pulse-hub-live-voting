import { useContext, useEffect, useRef, useState } from "react";
import type { KeyboardEvent, ClipboardEvent } from "react";
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { DataContext } from "../Context/ContextApi";
import authService from "../services/authService";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds


export function VerifyOtp() {

  const context = useContext(DataContext);
  if (!context) {
    throw new Error("dark must be present in the DataContext Contexts");
  }
  const { dark } = context;

  const navigate = useNavigate();
  const { email, next } = useSearch({ from: "/verify-otp" });

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const otp = digits.join("");

  const handleDigitChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    setDigits((prev) => {
      const next = [...prev];
      next[index] = clean[clean.length - 1];
      return next;
    });
    if (error) setError("");

    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async () => {
    if (otp.length < OTP_LENGTH) {
      setError("Enter the full 6-digit code");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await authService.verifyOtp({ email, otp });
      setSuccess(true);
      // ✅ otp verification ke baad user ko login page pe bhejo
      setTimeout(() => {
        navigate({ to: next ? `/login?next=${encodeURIComponent(next)}` : "/login" });
      }, 1800);
    } 
    catch (err: any) {
      setError(err.response?.data?.message || "Invalid or expired code. Please try again.");
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setError("");
    try {
      await authService.resendOtp({ email });
      setCooldown(RESEND_COOLDOWN);
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.response?.data?.message || "Couldn't resend the code. Please try again.");
    } finally {
      setResending(false);
    }
  };

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
            <pattern id="otp-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill={dark ? "white" : "black"} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#otp-dots)" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div
          className={`rounded-2xl p-8 border shadow-2xl ${
            dark ? "bg-[#11111c] border-white/[0.07] shadow-black/60" : "bg-white border-gray-100 shadow-gray-200/80"
          }`}
        >
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-12 h-12 mb-4">
              <div className="absolute inset-0 rounded-[14px] bg-gradient-to-br from-violet-500 to-fuchsia-600 opacity-25 blur-lg" />
              <div className="relative w-12 h-12 rounded-[14px] bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-xl shadow-violet-500/30">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 7l9 6 9-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <h1
              className={`text-2xl font-black tracking-tight text-center ${dark ? "text-white" : "text-gray-900"}`}
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Verify your email
            </h1>
            <p className={`text-sm mt-1.5 text-center ${dark ? "text-gray-500" : "text-gray-400"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Enter the 6-digit code sent to{" "}
              <span className={`font-semibold ${dark ? "text-gray-300" : "text-gray-700"}`}>{email || "your email"}</span>
            </p>
          </div>

          {success ? (
            <div className={`rounded-xl p-5 text-center border ${dark ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-200"}`}>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/30">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className={`text-base font-black ${dark ? "text-emerald-300" : "text-emerald-700"}`} style={{ fontFamily: "'Syne', sans-serif" }}>
                Email verified! 🎉
              </p>
              <p className={`text-sm mt-1 ${dark ? "text-emerald-500" : "text-emerald-600"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Redirecting you to login…
              </p>
            </div>
          ) : (
            <>
              {/* OTP boxes */}
              <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                {digits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl outline-none transition-all duration-200 border ${
                      dark ? "bg-white/[0.04] text-white" : "bg-gray-50 text-gray-900"
                    } ${
                      error
                        ? "border-rose-500/60 focus:border-rose-500"
                        : dark
                          ? "border-white/[0.08] focus:border-violet-500/60 focus:bg-white/[0.06]"
                          : "border-gray-200 focus:border-violet-400 focus:bg-white focus:shadow-sm focus:shadow-violet-100"
                    }`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                ))}
              </div>

              {error && (
                <p className="text-rose-400 text-xs mt-3 flex items-center justify-center gap-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  {error}
                </p>
              )}

              {/* Verify button */}
              <button
                onClick={handleVerify}
                disabled={loading}
                className="w-full mt-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
                      <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Verifying…
                  </>
                ) : (
                  <>
                    Verify email
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>

              {/* Resend */}
              <p className={`text-center text-xs mt-5 ${dark ? "text-gray-600" : "text-gray-400"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Didn't get the code?{" "}
                {cooldown > 0 ? (
                  <span className={dark ? "text-gray-500" : "text-gray-400"}>Resend in {cooldown}s</span>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={resending}
                    className="text-violet-500 hover:text-violet-400 font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {resending ? "Sending…" : "Resend code"}
                  </button>
                )}
              </p>
            </>
          )}

          {/* Back to register */}
          <p className={`text-center text-sm mt-6 ${dark ? "text-gray-600" : "text-gray-400"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Wrong email?{" "}
            <Link to="/register" className="text-violet-500 hover:text-violet-400 font-semibold transition-colors">
              Go back
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
