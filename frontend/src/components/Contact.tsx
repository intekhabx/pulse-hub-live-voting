import { useState, useContext } from "react";
import { Icons } from "./Dashboard/Icons";
import { DataContext } from "../Context/ContextApi";


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

  const [status, setStatus] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    if (status) {
      setStatus("");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setStatus("error");
      return;
    }

    setStatus("success");

    // Connect this with your backend/API later.
    console.log(form);
  };

  return (
    <main
      id="contact"
      className={`min-h-screen transition-colors duration-300 ${
        dark
          ? "bg-[#09090b] text-white"
          : "bg-[#f8fafc] text-slate-900"
      }`}
    >
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div
          className={`pointer-events-none absolute left-1/2 top-0 h-[420px] w-[700px] -translate-x-1/2 rounded-full blur-3xl ${
            dark
              ? "bg-violet-600/10"
              : "bg-violet-500/10"
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
            <h1
              className={`text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl ${
                dark ? "text-white" : "text-slate-950"
              }`}
            >
              Let&apos;s talk about
              <span className="block bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                your next live vote.
              </span>
            </h1>

            {/* Description */}
            <p
              className={`mx-auto mt-6 max-w-2xl text-base leading-7 sm:text-lg ${
                dark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Have a question about PulseHub, need help with your account,
              or want to know more about our plans? We&apos;d love to hear
              from you.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CONTACT SECTION ================= */}
      <section className="pb-20 sm:pb-24 lg:pb-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
            {/* ================= LEFT ================= */}
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
                We&apos;re here to
                <span className="block bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
                  help.
                </span>
              </h2>

              <p
                className={`mt-5 max-w-md text-base leading-7 ${
                  dark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Whether you&apos;re setting up your first live vote or already
                running events with PulseHub, our team is here to help.
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
                    Email
                  </span>

                  <a
                    href="mailto:support@pulsehub.app"
                    className={`mt-1 block truncate text-sm font-semibold transition-colors ${
                      dark
                        ? "text-slate-200 hover:text-violet-400"
                        : "text-slate-800 hover:text-violet-600"
                    }`}
                  >
                    support@pulsehub.app
                  </a>
                </div>
              </div>

              {/* Response note */}
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
                    Usually respond within 24 hours
                  </strong>

                  <p
                    className={`mt-1 text-sm leading-6 ${
                      dark ? "text-slate-500" : "text-slate-500"
                    }`}
                  >
                    Send us your question and we&apos;ll get back to you as
                    soon as possible.
                  </p>
                </div>
              </div>
            </div>

            {/* ================= FORM CARD ================= */}
            <div
              className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 ${
                dark
                  ? "border-white/[0.08] bg-[#111113] shadow-2xl shadow-black/20"
                  : "border-slate-200 bg-white shadow-xl shadow-slate-200/40"
              }`}
            >
              {/* Card glow */}
              <div
                className={`pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full blur-3xl ${
                  dark
                    ? "bg-violet-600/10"
                    : "bg-violet-500/5"
                }`}
              />

              <div className="relative">
                <span
                  className={`text-xs font-bold tracking-[0.2em] ${
                    dark ? "text-violet-400" : "text-violet-600"
                  }`}
                >
                  SEND A MESSAGE
                </span>

                <h3
                  className={`mt-2 text-2xl font-bold ${
                    dark ? "text-white" : "text-slate-950"
                  }`}
                >
                  How can we help?
                </h3>

                <form
                  onSubmit={handleSubmit}
                  className="mt-7 space-y-5"
                >
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
                        Name
                      </label>

                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Your name"
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
                        Email
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
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
                      Subject
                    </label>

                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="What can we help you with?"
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
                      Message
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      placeholder="Tell us a little more..."
                      value={form.message}
                      onChange={handleChange}
                      className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-500 ${
                        dark
                          ? "border-white/[0.08] bg-white/[0.03] text-white focus:border-violet-500/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-violet-500/10"
                          : "border-slate-200 bg-slate-50 text-slate-900 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                      }`}
                    />
                  </div>

                  {/* Error */}
                  {status === "error" && (
                    <div
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                        dark
                          ? "border-red-500/20 bg-red-500/10 text-red-400"
                          : "border-red-200 bg-red-50 text-red-600"
                      }`}
                    >
                      {Icons.alertCircle}
                      <span>
                        Please fill in all required fields.
                      </span>
                    </div>
                  )}

                  {/* Success */}
                  {status === "success" && (
                    <div
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                        dark
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                          : "border-emerald-200 bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {Icons.checkCircle}
                      <span>
                        Thanks! Your message has been received.
                      </span>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    className="group flex w-full py-3 items-center justify-center gap-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 active:translate-y-0"
                  >
                    <span>Send message</span>

                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      {Icons.arrowRight}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
