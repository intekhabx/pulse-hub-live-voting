import { useContext, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { DataContext } from "../Context/ContextApi";
import authService from "../services/authService";

type Step = "confirm" | "password";

export function ConfirmAccountLink() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("dark must be present in the DataContext Contexts");
  }
  const { dark } = context;

  const navigate = useNavigate();
  const { link_token, email } = useSearch({ from: "/auth/confirm" });

  const [step, setStep] = useState<Step>("confirm");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const missingParams = !link_token || !email;

  const inputBase = `w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 border ${
    dark ? "bg-white/[0.04] text-white placeholder-gray-600" : "bg-gray-50 text-gray-900 placeholder-gray-400"
  }`;

  const inputNormal = dark
    ? "border-white/[0.08] focus:border-violet-500/60 focus:bg-white/[0.06]"
    : "border-gray-200 focus:border-violet-400 focus:bg-white focus:shadow-sm focus:shadow-violet-100";

  const inputError = "border-rose-500/60 focus:border-rose-500";

  const handleCancel = () => {
    navigate({ to: "/login" });
  };

  const handleContinue = () => {
    setStep("password");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await authService.linkOauthAccount(link_token, password);
      navigate({ to: "/dashboard" });
    } 
    catch (err: any) {
      setError(err.response?.data?.message || "Incorrect password. Please try again.");
    } 
    finally {
      setLoading(false);
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
            <pattern id="confirm-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill={dark ? "white" : "black"} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#confirm-dots)" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div
          className={`rounded-2xl p-8 border shadow-2xl ${
            dark ? "bg-[#11111c] border-white/[0.07] shadow-black/60" : "bg-white border-gray-100 shadow-gray-200/80"
          }`}
        >
          {missingParams ? (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="text-rose-400" />
                  <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-rose-400" />
                  <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-rose-400" />
                </svg>
              </div>
              <h1 className={`text-xl font-black tracking-tight ${dark ? "text-white" : "text-gray-900"}`} style={{ fontFamily: "'Syne', sans-serif" }}>
                Invalid link
              </h1>
              <p className={`text-sm mt-1.5 ${dark ? "text-gray-500" : "text-gray-400"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                This confirmation link is missing required information. Please try signing in again.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 mt-6 w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 transition-all duration-300 hover:-translate-y-0.5"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Back to login
              </Link>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex flex-col items-center mb-7">
                <div className="relative w-12 h-12 mb-4">
                  <div className="absolute inset-0 rounded-[14px] bg-gradient-to-br from-violet-500 to-fuchsia-600 opacity-25 blur-lg" />
                  <div className="relative w-12 h-12 rounded-[14px] bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-xl shadow-violet-500/30">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <h1
                  className={`text-2xl font-black tracking-tight text-center ${dark ? "text-white" : "text-gray-900"}`}
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {step === "confirm" ? "Account already exists" : "Confirm your password"}
                </h1>
                <p className={`text-sm mt-1.5 text-center ${dark ? "text-gray-500" : "text-gray-400"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {step === "confirm" ? (
                    <>
                      An account with{" "}
                      <span className={`font-semibold ${dark ? "text-gray-300" : "text-gray-700"}`}>{email}</span>{" "}
                      already exists using a password. Would you like to link it with this sign-in method?
                    </>
                  ) : (
                    <>
                      Enter your password for{" "}
                      <span className={`font-semibold ${dark ? "text-gray-300" : "text-gray-700"}`}>{email}</span>{" "}
                      to link your account.
                    </>
                  )}
                </p>
              </div>

              {step === "confirm" ? (
                <div className="space-y-3">
                  <button
                    onClick={handleContinue}
                    className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Continue and link account
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    onClick={handleCancel}
                    className={`w-full py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      dark
                        ? "text-gray-400 bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.06] hover:text-gray-200"
                        : "text-gray-500 bg-gray-50 border border-gray-200 hover:bg-gray-100"
                    }`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email (readonly) */}
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-gray-400" : "text-gray-600"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Email address
                    </label>
                    <div className="relative">
                      <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${dark ? "text-gray-600" : "text-gray-400"}`}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <input
                        type="email"
                        value={email}
                        readOnly
                        disabled
                        className={`${inputBase} pl-10 opacity-60 cursor-not-allowed ${inputNormal}`}
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-gray-400" : "text-gray-600"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Password
                    </label>
                    <div className="relative">
                      <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${error ? "text-rose-400" : dark ? "text-gray-600" : "text-gray-400"}`}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                          <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        autoFocus
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (error) setError("");
                        }}
                        placeholder="Enter your password"
                        className={`${inputBase} pl-10 pr-11 ${error ? inputError : inputNormal}`}
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${dark ? "text-gray-600 hover:text-gray-400" : "text-gray-400 hover:text-gray-600"}`}
                      >
                        {showPassword ? (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {error && (
                      <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                          <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        {error}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
                          <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        Linking account…
                      </>
                    ) : (
                      "Link account & sign in"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    className={`w-full text-center text-xs transition-colors ${dark ? "text-gray-600 hover:text-gray-400" : "text-gray-400 hover:text-gray-600"}`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Cancel and go back to login
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
