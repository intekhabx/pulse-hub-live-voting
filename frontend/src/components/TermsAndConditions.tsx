import { useContext, useState } from "react";
import { DataContext } from "../Context/ContextApi";

const SECTIONS = [
  { id: "acceptance", number: "01", title: "Acceptance of Terms" },
  { id: "about", number: "02", title: "About PulseHub" },
  { id: "not-survey", number: "03", title: "Not a Survey Panel" },
  { id: "accounts", number: "04", title: "User Accounts" },
  { id: "creating-polls", number: "05", title: "Creating and Using Polls" },
  { id: "prohibited", number: "06", title: "Prohibited Activities" },
  { id: "fair-voting", number: "07", title: "Fair Voting" },
  { id: "plans", number: "08", title: "Subscription Plans" },
  { id: "payments", number: "09", title: "Payments" },
  { id: "refunds", number: "10", title: "Refunds and Cancellations" },
  { id: "ip", number: "11", title: "Intellectual Property" },
  { id: "user-content", number: "12", title: "User Content" },
  { id: "availability", number: "13", title: "Service Availability" },
  { id: "disclaimer", number: "14", title: "Disclaimer" },
  { id: "liability", number: "15", title: "Limitation of Liability" },
  { id: "termination", number: "16", title: "Suspension or Termination" },
  { id: "changes", number: "17", title: "Changes to These Terms" },
  { id: "contact", number: "18", title: "Contact Us" },
];

const TermsAndConditions = () => {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("TermsAndConditions must be used within ContextApiProvider");
  }

  const { dark } = context;
  const [activeId, setActiveId] = useState(SECTIONS[0].id);

  const scrollToSection = (id: string) => {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      className={`relative isolate min-h-screen py-20 sm:py-24 transition-colors duration-300 ${
        dark ? "bg-[#0d0d1a] text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className={`absolute left-1/2 top-[-160px] h-[420px] w-[700px] -translate-x-1/2 rounded-full blur-[120px] ${
            dark ? "bg-violet-600/10" : "bg-violet-400/10"
          }`}
        />
        <div
          className={`absolute right-[-150px] top-[40%] h-[350px] w-[350px] rounded-full blur-[120px] ${
            dark ? "bg-fuchsia-600/[0.06]" : "bg-fuchsia-400/[0.08]"
          }`}
        />
        <div className="absolute left-1/2 top-0 h-px w-[600px] max-w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div
            className={`mx-auto flex h-11 w-11 items-center justify-center rounded-xl border ${
              dark ? "border-violet-500/25 bg-violet-500/10 text-violet-400" : "border-violet-200 bg-violet-50 text-violet-600"
            }`}
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 3h12v18H6z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 7h6M9 11h6M9 15h4" strokeLinecap="round" />
            </svg>
          </div>

          <p className={`mt-5 text-xs font-bold uppercase tracking-[0.18em] ${dark ? "text-violet-400" : "text-violet-600"}`}>
            Legal
          </p>

          <h1
            className={`mt-3 text-4xl font-black tracking-tight sm:text-5xl ${dark ? "text-white" : "text-gray-950"}`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Terms &{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Conditions</span>
          </h1>

          <p
            className={`mx-auto mt-5 max-w-2xl text-base leading-7 sm:text-lg ${dark ? "text-gray-400" : "text-gray-500"}`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            These terms explain the rules and conditions that apply when you access or use PulseHub, our real-time polling
            and audience engagement software.
          </p>

          <p className={`mt-4 text-xs ${dark ? "text-gray-600" : "text-gray-400"}`}>Last updated: 2026</p>
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

          {/* Main card */}
          <div>
            <div
              className={`overflow-hidden rounded-3xl border ${
                dark ? "border-white/[0.08] bg-white/[0.025]" : "border-gray-200 bg-white shadow-xl shadow-violet-900/[0.04]"
              }`}
            >
              <div className={`divide-y ${dark ? "divide-white/[0.06]" : "divide-gray-100"}`}>
                <TermsSection dark={dark} id="acceptance" number="01" title="Acceptance of Terms">
                  <p>By accessing or using PulseHub, you agree to be bound by these Terms & Conditions and any applicable laws and regulations.</p>
                  <p className="mt-4">If you do not agree with these terms, please do not use the PulseHub platform.</p>
                </TermsSection>

                <TermsSection dark={dark} id="about" number="02" title="About PulseHub">
                  <p>PulseHub is a software-as-a-service (SaaS) platform that lets users create polls, share them with participants, collect votes in real time, and view live results and analytics.</p>
                  <p className="mt-4">PulseHub is commonly used for team decision-making, live events and Q&A, classroom polls, community feedback, and similar internal or public engagement use cases.</p>
                  <p className="mt-4">We may add, modify, or remove features from the platform from time to time to improve the service.</p>
                </TermsSection>

                <TermsSection dark={dark} id="not-survey" number="03" title="Not a Survey Panel">
                  <p>PulseHub is a self-service software tool, not a market research firm, survey panel, or paid-opinion service.</p>
                  <ul>
                    <li>PulseHub does not recruit respondents, does not pay, reward, or compensate anyone for submitting a response to a poll, and does not sell aggregated respondent data or opinions to third parties.</li>
                    <li>Poll creators bring their own audience (their team, customers, students, or community) — PulseHub does not supply respondents.</li>
                    <li>Customers pay PulseHub a subscription fee for use of the software; PulseHub does not pay individuals for their votes or opinions under any circumstances.</li>
                  </ul>
                </TermsSection>

                <TermsSection dark={dark} id="accounts" number="04" title="User Accounts">
                  <p>Some PulseHub features require you to create an account, either with an email and password (verified via a one-time code) or by signing in with Google or GitHub. You are responsible for providing accurate information and keeping your account credentials secure.</p>
                  <ul>
                    <li>You are responsible for activity under your account.</li>
                    <li>You should not share your password or authentication credentials with others.</li>
                    <li>You must notify us if you believe your account has been accessed without authorization.</li>
                  </ul>
                </TermsSection>

                <TermsSection dark={dark} id="creating-polls" number="05" title="Creating and Using Polls">
                  <p>PulseHub allows users to create polls and collect responses from other participants, either from authenticated accounts or, where enabled by the poll creator, anonymous respondents.</p>
                  <p className="mt-4">You are responsible for the content of polls, questions, options, descriptions, and other material you publish through the platform.</p>
                  <p className="mt-4">Polls must not be used to intentionally mislead, harass, threaten, impersonate, or harm other individuals.</p>
                </TermsSection>

                <TermsSection dark={dark} id="prohibited" number="06" title="Prohibited Activities">
                  <p>You agree not to use PulseHub for unlawful, abusive, or harmful activities.</p>
                  <ul>
                    <li>Attempting to gain unauthorized access to the platform or another user's account.</li>
                    <li>Uploading malicious code, malware, or other harmful content.</li>
                    <li>Using automated systems (bots) to abuse voting or platform functionality.</li>
                    <li>Manipulating poll results through fraudulent or deceptive activity.</li>
                    <li>Offering payment, rewards, or incentives to respondents in exchange for their votes or opinions.</li>
                    <li>Using PulseHub for content that violates applicable laws or regulations.</li>
                    <li>Attempting to disrupt or interfere with the operation of the service.</li>
                  </ul>
                </TermsSection>

                <TermsSection dark={dark} id="fair-voting" number="07" title="Fair Voting">
                  <p>PulseHub is designed to provide transparent and meaningful participation, with safeguards such as duplicate-vote prevention for both authenticated and anonymous respondents.</p>
                  <p className="mt-4">Users must not intentionally manipulate voting results, create fraudulent votes, or exploit technical vulnerabilities to influence a poll unfairly.</p>
                  <p className="mt-4">We reserve the right to investigate suspicious activity and take appropriate action where necessary.</p>
                </TermsSection>

                <TermsSection dark={dark} id="plans" number="08" title="Subscription Plans">
                  <p>PulseHub offers Free, Pro, and Premium subscription plans with different usage limits and features, including the number of polls and questions you can create, response limits per poll, advanced analytics (such as daily and hourly response trends), CSV export of poll data, custom branding, and priority support.</p>
                  <p className="mt-4">Current plan details and pricing are shown on our Pricing page and may be updated from time to time. Your plan determines the limits and features available to your account.</p>
                </TermsSection>

                <TermsSection dark={dark} id="payments" number="09" title="Payments">
                  <p>Paid plans are billed through our payment partner, Razorpay. By subscribing to a paid plan, you authorize PulseHub and Razorpay to charge the applicable subscription fee to your chosen payment method.</p>
                  <p className="mt-4">Payment processing is subject to Razorpay's own terms and security practices. PulseHub does not store your complete card, UPI, or banking credentials.</p>
                  <p className="mt-4">Pricing, billing periods, applicable taxes, and available plans are presented before a purchase is completed.</p>
                </TermsSection>

                <TermsSection dark={dark} id="refunds" number="10" title="Refunds and Cancellations">
                  <p>Refunds, cancellations, and subscription-related requests are handled according to the Refund & Cancellation Policy published by PulseHub.</p>
                  <p className="mt-4">Where applicable, users should review that policy before making a purchase. You may cancel your subscription at any time from Settings; cancellation will take effect at the end of your current billing period unless stated otherwise.</p>
                </TermsSection>

                <TermsSection dark={dark} id="ip" number="11" title="Intellectual Property">
                  <p>The PulseHub platform, including its software, design, branding, visual elements, logos, and original content, is owned by or licensed to PulseHub unless otherwise stated.</p>
                  <p className="mt-4">You may not copy, reproduce, modify, distribute, sell, or commercially exploit PulseHub's proprietary materials without appropriate authorization.</p>
                </TermsSection>

                <TermsSection dark={dark} id="user-content" number="12" title="User Content">
                  <p>You retain ownership of content that you submit to PulseHub (such as poll questions and options), subject to the rights necessary for us to operate the service.</p>
                  <p className="mt-4">By submitting content, you grant PulseHub permission to host, store, process, display, and transmit that content, and to compute and display aggregated results (such as vote counts and percentages), as reasonably necessary to provide the platform's functionality.</p>
                </TermsSection>

                <TermsSection dark={dark} id="availability" number="13" title="Service Availability">
                  <p>We aim to keep PulseHub available and reliable, but we do not guarantee that the service will always be uninterrupted, error-free, or available at all times.</p>
                  <p className="mt-4">Maintenance, technical problems, third-party service failures (including our hosting, authentication, or payment providers), security incidents, or circumstances beyond our reasonable control may temporarily affect availability.</p>
                </TermsSection>

                <TermsSection dark={dark} id="disclaimer" number="14" title="Disclaimer">
                  <p>PulseHub is provided on an "as available" and "as is" basis to the extent permitted by applicable law.</p>
                  <p className="mt-4">We do not guarantee that the information, poll results, or other content available through the platform will always be accurate, complete, or suitable for a particular purpose.</p>
                </TermsSection>

                <TermsSection dark={dark} id="liability" number="15" title="Limitation of Liability">
                  <p>To the maximum extent permitted by applicable law, PulseHub and its operators will not be liable for indirect, incidental, special, consequential, or business-related losses arising from your use of the platform.</p>
                  <p className="mt-4">Nothing in these terms is intended to exclude liability that cannot legally be excluded under applicable law.</p>
                </TermsSection>

                <TermsSection dark={dark} id="termination" number="16" title="Suspension or Termination">
                  <p>We may suspend or terminate access to PulseHub if we reasonably believe that a user has violated these terms, abused the platform, engaged in fraudulent activity, or created a security or legal risk.</p>
                  <p className="mt-4">Where appropriate, users may also choose to stop using the service or request account deletion from Settings → Danger Zone.</p>
                </TermsSection>

                <TermsSection dark={dark} id="changes" number="17" title="Changes to These Terms">
                  <p>We may update these Terms & Conditions when necessary to reflect changes to PulseHub, our services, or applicable legal requirements.</p>
                  <p className="mt-4">Updated terms will be published on this page along with a revised effective date. Continued use of PulseHub after changes are published may constitute acceptance of the updated terms, to the extent permitted by law.</p>
                </TermsSection>

                <TermsSection dark={dark} id="contact" number="18" title="Contact Us">
                  <p>If you have questions regarding these Terms & Conditions, please contact the PulseHub team through the Contact Us section of our website.</p>
                </TermsSection>
              </div>
            </div>

            {/* Bottom note */}
            <div
              className={`mt-6 rounded-2xl border px-5 py-4 text-center ${
                dark ? "border-violet-500/10 bg-violet-500/[0.035]" : "border-violet-100 bg-violet-50/60"
              }`}
            >
              <p className={`text-xs leading-5 ${dark ? "text-gray-500" : "text-gray-500"}`}>
                By using PulseHub, you acknowledge that you have read and agreed to these Terms & Conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface ITermsAndConditionsProps {
  dark: boolean;
  id: string;
  number: string;
  title: string;
  children?: React.ReactNode;
}

const TermsSection = ({ dark, id, number, title, children }: ITermsAndConditionsProps) => {
  return (
    <div id={id} className="scroll-mt-24 p-6 sm:p-8 lg:p-10">
      <div className="flex items-start gap-4 sm:gap-6">
        <span className={`hidden shrink-0 pt-1 text-xs font-bold tracking-widest sm:block ${dark ? "text-violet-400/70" : "text-violet-500"}`}>
          {number}
        </span>

        <div className="min-w-0 flex-1">
          <h2 className={`text-xl font-bold sm:text-2xl ${dark ? "text-white" : "text-gray-900"}`} style={{ fontFamily: "'Syne', sans-serif" }}>
            {title}
          </h2>

          <div
            className={`mt-4 text-sm leading-7 sm:text-[15px] [&_ul]:mt-3 [&_ul]:space-y-1.5 [&_ul]:list-disc [&_ul]:pl-5 ${
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

export default TermsAndConditions;
