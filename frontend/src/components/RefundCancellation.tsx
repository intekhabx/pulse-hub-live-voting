import { useContext, useState } from "react";
import { DataContext } from "../Context/ContextApi";
import { Icons } from "./Dashboard/Icons";

const SECTIONS = [
  { id: "general", number: "01", title: "General Policy" },
  { id: "cancellation", number: "02", title: "Cancellation Policy" },
  { id: "refund-eligibility", number: "03", title: "Refund Eligibility" },
  { id: "refund-window", number: "04", title: "Refund Request Window" },
  { id: "non-refundable", number: "05", title: "Non-Refundable Situations" },
  { id: "payment-processing", number: "06", title: "Payment Processing" },
  { id: "how-to-request", number: "07", title: "How to Request a Refund" },
  { id: "processing-time", number: "08", title: "Refund Processing Time" },
  { id: "changes", number: "09", title: "Changes to This Policy" },
  { id: "contact", number: "10", title: "Need Help?" },
];

const RefundCancellation = () => {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("RefundCancellation must be used within ContextApiProvider");
  }

  const { dark } = context;
  const [activeId, setActiveId] = useState(SECTIONS[0].id);

  const scrollToSection = (id: string) => {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      className={`relative min-h-screen py-20 sm:py-24 transition-colors duration-300 ${
        dark ? "bg-[#0d0d1a] text-white" : "bg-[#f8f7ff] text-gray-900"
      }`}
    >
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className={`absolute left-1/2 top-[-180px] h-[420px] w-[700px] -translate-x-1/2 rounded-full blur-[120px] ${
            dark ? "bg-violet-600/10" : "bg-violet-400/15"
          }`}
        />
        <div
          className={`absolute bottom-[-180px] right-[-120px] h-[400px] w-[400px] rounded-full blur-[120px] ${
            dark ? "bg-fuchsia-600/10" : "bg-fuchsia-400/10"
          }`}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div
            className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl border ${
              dark ? "border-violet-400/20 bg-violet-500/10 text-violet-400" : "border-violet-200 bg-violet-50 text-violet-600"
            }`}
          >
            {Icons.checkCircle}
          </div>

          <p className={`mt-5 text-sm font-semibold uppercase tracking-[0.18em] ${dark ? "text-violet-400" : "text-violet-600"}`}>
            Refund & Cancellation
          </p>

          <h1
            className={`mt-3 text-3xl font-black tracking-tight sm:text-4xl ${dark ? "text-white" : "text-gray-950"}`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Refund & Cancellation Policy
          </h1>

          <p
            className={`mx-auto mt-5 max-w-2xl text-base leading-7 ${dark ? "text-gray-400" : "text-gray-600"}`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            This policy explains how cancellations, refunds, and payment-related requests are handled for PulseHub's Free,
            Pro, and Premium subscription plans.
          </p>

          <p className={`mt-3 text-sm ${dark ? "text-gray-500" : "text-gray-500"}`}>Last updated: September 2026</p>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
          {/* Table of contents */}
          <nav className="hidden lg:block">
            <div className="sticky top-24 space-y-1">
              <p
                className={`text-[11px] font-bold uppercase tracking-widest mb-3 ${dark ? "text-gray-600" : "text-gray-400"}`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                On this page
              </p>
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className={`block w-full text-left rounded-lg px-3 py-1.5 text-xs transition-colors ${
                    activeId === s.id
                      ? dark
                        ? "bg-violet-500/10 text-violet-300 font-semibold"
                        : "bg-violet-50 text-violet-700 font-semibold"
                      : dark
                        ? "text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </nav>

          {/* Policy content */}
          <div className="space-y-6">
            <PolicyCard dark={dark} id="general" number="01" title="General Policy">
              <p>
                PulseHub provides an online polling, live voting, and feedback platform, billed through Free, Pro, and
                Premium subscription plans. Paid plans are billed monthly and processed through our payment partner,
                Razorpay.
              </p>
              <p className="mt-4">
                Because our paid plans grant immediate access to higher usage limits and features (such as more polls,
                advanced analytics, and CSV export), refunds are handled according to the specific terms below rather than
                issued automatically.
              </p>
            </PolicyCard>

            <PolicyCard dark={dark} id="cancellation" number="02" title="Cancellation Policy">
              <p>You may cancel your Pro or Premium subscription at any time from Settings → Current Plan.</p>
              <p className="mt-4">
                When you cancel, your plan remains active with its current features and limits until the end of the
                billing period you already paid for. You will not be charged again after that period ends, and your
                account will automatically move to the Free plan.
              </p>
              <p className="mt-4">Cancelling a subscription does not, by itself, generate a refund for a payment already processed — see "Refund Eligibility" below.</p>
            </PolicyCard>

            <PolicyCard dark={dark} id="refund-eligibility" number="03" title="Refund Eligibility">
              <p>Refund requests are considered in the following situations:</p>
              <ul>
                <li>A duplicate payment was accidentally processed for the same billing period.</li>
                <li>A payment was successfully charged, but the corresponding plan upgrade was not applied to your account due to a technical error on our end.</li>
                <li>You were charged an incorrect amount due to a pricing or billing error.</li>
                <li>Any other exceptional circumstance, verified by our support team on a case-by-case basis.</li>
              </ul>
              <p className="mt-5">Refunds under this section are issued at PulseHub's discretion after reviewing the specific transaction.</p>
            </PolicyCard>

            <PolicyCard dark={dark} id="refund-window" number="04" title="Refund Request Window">
              <p>
                Refund requests for an eligible issue (as listed above) must be submitted within <strong>7 days</strong> of
                the transaction date. Requests submitted after this window will not be eligible for a refund, except where
                required by applicable law.
              </p>
            </PolicyCard>

            <PolicyCard dark={dark} id="non-refundable" number="05" title="Non-Refundable Situations">
              <p>Refunds will generally not be provided when:</p>
              <ul>
                <li>You have used the higher plan's features or limits (e.g. created additional polls, exported analytics, or used advanced features) during the current billing period.</li>
                <li>The request is based only on a change of mind after subscribing, and none of the "Refund Eligibility" conditions apply.</li>
                <li>Your account or a specific poll was suspended due to a violation of our Terms & Conditions.</li>
                <li>The refund request is submitted after the 7-day window described above.</li>
              </ul>
            </PolicyCard>

            <PolicyCard dark={dark} id="payment-processing" number="06" title="Payment Processing">
              <p>
                Payments for PulseHub subscriptions are processed securely by Razorpay. PulseHub does not store your
                complete card, UPI, or banking credentials — this is handled entirely by Razorpay under its own security
                and compliance standards.
              </p>
              <p className="mt-4">Any payment authorization steps, retries, or failures are subject to Razorpay's own processes and policies.</p>
            </PolicyCard>

            <PolicyCard dark={dark} id="how-to-request" number="07" title="How to Request a Refund">
              <p>To request a refund, contact PulseHub support with the following information:</p>
              <ul>
                <li>Your registered email address.</li>
                <li>Transaction or payment reference ID (shown in your Razorpay payment receipt).</li>
                <li>Date and amount of the transaction.</li>
                <li>A brief explanation of the refund request.</li>
              </ul>
              <p className="mt-5">Once received, our team will review the transaction and may contact you if additional information is required.</p>
            </PolicyCard>

            <PolicyCard dark={dark} id="processing-time" number="08" title="Refund Processing Time">
              <p>
                If a refund is approved, we will initiate it to your original payment method within <strong>5 business
                days</strong>. The time for the refunded amount to actually reflect in your account depends on your bank
                or payment provider, and typically takes an additional 5–7 business days.
              </p>
            </PolicyCard>

            <PolicyCard dark={dark} id="changes" number="09" title="Changes to This Policy">
              <p>
                PulseHub may update this Refund & Cancellation Policy from time to time to reflect changes to our plans
                or applicable regulations. Any changes will be published on this page with an updated revision date.
              </p>
            </PolicyCard>

            {/* Contact */}
            <div
              id="contact"
              className={`scroll-mt-24 relative overflow-hidden rounded-3xl border p-7 sm:p-9 ${
                dark
                  ? "border-violet-400/15 bg-gradient-to-r from-violet-500/[0.07] via-indigo-500/[0.05] to-fuchsia-500/[0.07]"
                  : "border-violet-100 bg-gradient-to-r from-violet-50 via-indigo-50 to-fuchsia-50"
              }`}
            >
              <div className="relative">
                <h2 className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900"}`} style={{ fontFamily: "'Syne', sans-serif" }}>
                  Need Help?
                </h2>
                <p className={`mt-3 leading-7 ${dark ? "text-gray-400" : "text-gray-600"}`}>
                  If you have questions about a payment, cancellation, or refund request, please contact the PulseHub
                  support team.
                </p>
                <a
                  href="/#contact"
                  className="mt-5 inline-flex items-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-violet-500 hover:to-fuchsia-500"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface IPolicyCardProps {
  dark: boolean;
  id: string;
  number: string;
  title: string;
  children?: React.ReactNode;
}

const PolicyCard = ({ dark, id, number, title, children }: IPolicyCardProps) => {
  return (
    <div
      id={id}
      className={`scroll-mt-24 rounded-3xl border p-7 sm:p-9 ${
        dark ? "border-white/[0.08] bg-white/[0.035]" : "border-gray-200 bg-white shadow-sm"
      }`}
    >
      <div className="flex items-start gap-4">
        <span className={`hidden shrink-0 pt-1 text-xs font-bold tracking-widest sm:block ${dark ? "text-violet-400/70" : "text-violet-500"}`}>
          {number}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900"}`} style={{ fontFamily: "'Syne', sans-serif" }}>
            {title}
          </h2>
          <div
            className={`mt-4 leading-7 text-sm sm:text-[15px] [&_ul]:mt-4 [&_ul]:space-y-2 [&_ul]:list-disc [&_ul]:pl-5 ${
              dark ? "text-gray-400" : "text-gray-600"
            }`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundCancellation;
