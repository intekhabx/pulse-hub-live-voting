import { useContext, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { DataContext } from '../Context/ContextApi';
import authService from '../services/authService';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FieldError {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /\d/.test(password) },
    { label: "Special character", pass: /[^a-zA-Z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const colors = ["bg-rose-500", "bg-orange-400", "bg-amber-400", "bg-emerald-500"];
  const labels = ["Weak", "Fair", "Good", "Strong"];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full transition-all duration-300 ${
              i < score ? colors[score - 1] : "bg-gray-700/40"
            }`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {checks.map(({ label, pass }) => (
            <span
              key={label}
              className={`text-[10px] flex items-center gap-1 transition-colors ${
                pass ? "text-emerald-400" : "text-gray-600"
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                {pass ? (
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
                )}
              </svg>
              {label}
            </span>
          ))}
        </div>
        {score > 0 && (
          <span
            className={`text-[10px] font-bold ${colors[score - 1].replace("bg-", "text-")}`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {labels[score - 1]}
          </span>
        )}
      </div>
    </div>
  );
}

export function Register() {

  const context = useContext(DataContext);
  if(!context){
    throw new Error("dark must be present in the DataContext Contexts");
  }
  const {dark} = context;

  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterForm>({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    const [errors, setErrors] = useState<FieldError>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [serverError, setServerError] = useState("");

    const {next} = useSearch({from: "/register"});
  
    const validate = (): boolean => {
      const e: FieldError = {};
      if (!form.name.trim()) e.name = "Full name is required";
      else if (form.name.trim().length < 2) e.name = "Name must be at least 2 characters";
  
      if (!form.email.trim()) e.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
  
      if (!form.password) e.password = "Password is required";
      else if (form.password.length < 8) e.password = "Password must be at least 8 characters";
  
      if (!form.confirmPassword) e.confirmPassword = "Please confirm your password";
      else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
  
      setErrors(e);
      return Object.keys(e).length === 0;
    };
  
    const handleChange = (field: keyof RegisterForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  
    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      if (!validate()) return;
      if (!agreed) {
        alert("Please agree to the Terms of Service and Privacy Policy.");
        return;
      }
      // await new Promise((r) => setTimeout(r, 1600));
      try {
        setLoading(true);
        await authService.register(form);
        // console.log(res);
        setSuccess(true);
        // ✅ success ke baad login pe bhejo user ko
        setTimeout(() => {
          navigate({ to: next ? `/login?next=${encodeURIComponent(next)}` : '/login' });
        }, 2000);
      } 
      catch (err: any) {
        console.log(err.message)
        setServerError(err.response?.data?.message || "Something went wrong")
        setSuccess(false);
      }
      finally{
        setLoading(false);
      }
    };
  
    const inputBase = `w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 border ${
      dark
        ? "bg-white/[0.04] text-white placeholder-gray-600"
        : "bg-gray-50 text-gray-900 placeholder-gray-400"
    }`;
  
    const inputNormal = dark
      ? "border-white/[0.08] focus:border-violet-500/60 focus:bg-white/[0.06]"
      : "border-gray-200 focus:border-violet-400 focus:bg-white focus:shadow-sm focus:shadow-violet-100";
  
    const inputError = "border-rose-500/60 focus:border-rose-500";
  
    const ErrorMsg = ({ msg }: { msg?: string }) =>
      msg ? (
        <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {msg}
        </p>
      ) : null;
  
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
              <pattern id="reg-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill={dark ? "white" : "black"} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#reg-dots)" />
          </svg>
        </div>
  
        <div className="relative z-10 w-full max-w-md">
          <div
            className={`rounded-2xl p-8 border shadow-2xl ${
              dark
                ? "bg-[#11111c] border-white/[0.07] shadow-black/60"
                : "bg-white border-gray-100 shadow-gray-200/80"
            }`}
          >
            {/* Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative w-12 h-12 mb-4">
                <div className="absolute inset-0 rounded-[14px] bg-gradient-to-br from-violet-500 to-fuchsia-600 opacity-25 blur-lg" />
                <div className="relative w-12 h-12 rounded-[14px] bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-xl shadow-violet-500/30">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M3 12h3l3-8 4 16 3-8 3 4h2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <h1
                className={`text-2xl font-black tracking-tight ${dark ? "text-white" : "text-gray-900"}`}
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Create your account
              </h1>
              <p
                className={`text-sm mt-1 ${dark ? "text-gray-500" : "text-gray-400"}`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Join{" "}
                <span className="text-violet-500 font-semibold">PulseHub</span>{" "}
                — it's free forever
              </p>
            </div>
  
            {/* Success */}
            {success ? (
              <div className={`rounded-xl p-5 text-center border ${dark ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-200"}`}>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/30">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className={`text-base font-black ${dark ? "text-emerald-300" : "text-emerald-700"}`} style={{ fontFamily: "'Syne', sans-serif" }}>
                  Account created! 🎉
                </p>
                <p className={`text-sm mt-1 ${dark ? "text-emerald-500" : "text-emerald-600"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Welcome to PulseHub, {form.name.split(" ")[0]}! Redirecting to Login page
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-gray-400" : "text-gray-600"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Full name
                  </label>
                  <div className="relative">
                    <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${errors.name ? "text-rose-400" : dark ? "text-gray-600" : "text-gray-400"}`}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      value={form.name}
                      onChange={handleChange("name")}
                      placeholder="Alex Johnson"
                      className={`${inputBase} pl-10 ${errors.name ? inputError : inputNormal}`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                  </div>
                  <ErrorMsg msg={errors.name} />
                </div>
  
                {/* Email */}
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-gray-400" : "text-gray-600"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Email address
                  </label>
                  <div className="relative">
                    <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${errors.email ? "text-rose-400" : dark ? "text-gray-600" : "text-gray-400"}`}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={handleChange("email")}
                      placeholder="you@example.com"
                      className={`${inputBase} pl-10 ${errors.email ? inputError : inputNormal}`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                  </div>
                  <ErrorMsg msg={errors.email} />
                </div>
  
                {/* Password */}
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-gray-400" : "text-gray-600"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Password
                  </label>
                  <div className="relative">
                    <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${errors.password ? "text-rose-400" : dark ? "text-gray-600" : "text-gray-400"}`}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange("password")}
                      placeholder="Min. 8 characters"
                      className={`${inputBase} pl-10 pr-11 ${errors.password ? inputError : inputNormal}`}
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
                  <ErrorMsg msg={errors.password} />
                  <PasswordStrength password={form.password} />
                </div>
  
                {/* Confirm Password */}
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-gray-400" : "text-gray-600"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Confirm password
                  </label>
                  <div className="relative">
                    <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${errors.confirmPassword ? "text-rose-400" : form.confirmPassword && form.password === form.confirmPassword ? "text-emerald-400" : dark ? "text-gray-600" : "text-gray-400"}`}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        {form.confirmPassword && form.password === form.confirmPassword && (
                          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        )}
                      </svg>
                    </span>
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={handleChange("confirmPassword")}
                      placeholder="Re-enter your password"
                      className={`${inputBase} pl-10 pr-11 ${
                        errors.confirmPassword
                          ? inputError
                          : form.confirmPassword && form.password === form.confirmPassword
                          ? dark
                            ? "border-emerald-500/40 focus:border-emerald-500/60"
                            : "border-emerald-400 focus:border-emerald-500"
                          : inputNormal
                      }`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                      className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${dark ? "text-gray-600 hover:text-gray-400" : "text-gray-400 hover:text-gray-600"}`}
                    >
                      {showConfirm ? (
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
                  {form.confirmPassword && form.password === form.confirmPassword && !errors.confirmPassword && (
                    <p className="text-emerald-400 text-xs mt-1.5 flex items-center gap-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Passwords match
                    </p>
                  )}
                  <ErrorMsg msg={errors.confirmPassword} />
                </div>
  
                {/* Terms checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group mt-1">
                  <div
                    onClick={() => setAgreed((a) => !a)}
                    className={`flex-shrink-0 w-4.5 h-4.5 mt-0.5 rounded-md border transition-all duration-200 flex items-center justify-center ${
                      agreed
                        ? "bg-violet-600 border-violet-600 shadow-sm shadow-violet-500/30"
                        : dark
                        ? "border-white/20 bg-white/[0.03] hover:border-violet-500/50"
                        : "border-gray-300 bg-white hover:border-violet-400"
                    }`}
                    style={{ width: 18, height: 18 }}
                  >
                    {agreed && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-xs leading-relaxed ${dark ? "text-gray-500" : "text-gray-500"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    I agree to PulseHub's{" "}
                    <a href="#" className="text-violet-500 hover:text-violet-400 font-medium">Terms of Service</a>{" "}
                    and{" "}
                    <a href="#" className="text-violet-500 hover:text-violet-400 font-medium">Privacy Policy</a>
                  </span>
                </label>
  
                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 mt-2"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
                        <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Creating account…
                    </>
                  ) : (
                    <>
                      Create free account
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Server Error Message */}
            {serverError && (
              <div className="flex items-center gap-2 mt-4 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span style={{ fontFamily: "'DM Sans', sans-serif" }}>{serverError}</span>
              </div>
            )}
  
            {/* Switch to login */}
            <p className={`text-center text-sm mt-6 ${dark ? "text-gray-600" : "text-gray-400"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Already have an account?{" "}
              <Link
                to={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}
                className="text-violet-500 hover:text-violet-400 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }