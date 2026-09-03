import { useContext } from "react";
import { DataContext } from "../Context/ContextApi";

// ── Plan data ────────────────────────────────────────────────────────────
// Adjust the import path below to wherever SUBSCRIPTION_PLAN_DETAILS actually
// lives in your project (e.g. "../constants/subscriptionPlans").
export const SUBSCRIPTION_PLAN_DETAILS = {
  FREE: {
    price: 0,
    maxPolls: 5,
    maxActivePolls: 5,
    maxQuestionsPerPoll: 5,
    maxResponsesPerPoll: 100,
    advancedAnalytics: false,
    csvExport: false,
    removeBranding: false,
    customBranding: false,
    prioritySupport: false,
  },
  PRO: {
    price: 99,
    maxPolls: 50,
    maxActivePolls: 50,
    maxQuestionsPerPoll: 25,
    maxResponsesPerPoll: 2500,
    advancedAnalytics: true,
    csvExport: true,
    removeBranding: true,
    customBranding: false,
    prioritySupport: false,
  },
  PREMIUM: {
    price: 299,
    maxPolls: Infinity,
    maxActivePolls: Infinity,
    maxQuestionsPerPoll: Infinity,
    maxResponsesPerPoll: Infinity,
    advancedAnalytics: true,
    csvExport: true,
    removeBranding: true,
    customBranding: true,
    prioritySupport: true,
  },
} as const;

type PlanKey = keyof typeof SUBSCRIPTION_PLAN_DETAILS;

const fmt = (n: number) => (n === Infinity ? "Unlimited" : n.toLocaleString("en-IN"));

const PLAN_META: Record<PlanKey, { label: string; tagline: string; popular?: boolean }> = {
  FREE: { label: "Free", tagline: "Try PulseHub with no strings attached" },
  PRO: { label: "Pro", tagline: "For creators who poll their audience often", popular: true },
  PREMIUM: { label: "Premium", tagline: "Unlimited scale for teams and communities" },
};

function buildFeatureList(plan: (typeof SUBSCRIPTION_PLAN_DETAILS)[PlanKey]) {
  return [
    `${fmt(plan.maxPolls)} polls`,
    `${fmt(plan.maxQuestionsPerPoll)} questions per poll`,
    `${fmt(plan.maxResponsesPerPoll)} responses per poll`,
    { label: "Advanced analytics", on: plan.advancedAnalytics },
    { label: "CSV export", on: plan.csvExport },
    { label: "Remove PulseHub branding", on: plan.removeBranding },
    { label: "Custom branding", on: plan.customBranding },
    { label: "Priority support", on: plan.prioritySupport },
  ];
}

export function Pricing() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("dark must be present in the DataContext Contexts");
  }
  const { dark } = context;

  const planKeys = Object.keys(SUBSCRIPTION_PLAN_DETAILS) as PlanKey[];

  return (
    <section
      className={`relative overflow-hidden px-4 py-20 sm:py-28 transition-colors duration-300 ${
        dark ? "bg-[#0a0a12] text-white" : "bg-[#f7f6ff] text-gray-950"
      }`}
    >
      {/* Background treatment shared with the rest of the app */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`absolute left-1/2 top-[-15rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full blur-[120px] ${
            dark ? "bg-violet-600/15" : "bg-violet-400/20"
          }`}
        />
        <div
          className={`absolute right-[-8rem] top-1/3 h-72 w-72 rounded-full blur-[100px] ${
            dark ? "bg-fuchsia-500/10" : "bg-fuchsia-400/15"
          }`}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-xl text-center mb-14 sm:mb-16">
          <h1
            className={`text-3xl sm:text-4xl font-black tracking-tight ${dark ? "text-white" : "text-gray-950"}`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Pick the plan that fits your polls
          </h1>
          <p className={`mt-3 text-sm sm:text-base ${dark ? "text-gray-500" : "text-gray-600"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Start free, upgrade when your audience grows. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {planKeys.map((key) => {
            const plan = SUBSCRIPTION_PLAN_DETAILS[key];
            const meta = PLAN_META[key];
            const features = buildFeatureList(plan);

            return (
              <div
                key={key}
                className={`relative rounded-3xl border p-7 sm:p-8 transition-all duration-300 ${
                  meta.popular
                    ? dark
                      ? "border-violet-500/40 bg-gradient-to-b from-violet-500/[0.08] to-transparent shadow-2xl shadow-violet-500/20 md:-translate-y-3"
                      : "border-violet-300 bg-white shadow-2xl shadow-violet-200/70 md:-translate-y-3"
                    : dark
                      ? "border-white/[0.08] bg-[#11111c] hover:border-white/[0.14]"
                      : "border-gray-100 bg-white hover:shadow-lg hover:shadow-gray-200/60"
                }`}
              >
                {meta.popular && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-1 text-[11px] font-bold text-white shadow-lg shadow-violet-500/30"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Most popular
                  </span>
                )}

                <h2 className={`text-lg font-bold ${dark ? "text-white" : "text-gray-900"}`} style={{ fontFamily: "'Syne', sans-serif" }}>
                  {meta.label}
                </h2>
                <p className={`mt-1 text-sm ${dark ? "text-gray-500" : "text-gray-500"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {meta.tagline}
                </p>

                <div className="mt-6 flex items-baseline gap-1.5">
                  <span
                    className={`text-4xl font-black tracking-tight ${dark ? "text-white" : "text-gray-950"}`}
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {plan.price === 0 ? "Free" : `₹${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className={`text-sm ${dark ? "text-gray-600" : "text-gray-400"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      / month
                    </span>
                  )}
                </div>

                <button
                  className={`mt-7 w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                    meta.popular
                      ? "text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5"
                      : dark
                        ? "text-gray-200 bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.09]"
                        : "text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100"
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {plan.price === 0 ? "Start for free" : `Get ${meta.label}`}
                </button>

                <ul className="mt-7 space-y-3">
                  {features.map((f, i) => {
                    const isBoolFeature = typeof f === "object";
                    const label = isBoolFeature ? f.label : f;
                    const enabled = isBoolFeature ? f.on : true;

                    return (
                      <li key={i} className="flex items-start gap-2.5">
                        <span
                          className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full ${
                            enabled
                              ? "bg-emerald-500/15 text-emerald-400"
                              : dark
                                ? "bg-white/[0.04] text-gray-700"
                                : "bg-gray-100 text-gray-300"
                          }`}
                        >
                          {enabled ? (
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : (
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                          )}
                        </span>
                        <span
                          className={`text-sm ${
                            enabled ? (dark ? "text-gray-300" : "text-gray-700") : dark ? "text-gray-600" : "text-gray-400"
                          }`}
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        <p className={`mt-10 text-center text-xs ${dark ? "text-gray-600" : "text-gray-500"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Prices in INR. Upgrade, downgrade, or cancel your plan anytime from Settings.
        </p>
      </div>
    </section>
  );
}
