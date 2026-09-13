import { useContext, useState } from "react";
import { DataContext } from "../Context/ContextApi";

const SECTIONS = [
  { id: "info-we-collect", number: "01", title: "Information We Collect" },
  { id: "how-we-use", number: "02", title: "How We Use Your Information" },
  { id: "auth-oauth", number: "03", title: "Sign-In & Authentication" },
  { id: "polls-votes", number: "04", title: "Polls, Votes & User Content" },
  { id: "anonymous-voting", number: "05", title: "Anonymous Voting" },
  { id: "payments", number: "06", title: "Payments & Subscriptions" },
  { id: "cookies", number: "07", title: "Cookies & Similar Technologies" },
  { id: "security", number: "08", title: "Data Security" },
  { id: "retention", number: "09", title: "Data Retention & Deletion" },
  { id: "third-party", number: "10", title: "Third-Party Services" },
  { id: "your-rights", number: "11", title: "Your Rights" },
  { id: "children", number: "12", title: "Children's Privacy" },
  { id: "changes", number: "13", title: "Changes to This Policy" },
  { id: "contact", number: "14", title: "Contact Us" },
];

const PrivacyPolicy = () => {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("PrivacyPolicy must be used within ContextApiProvider");
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
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className={`absolute left-1/2 top-[-160px] h-[420px] w-[700px] -translate-x-1/2 rounded-full blur-[120px] ${
            dark ? "bg-violet-600/10" : "bg-violet-400/10"
          }`}
        />
        <div
          className={`absolute right-[-150px] top-[35%] h-[350px] w-[350px] rounded-full blur-[120px] ${
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
              <path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <p className={`mt-5 text-xs font-bold uppercase tracking-[0.18em] ${dark ? "text-violet-400" : "text-violet-600"}`}>
            Legal
          </p>

          <h1
            className={`mt-3 text-4xl font-black tracking-tight sm:text-5xl ${dark ? "text-white" : "text-gray-950"}`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Privacy{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Policy</span>
          </h1>

          <p
            className={`mx-auto mt-5 max-w-2xl text-base leading-7 sm:text-lg ${dark ? "text-gray-400" : "text-gray-500"}`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Your privacy matters to us. This policy explains what information PulseHub collects, how we use it, and how we
            protect it when you create polls, vote, sign in, or subscribe to a paid plan.
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

          {/* Policy card */}
          <div>
            <div
              className={`overflow-hidden rounded-3xl border ${
                dark ? "border-white/[0.08] bg-white/[0.025]" : "border-gray-200 bg-white shadow-xl shadow-violet-900/[0.04]"
              }`}
            >
              <div className={`divide-y ${dark ? "divide-white/[0.06]" : "divide-gray-100"}`}>
                <PolicySection dark={dark} id="info-we-collect" number="01" title="Information We Collect">
                  <p>When you use PulseHub, we collect information you provide directly and information generated through your use of the platform.</p>
                  <p className="mt-4">This includes your name, email address, account credentials, poll titles and questions, your responses to polls, and any feedback you submit.</p>
                  <p className="mt-4">If you sign in with Google or GitHub, we receive your name, email address, and profile ID from that provider so we can create or link your account.</p>
                  <p className="mt-4">We also automatically collect limited technical information — IP address, browser and device type, and general usage patterns — to help secure and improve the service.</p>
                </PolicySection>

                <PolicySection dark={dark} id="how-we-use" number="02" title="How We Use Your Information">
                  <p>We use the information we collect to operate, maintain, and improve PulseHub, including to:</p>
                  <ul>
                    <li>Create, secure, and manage your account.</li>
                    <li>Let you create, publish, and manage polls.</li>
                    <li>Record votes and generate real-time results and analytics (e.g. response percentages per option).</li>
                    <li>Send account-related emails, such as email verification codes (OTP) and security alerts.</li>
                    <li>Process subscription payments and apply the correct plan limits to your account.</li>
                    <li>Detect abuse, spam, fraudulent voting, or security issues.</li>
                    <li>Improve the performance and reliability of the platform.</li>
                  </ul>
                </PolicySection>

                <PolicySection dark={dark} id="auth-oauth" number="03" title="Sign-In & Authentication">
                  <p>PulseHub supports signing in with an email and password, or with Google and GitHub.</p>
                  <p className="mt-4">When you sign up with email, we verify your email address using a one-time password (OTP) sent to your inbox, and store your password using industry-standard hashing — we never store your password in plain text.</p>
                  <p className="mt-4">When you sign in with Google or GitHub, we receive only the profile details those providers make available (typically your name, email, and a unique account ID) to identify or create your PulseHub account. We do not receive your Google or GitHub password.</p>
                  <p className="mt-4">You can link or disconnect Google and GitHub from your account at any time from Settings, as long as you have at least one other way to sign in.</p>
                  <p className="mt-4">Sessions are secured using short-lived access tokens and a longer-lived refresh token stored in an HTTP-only cookie, which cannot be accessed by client-side scripts.</p>
                </PolicySection>

                <PolicySection dark={dark} id="polls-votes" number="04" title="Polls, Votes & User Content">
                  <p>PulseHub is a real-time voting and feedback platform. When you create a poll, its title, description, questions, options, and settings (such as expiry date and response mode) are stored to provide the service.</p>
                  <p className="mt-4">When someone responds to a poll, we record their selected answers and, where applicable, associate the response with their account or an anonymous session (see "Anonymous Voting" below) so results can be tallied accurately and duplicate voting can be prevented.</p>
                  <p className="mt-4">Poll creators are responsible for the content of their polls and for ensuring their polls comply with applicable laws and our Terms of Service. Published poll results and response percentages may be visible to respondents depending on the poll creator's settings.</p>
                </PolicySection>

                <PolicySection dark={dark} id="anonymous-voting" number="05" title="Anonymous Voting">
                  <p>Some polls allow anonymous responses. For anonymous voters, PulseHub assigns a temporary anonymous session identifier (stored in your browser) instead of linking your response to a named account.</p>
                  <p className="mt-4">This identifier is used only to prevent duplicate voting on the same poll and does not, on its own, identify you personally.</p>
                </PolicySection>

                <PolicySection dark={dark} id="payments" number="06" title="Payments & Subscriptions">
                  <p>PulseHub offers optional paid plans (such as Pro and Premium) with higher limits and additional features. Payments for these plans are processed by our payment partner, Razorpay.</p>
                  <p className="mt-4">PulseHub does not store your complete card, UPI, or banking credentials on its own servers. Payment details are handled directly by Razorpay in accordance with its own security practices and PCI-DSS compliance standards. We only receive confirmation of payment status and the plan you subscribed to.</p>
                  <p className="mt-4">Billing information (such as plan tier, subscription start date, and renewal status) is stored so we can apply the correct usage limits to your account and manage renewals or cancellations.</p>
                </PolicySection>

                <PolicySection dark={dark} id="cookies" number="07" title="Cookies & Similar Technologies">
                  <p>PulseHub uses cookies and local storage to keep you signed in, remember an anonymous voting session, remember your theme preference, and understand how the platform is used.</p>
                  <p className="mt-4">You can control cookies through your browser settings. Disabling essential cookies may prevent you from staying signed in or voting on polls that require duplicate-vote protection.</p>
                </PolicySection>

                <PolicySection dark={dark} id="security" number="08" title="Data Security">
                  <p>We take reasonable technical and organizational measures to protect your information, including password hashing, HTTP-only cookies for session tokens, and access controls on our infrastructure.</p>
                  <p className="mt-4">However, no internet-based service can guarantee complete security. Please use a strong, unique password, enable Google or GitHub sign-in where convenient, and avoid sharing your account credentials with anyone.</p>
                </PolicySection>

                <PolicySection dark={dark} id="retention" number="09" title="Data Retention & Deletion">
                  <p>We retain your account information and poll data for as long as your account is active, or as needed to provide the service, comply with legal obligations, and resolve disputes.</p>
                  <p className="mt-4">You can update your profile details, disconnect linked accounts, or permanently delete your account and associated data at any time from Settings → Danger Zone. Deleting your account will remove your profile and, subject to applicable law, the polls you created.</p>
                </PolicySection>

                <PolicySection dark={dark} id="third-party" number="10" title="Third-Party Services">
                  <p>PulseHub relies on trusted third-party services for hosting, authentication (Google, GitHub), payments (Razorpay), and email delivery (for OTPs and account notifications).</p>
                  <p className="mt-4">These providers process information on our behalf under their own agreements and privacy policies, and only to the extent necessary to provide their service to PulseHub.</p>
                </PolicySection>

                <PolicySection dark={dark} id="your-rights" number="11" title="Your Rights">
                  <p>Depending on your location and applicable law, you may have rights relating to your personal information, including the right to access, correct, export, or delete your data, and to withdraw consent for optional processing.</p>
                  <p className="mt-4">You can exercise most of these rights directly from your Settings page, or contact us using the details in "Contact Us" below for anything that isn't self-serve yet.</p>
                </PolicySection>

                <PolicySection dark={dark} id="children" number="12" title="Children's Privacy">
                  <p>PulseHub is not intended for children under the age of 13 (or the minimum age required in your country), and we do not knowingly collect personal information from children where such collection is prohibited by applicable law.</p>
                  <p className="mt-4">If you believe a child has provided us with personal information, please contact us so we can review and remove it.</p>
                </PolicySection>

                <PolicySection dark={dark} id="changes" number="13" title="Changes to This Policy">
                  <p>We may update this Privacy Policy from time to time to reflect changes to our features, legal requirements, or data practices.</p>
                  <p className="mt-4">When we make material changes, we'll update the "Last updated" date at the top of this page and, where appropriate, notify you by email or an in-app notice.</p>
                </PolicySection>

                <PolicySection dark={dark} id="contact" number="14" title="Contact Us">
                  <p>If you have questions, concerns, or requests regarding this Privacy Policy or how PulseHub handles your information, please reach out through the Contact section of our website, or email us directly.</p>
                </PolicySection>
              </div>
            </div>

            {/* Bottom note */}
            <div
              className={`mt-6 rounded-2xl border px-5 py-4 text-center ${
                dark ? "border-violet-500/10 bg-violet-500/[0.035]" : "border-violet-100 bg-violet-50/60"
              }`}
            >
              <p className={`text-xs leading-5 ${dark ? "text-gray-500" : "text-gray-500"}`}>
                PulseHub is committed to keeping your information secure and being transparent about how your data is used.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface IPolicySectionProps {
  dark: boolean;
  id: string;
  number: string;
  title: string;
  children?: React.ReactNode;
}

const PolicySection = ({ dark, id, number, title, children }: IPolicySectionProps) => {
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

export default PrivacyPolicy;
