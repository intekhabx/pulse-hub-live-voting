import { useState, useContext } from "react";
import { Icons } from "./Dashboard/Icons";
import { DataContext } from "../Context/ContextApi";
import messageService from "../services/messageService";

const Contact = () => {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("Contact must be used within ContextApiProvider");
  }

  const { dark } = context;

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (status === "error") setStatus("idle");
  };


  const validateForm = () => {
    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const trimmedSubject = form.subject.trim();
    const trimmedMessage = form.message.trim();

    // Name Validation
    if (!trimmedName) return "Name is required.";
    if (trimmedName.length < 2 || trimmedName.length > 95)
      return "Name must be between 2 and 95 characters.";

    // Email Validation
    if (!trimmedEmail) return "Email is required.";
    if (trimmedEmail.length > 322)
      return "Email must be less than 322 characters.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail))
      return "Please enter a valid email address.";

    // Subject Validation
    if (!trimmedSubject) return "Subject is required.";
    if (trimmedSubject.length < 5 || trimmedSubject.length > 150)
      return "Subject must be between 5 and 150 characters.";

    // Message Validation
    if (!trimmedMessage) return "Message is required.";
    if (trimmedMessage.length < 10 || trimmedMessage.length > 1000)
      return "Message must be between 10 and 1000 characters.";

    return null;
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      setStatus("error");
      return;
    }

    try {
      setLoading(true);
      const {name, email, subject, message} = form;

      await messageService.sendMessage({name, email, subject, message});

      setStatus("success");
    } 
    catch (err: any) {
      console.error("Form submission failed:", err.response?.data?.message);
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
    finally{
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ name: "", email: "", subject: "", message: "" });
    setStatus("idle");
    setErrorMessage("");
  };

  return (
    <main
      id="contact"
      className={`min-h-screen transition-colors duration-300 ${
        dark ? "bg-[#09090b] text-white" : "bg-[#f8fafc] text-slate-900"
      }`}
    >
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className={`pointer-events-none absolute left-1/2 top-0 h-[420px] w-[700px] -translate-x-1/2 rounded-full blur-3xl ${
            dark ? "bg-violet-600/10" : "bg-violet-500/10"
          }`}
        />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-6 lg:px-8 lg:pb-20 lg:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div
              className={`mx-auto mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${
                dark
                  ? "border-white/10 bg-white/[0.04] text-slate-300"
                  : "border-slate-200 bg-white text-slate-600 shadow-sm"
              }`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full ${
                  dark
                    ? "bg-violet-500/10 text-violet-400"
                    : "bg-violet-50 text-violet-600"
                }`}
              >
                {Icons.mail}
              </span>
              <span>Contact PulseHub</span>
            </div>

            {/* Heading */}
            <h2
              className={`text-4xl sm:text-5xl font-black tracking-tight leading-tight ${
                dark ? "text-white" : "text-gray-950"
              }`}
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Have questions?
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                We're here to help.
              </span>
            </h2>

            {/* Description */}
            <p
              className={`mt-4 text-base mx-auto leading-7 ${
                dark ? "text-gray-400" : "text-gray-500"
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Contact PulseHub for help with polls, your account, subscription
              plans, or any questions about our platform. We'd be happy to hear
              from you.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="pb-20 sm:pb-24 lg:pb-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
            {/* LEFT */}
            <div className="pt-2 lg:pt-8">
              <span
                className={`text-xs font-bold tracking-[0.2em] ${
                  dark ? "text-violet-400" : "text-violet-600"
                }`}
              >
                GET IN TOUCH
              </span>

              <h2
                className={`mt-4 text-3xl font-bold tracking-tight sm:text-4xl ${
                  dark ? "text-white" : "text-slate-950"
                }`}
              >
                Let's make
                <span className="block bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
                  polling easier.
                </span>
              </h2>

              <p
                className={`mt-5 max-w-md text-base leading-7 ${
                  dark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Whether you need help to creating a poll, managing responses,
                or understanding your subscription, we're here to assist.
              </p>

              {/* Email */}
              <div
                className={`mt-9 flex items-center gap-4 rounded-2xl border p-4 ${
                  dark
                    ? "border-white/[0.08] bg-white/[0.03]"
                    : "border-slate-200 bg-white shadow-sm"
                }`}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                    dark
                      ? "bg-violet-500/10 text-violet-400"
                      : "bg-violet-50 text-violet-600"
                  }`}
                >
                  {Icons.mail}
                </div>

                <div className="min-w-0">
                  <span
                    className={`block text-xs font-semibold uppercase tracking-wider ${
                      dark ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    Email support
                  </span>

                  <a
                    href="mailto:smartilixiousintekhab0786@gmail.com"
                    className={`mt-1 block break-all text-sm font-semibold transition-colors ${
                      dark
                        ? "text-slate-200 hover:text-violet-400"
                        : "text-slate-800 hover:text-violet-600"
                    }`}
                  >
                    smartilixiousintekhab0786@gmail.com
                  </a>
                </div>
              </div>

              {/* Support note */}
              <div
                className={`mt-4 flex gap-4 rounded-2xl border p-5 ${
                  dark
                    ? "border-emerald-500/10 bg-emerald-500/[0.04]"
                    : "border-emerald-100 bg-emerald-50/60"
                }`}
              >
                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    dark
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-emerald-100 text-emerald-600"
                  }`}
                >
                  {Icons.checkCircle}
                </div>

                <div>
                  <strong
                    className={`block text-sm font-semibold ${
                      dark ? "text-slate-200" : "text-slate-800"
                    }`}
                  >
                    We're ready to listen
                  </strong>

                  <p
                    className={`mt-1 text-sm leading-6 ${
                      dark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Send us your question or feedback by email, and we'll review
                    your message and respond as soon as we can.
                  </p>
                </div>
              </div>
            </div>

            {/* FORM CARD */}
            <div
              className={`relative min-h-[480px] overflow-hidden rounded-3xl border p-6 sm:p-8 flex flex-col justify-center ${
                dark
                  ? "border-white/[0.08] bg-[#111113] shadow-2xl shadow-black/20"
                  : "border-slate-200 bg-white shadow-xl shadow-slate-200/40"
              }`}
            >
              {/* Card glow */}
              <div
                className={`pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full blur-3xl ${
                  dark ? "bg-violet-600/10" : "bg-violet-500/5"
                }`}
              />

              <div className="relative w-full">
                {status === "success" ? (
                  /* SUCCESS STATE DISPLAY (CENTERED) */
                  <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-full mb-4 ${
                        dark
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-emerald-100 text-emerald-600"
                      }`}
                    >
                      {Icons.checkCircle}
                    </div>

                    <h3
                      className={`text-2xl font-bold ${
                        dark ? "text-white" : "text-slate-950"
                      }`}
                    >
                      Message Sent Successfully!
                    </h3>

                    <p
                      className={`mt-2 max-w-md text-sm leading-6 ${
                        dark ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      Thank you for contacting PulseHub. We have received your
                      message and will get back to you as soon as possible.
                    </p>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/30 transition-all hover:from-violet-500 hover:to-fuchsia-500 hover:shadow-violet-500/50 active:scale-[0.99]"
                    >
                      <span>Send another response</span>
                      <span>{Icons.arrowRight}</span>
                    </button>
                  </div>
                ) : (
                  /* REGULAR FORM STATE */
                  <>
                    <span
                      className={`text-xs font-bold tracking-[0.2em] ${
                        dark ? "text-violet-400" : "text-violet-600"
                      }`}
                    >
                      CONTACT SUPPORT
                    </span>

                    <h3
                      className={`mt-2 text-2xl font-bold ${
                        dark ? "text-white" : "text-slate-950"
                      }`}
                    >
                      Send us a message
                    </h3>

                    <p
                      className={`mt-2 text-sm leading-6 ${
                        dark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Have a question, suggestion, or need assistance? Tell us
                      how we can help.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                      {/* Name + Email */}
                      <div className="grid gap-5 sm:grid-cols-2">
                        {/* Name */}
                        <div>
                          <label
                            htmlFor="name"
                            className={`mb-2 block text-sm font-medium ${
                              dark ? "text-slate-300" : "text-slate-700"
                            }`}
                          >
                            Full name *
                          </label>

                          <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={handleChange}
                            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-500 ${
                              dark
                                ? "border-white/[0.08] bg-white/[0.03] text-white focus:border-violet-500/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-violet-500/10"
                                : "border-slate-200 bg-slate-50 text-slate-900 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                            }`}
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label
                            htmlFor="email"
                            className={`mb-2 block text-sm font-medium ${
                              dark ? "text-slate-300" : "text-slate-700"
                            }`}
                          >
                            Email address *
                          </label>

                          <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-500 ${
                              dark
                                ? "border-white/[0.08] bg-white/[0.03] text-white focus:border-violet-500/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-violet-500/10"
                                : "border-slate-200 bg-slate-50 text-slate-900 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <label
                          htmlFor="subject"
                          className={`mb-2 block text-sm font-medium ${
                            dark ? "text-slate-300" : "text-slate-700"
                          }`}
                        >
                          Subject *
                        </label>

                        <input
                          id="subject"
                          name="subject"
                          type="text"
                          placeholder="How can we assist you?"
                          value={form.subject}
                          onChange={handleChange}
                          className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-500 ${
                            dark
                              ? "border-white/[0.08] bg-white/[0.03] text-white focus:border-violet-500/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-violet-500/10"
                              : "border-slate-200 bg-slate-50 text-slate-900 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                          }`}
                        />
                      </div>

                      {/* Message */}
                      <div>
                        <label
                          htmlFor="message"
                          className={`mb-2 block text-sm font-medium ${
                            dark ? "text-slate-300" : "text-slate-700"
                          }`}
                        >
                          Message *
                        </label>

                        <textarea
                          id="message"
                          name="message"
                          rows={6}
                          placeholder="Describe your question or concern..."
                          value={form.message}
                          onChange={handleChange}
                          className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-500 ${
                            dark
                              ? "border-white/[0.08] bg-white/[0.03] text-white focus:border-violet-500/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-violet-500/10"
                              : "border-slate-200 bg-slate-50 text-slate-900 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                          }`}
                        />
                      </div>

                      {/* Error State */}
                      {status === "error" && (
                        <div
                          role="alert"
                          className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                            dark
                              ? "border-red-500/20 bg-red-500/10 text-red-400"
                              : "border-red-200 bg-red-50 text-red-600"
                          }`}
                        >
                          {Icons.alertCircle}
                          <span>{errorMessage}</span>
                        </div>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="group flex w-full items-center justify-center gap-2 cursor-pointer rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/30 transition-all hover:from-violet-500 hover:to-fuchsia-500 hover:shadow-violet-500/50 active:scale-[0.99]"
                      >
                        {
                          loading ?
                          <span>Sending...</span>
                          :
                          <div className="flex justify-center items-center gap-1">
                            <span>Send message</span>
                            <span className="size-3.5 transition-transform duration-200 group-hover:translate-x-1">
                              {Icons.arrowRight}
                            </span>
                          </div>
                        }
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
