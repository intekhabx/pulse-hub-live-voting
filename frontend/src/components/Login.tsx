import { useContext, useState } from 'react';
import type { FormEvent } from "react";
import { DataContext } from '../Context/ContextApi';
import authService from '../services/authService';
import { Link, useNavigate } from '@tanstack/react-router'



interface LoginForm {
  email: string;
  password: string;
}

interface FieldError {
  email?: string;
  password?: string;
}

export default function Login() {
  const context = useContext(DataContext);
  if(!context){
    throw new Error("dark must be present in the DataContext Contexts");
  }
  const {dark} = context;

  const navigate = useNavigate();
  
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldError>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  
    const validate = (): boolean => {
      const newErrors: FieldError = {};
      if (!form.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        newErrors.email = "Enter a valid email address";
      }
      if (!form.password) {
        newErrors.password = "Password is required";
      } else if (form.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleChange = (field: keyof LoginForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  
    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      if (!validate()) return;
      // Simulate API call
      // await new Promise((r) => setTimeout(r, 1500));
      try {
        setLoading(true);
        await authService.login(form);
        setSuccess(true);
        // redirect uset to dashboard
        setTimeout(() => {
          navigate({to: "/dashboard"});
        }, 2000);
      } 
      catch (err: any) {
        console.error(err.message);
        console.log(err.response);
        console.log(err.response?.data)
        console.log(err.response?.data.message);
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
  
    return (
      <div
        className={`min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden ${
          dark ? "bg-[#0a0a12]" : "bg-[#f5f4ff]"
        }`}
      >
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]">
            <div className="absolute inset-0 rounded-full bg-violet-600/15 blur-[100px]" />
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-fuchsia-500/10 blur-[80px]" />
          </div>
          {/* Dot grid */}
          <svg className={`absolute inset-0 w-full h-full ${dark ? "opacity-[0.035]" : "opacity-[0.07]"}`}>
            <defs>
              <pattern id="login-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill={dark ? "white" : "black"} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#login-dots)" />
          </svg>
        </div>
  
        <div className="relative z-10 w-full max-w-md">
          {/* Card */}
          <div
            className={`rounded-2xl p-8 border shadow-2xl ${
              dark
                ? "bg-[#11111c] border-white/[0.07] shadow-black/60"
                : "bg-white border-gray-100 shadow-gray-200/80"
            }`}
          >
            {/* Logo mark */}
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
                Welcome back
              </h1>
              <p
                className={`text-sm mt-1 ${dark ? "text-gray-500" : "text-gray-400"}`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Sign in to your{" "}
                <span className="text-violet-500 font-semibold">PulseHub</span>{" "}
                account
              </p>
            </div>
  
            {/* Success state */}
            {success ? (
              <div className={`rounded-xl p-5 text-center border ${dark ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-200"}`}>
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className={`text-sm font-bold ${dark ? "text-emerald-300" : "text-emerald-700"}`} style={{ fontFamily: "'Syne', sans-serif" }}>
                  Login successful!
                </p>
                <p className={`text-xs mt-1 ${dark ? "text-emerald-500" : "text-emerald-600"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Redirecting to your dashboard…
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    className={`block text-xs font-semibold mb-1.5 ${dark ? "text-gray-400" : "text-gray-600"}`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
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
                  {errors.email && (
                    <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      {errors.email}
                    </p>
                  )}
                </div>
  
                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      className={`block text-xs font-semibold ${dark ? "text-gray-400" : "text-gray-600"}`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Password
                    </label>
                    <a
                      href="#"
                      className="text-xs text-violet-500 hover:text-violet-400 transition-colors font-medium"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Forgot password?
                    </a>
                  </div>
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
                      placeholder="••••••••"
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
                  {errors.password && (
                    <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      {errors.password}
                    </p>
                  )}
                </div>
  
                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
                        <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign In
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </button>

                {/* Server Error Message */}
                {serverError && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span style={{ fontFamily: "'DM Sans', sans-serif" }}>{serverError}</span>
                  </div>
                )}
  
                {/* Divider */}
                <div className="relative flex items-center gap-3">
                  <div className={`flex-1 h-px ${dark ? "bg-white/[0.07]" : "bg-gray-100"}`} />
                  <span className={`text-xs ${dark ? "text-gray-600" : "text-gray-400"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>or continue with</span>
                  <div className={`flex-1 h-px ${dark ? "bg-white/[0.07]" : "bg-gray-100"}`} />
                </div>
  
                {/* OAuth buttons */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      name: "Google",
                      icon: (
                        <svg width="16" height="16" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                      ),
                    },
                    {
                      name: "GitHub",
                      icon: (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                      ),
                    },
                  ].map(({ name, icon }) => (
                    <button
                      key={name}
                      type="button"
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                        dark
                          ? "bg-white/[0.03] border-white/[0.08] text-gray-300 hover:bg-white/[0.07] hover:border-white/[0.12]"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300"
                      }`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {icon}
                      {name}
                    </button>
                  ))}
                </div>
              </form>
            )}
  
            {/* Switch to register */}
            <p
              className={`text-center text-sm mt-6 ${dark ? "text-gray-600" : "text-gray-400"}`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-violet-500 hover:text-violet-400 font-semibold transition-colors"
              >
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }