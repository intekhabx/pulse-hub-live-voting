import { useEffect, useState } from "react";
import type { IPlanDetails } from "../../types";
import subscriptionService from "../../services/subscriptionService";



const cardCls = "rounded-2xl border border-white/[0.07] bg-[#13131f] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.2)]";
const gradientBtn = "px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 cursor-pointer";


interface PlanDetailsProps {
  plan: "FREE" | "PRO" | "PREMIUM",
}


function PlanDetails({plan}: PlanDetailsProps) {

  const [planDetailsData, setPlanDetailsData] = useState<IPlanDetails>();

  const getUserPlanDetails = async(plan: "FREE" | "PRO" | "PREMIUM") => {
    try {
      const res = await subscriptionService.getUserPlanDetails(plan);
      setPlanDetailsData(res.data);
    }
    catch (error: any) {
      console.log(error.response);
    }
  }

  useEffect(() => {
    getUserPlanDetails(plan);
  }, []);

  return (
    <>
      <div className={`w-full md:grid md:grid-cols-2 md:gap-10 ${cardCls}`}>
        <div>
          {/* ==================== HEADER ==================== */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Plan Icon */}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-inner ${
                  plan === "FREE"
                    ? "border-slate-400/10 bg-slate-400/[0.06] text-slate-300"
                    : plan === "PRO"
                    ? "border-violet-500/20 bg-violet-500/[0.08] text-violet-400"
                    : "border-amber-400/20 bg-amber-400/[0.08] text-amber-300"
                }`}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M3 10h18" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>

              <div>
                <h2 className="text-base font-bold text-white">
                  Current Plan
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  You're on the{" "}
                  <span className={`font-semibold ${plan === "FREE" ? "text-slate-300" : plan === "PRO" ? "text-violet-400" : "text-amber-400"}`}>
                    {plan ? plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase() : "Free"}
                  </span>{" "}
                  plan
                </p>
              </div>
            </div>

            {/* Upgrade Button */}
            {plan !== "PREMIUM" && (
              <button
                type="button"
                className={gradientBtn}
              >
                {plan === "FREE"
                  ? "Upgrade to Pro"
                  : "Upgrade to Premium"}{" "}
                →
              </button>
            )}
          </div>

          {/* ==================== PLAN LIMITS ==================== */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              {
                label: "Polls",
                value: planDetailsData?.maxPolls,
              },
              {
                label: "Active Polls",
                value: planDetailsData?.maxActivePolls,
              },
              {
                label: "Questions / Poll",
                value: planDetailsData?.maxQuestionsPerPoll,
              },
              {
                label: "Responses / Poll",
                value: planDetailsData?.maxResponsesPerPoll,
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className={`group relative overflow-hidden rounded-xl border p-3 text-center transition-all duration-300 ${
                  plan === "FREE"
                    ? "border-white/[0.06] bg-slate-400/[0.025] hover:border-slate-300/15 hover:bg-slate-400/[0.05]"
                    : plan === "PRO"
                    ? "border-violet-500/[0.10] bg-violet-500/[0.035] hover:border-violet-500/25 hover:bg-violet-500/[0.07]"
                    : "border-amber-400/[0.10] bg-amber-500/[0.035] hover:border-amber-400/25 hover:bg-amber-500/[0.07]"
                }`}
              >
                {/* Top Glow */}
                <div
                  className={`absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                    plan === "FREE"
                      ? "bg-gradient-to-r from-transparent via-slate-300/40 to-transparent"
                      : plan === "PRO"
                      ? "bg-gradient-to-r from-transparent via-violet-400/60 to-transparent"
                      : "bg-gradient-to-r from-transparent via-amber-300/60 to-transparent"
                  }`}
                />

                <p
                  className={`text-xl font-extrabold ${
                    plan === "FREE"
                      ? "text-slate-200"
                      : plan === "PRO"
                      ? "text-violet-200"
                      : "text-amber-200"
                  }`}
                >
                  {String(value).toLowerCase() === "unlimited"
                    ? "∞"
                    : value ?? 0}
                </p>

                <p className="mt-1 text-[11px] font-medium tracking-tight text-gray-400">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* ==================== INCLUDED FEATURES ==================== */}
          <div
            className={`mt-5 border-t pt-4 ${
              plan === "FREE"
                ? "border-white/[0.06]"
                : plan === "PRO"
                ? "border-violet-500/[0.12]"
                : "border-amber-400/[0.12]"
            }`}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Included with your plan
              </p>

              <span
                className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                  plan === "FREE"
                    ? "border-slate-300/10 bg-slate-400/[0.06] text-slate-300"
                    : plan === "PRO"
                    ? "border-violet-500/20 bg-violet-500/10 text-violet-300"
                    : "border-amber-500/20 bg-amber-500/10 text-amber-300"
                }`}
              >
                {plan === "FREE"
                  ? "Lifetime"
                  : `₹${planDetailsData?.price ?? 0} / month`}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                ["Advanced Analytics", planDetailsData?.advancedAnalytics],
                ["CSV Export", planDetailsData?.csvExport],
                ["Remove Branding", planDetailsData?.removeBranding],
                ["Custom Branding", planDetailsData?.customBranding],
                ["Priority Support", planDetailsData?.prioritySupport],
              ]
                .filter(([, enabled]) => Boolean(enabled))
                .map(([featureLabel]) => (
                  <span
                    key={String(featureLabel)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-medium ${
                      plan === "FREE"
                        ? "border-slate-400/10 bg-slate-400/[0.05] text-slate-300"
                        : plan === "PRO"
                        ? "border-violet-500/15 bg-violet-500/[0.08] text-violet-300"
                        : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                    }`}
                  >
                    <span
                      className={`font-bold ${
                        plan === "FREE"
                          ? "text-slate-400"
                          : plan === "PRO"
                          ? "text-violet-400"
                          : "text-emerald-400"
                      }`}
                    >
                      ✓
                    </span>

                    {featureLabel}
                  </span>
                ))}
            </div>
          </div>
        </div>

        <div>
          {/* ========================================================= */}
          {/* Star - PLAN DETAILS */}
          {/* ========================================================= */}

          {plan === "FREE" && (
            <div className="relative mt-5 overflow-hidden rounded-2xl border border-slate-400/10 bg-gradient-to-br from-slate-400/[0.06] via-white/[0.02] to-slate-500/[0.04] p-4">
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-slate-300/[0.05] blur-3xl" />

              <div className="relative">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-300/10 bg-slate-400/[0.08]">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="text-slate-300"
                        >
                          <path
                            d="M12 3l2.7 5.47L21 9.39l-4.5 4.38 1.06 6.19L12 17.05l-5.56 2.91L7.5 13.77 3 9.39l6.3-.92L12 3z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>

                      <h3 className="text-sm font-bold text-white">
                        Free Plan
                      </h3>
                    </div>

                    <p className="mt-1 text-[11px] text-gray-500">
                      A simple way to get started with polling.
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full border border-slate-300/10 bg-slate-300/[0.05] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Starter
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {[
                    "Create polls",
                    "Collect responses",
                    "Basic poll management",
                    "Lifetime access",
                  ].map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2.5 rounded-xl border border-white/[0.05] bg-black/[0.08] p-2.5"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-400/[0.08] text-[10px] font-bold text-slate-300">
                        ✓
                      </span>

                      <p className="text-xs font-medium text-gray-300">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Mobile = bottom/full width
                    Desktop = right side */}
                <div className="mt-4 flex w-full items-center justify-between rounded-xl border border-white/[0.05] bg-black/[0.08] px-3 py-2.5 md:ml-auto md:w-[48%]">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-600">
                      Billing
                    </p>

                    <p className="mt-0.5 text-xs font-semibold text-slate-300">
                      No payment required
                    </p>
                  </div>

                  <span className="text-sm font-bold text-white">
                    Free
                  </span>
                </div>
              </div>
            </div>
          )}

          {plan === "PRO" && (
            <div className="relative mt-5 overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/[0.10] via-white/[0.025] to-purple-500/[0.07] p-4 shadow-lg shadow-violet-500/[0.06]">
              <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />

              <div className="relative">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="text-violet-300"
                        >
                          <path
                            d="M12 3l2.7 5.47L21 9.39l-4.5 4.38 1.06 6.19L12 17.05l-5.56 2.91L7.5 13.77 3 9.39l6.3-.92L12 3z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>

                      <h3 className="text-sm font-bold text-white">
                        Pro Benefits
                      </h3>
                    </div>

                    <p className="mt-1 text-[11px] text-gray-400">
                      More power, insights and flexibility for growing
                      creators.
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full border border-violet-400/20 bg-violet-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-300">
                    Pro
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {[
                    {
                      title: "Advanced Analytics",
                      desc: "Understand your audience with deeper insights.",
                    },
                    {
                      title: "CSV Export",
                      desc: "Download your poll responses for analysis.",
                    },
                    {
                      title: "Remove Branding",
                      desc: "Create cleaner polls without platform branding.",
                    },
                    {
                      title: "Higher Limits",
                      desc: "Create more polls and collect more responses.",
                    },
                  ].map(({ title, desc }) => (
                    <div
                      key={title}
                      className="group flex items-start gap-2.5 rounded-xl border border-white/[0.06] bg-black/10 p-3 transition-all duration-200 hover:border-violet-400/20 hover:bg-violet-500/[0.04]"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-violet-500/20 bg-violet-500/10 text-[10px] font-bold text-violet-300">
                        ✓
                      </span>

                      <div>
                        <p className="text-xs font-semibold text-gray-200 group-hover:text-white">
                          {title}
                        </p>

                        <p className="mt-0.5 text-[10px] leading-relaxed text-gray-500">
                          {desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile = bottom
                    Desktop = right */}
                <div className="mt-4 flex w-full items-center justify-between rounded-xl border border-violet-400/10 bg-violet-400/[0.04] px-3 py-2.5 md:ml-auto md:w-[48%]">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500">
                      Your subscription
                    </p>

                    <p className="mt-0.5 text-xs font-semibold text-violet-300">
                      Pro Active
                    </p>
                  </div>

                  <p className="text-sm font-bold text-white">
                    ₹{planDetailsData?.price ?? 0}
                    <span className="text-[10px] font-medium text-gray-500">
                      {" "}
                      / month
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {plan === "PREMIUM" && (
            <div className="relative mt-5 overflow-hidden rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-500/[0.10] via-white/[0.03] to-violet-500/[0.08] p-4 shadow-lg shadow-amber-500/5">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-400/10 blur-3xl" />

              <div className="relative">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-400/20 bg-amber-400/10">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="text-amber-300"
                        >
                          <path
                            d="M12 3l2.7 5.47L21 9.39l-4.5 4.38 1.06 6.19L12 17.05l-5.56 2.91L7.5 13.77 3 9.39l6.3-.92L12 3z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>

                      <h3 className="text-sm font-bold text-white">
                        Premium Benefits
                      </h3>
                    </div>

                    <p className="mt-1 text-[11px] text-gray-400">
                      Everything you need for advanced polling.
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    Premium
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {[
                    {
                      title: "Unlimited Polls",
                      desc: "Create as many polls as you need.",
                    },
                    {
                      title: "Advanced Analytics",
                      desc: "Get deeper insights into your responses.",
                    },
                    {
                      title: "Custom Branding",
                      desc: "Make your polls match your brand identity.",
                    },
                    {
                      title: "CSV Export",
                      desc: "Export your polling data anytime.",
                    },
                    {
                      title: "Remove Branding",
                      desc: "Keep your polls completely white-label.",
                    },
                    {
                      title: "Priority Support",
                      desc: "Get faster help whenever you need it.",
                    },
                  ].map(({ title, desc }) => (
                    <div
                      key={title}
                      className="group flex items-start gap-2.5 rounded-xl border border-white/[0.06] bg-black/10 p-3 transition-all duration-200 hover:border-amber-400/20 hover:bg-white/[0.04]"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-[10px] font-bold text-emerald-300">
                        ✓
                      </span>

                      <div>
                        <p className="text-xs font-semibold text-gray-200 group-hover:text-white">
                          {title}
                        </p>

                        <p className="mt-0.5 text-[10px] leading-relaxed text-gray-500">
                          {desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile = bottom/full width
                    Desktop = right side */}
                <div className="mt-4 flex w-full items-center justify-between rounded-xl border border-amber-400/10 bg-amber-400/[0.04] px-3 py-2.5 md:ml-auto md:w-[48%]">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500">
                      Your subscription
                    </p>

                    <p className="mt-0.5 text-xs font-semibold text-amber-300">
                      Premium Active
                    </p>
                  </div>

                  <p className="text-sm font-bold text-white">
                    ₹{planDetailsData?.price ?? 0}
                    <span className="text-[10px] font-medium text-gray-500">
                      {" "}
                      / month
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default PlanDetails;
