import { useContext } from "react";
import { DataContext } from "../Context/ContextApi";
import { Icons } from "./Dashboard/Icons";

const AboutUs = () => {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("dark must be used within ContextApiProvider");
  }

  const { dark } = context;

  return (
    <section
      id="about-us"
      className={`relative overflow-hidden py-24 sm:py-28 ${
        dark
          ? "bg-[#0a0a12] text-white"
          : "bg-[#f9f8ff] text-gray-900"
      }`}
    >
      {/* Background accent */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

      <div
        className={`pointer-events-none absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[280px] rounded-full blur-3xl ${
          dark ? "bg-violet-500/[0.06]" : "bg-violet-400/[0.07]"
        }`}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <span
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border mb-5 ${
              dark
                ? "bg-violet-500/10 border-violet-500/30 text-violet-300"
                : "bg-violet-50 border-violet-200 text-violet-700"
            }`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <span className="text-violet-400">{Icons.pulse}</span>
            About PulseHub
          </span>

          <h2
            className={`text-4xl sm:text-5xl font-black tracking-tight leading-tight ${
              dark ? "text-white" : "text-gray-950"
            }`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Turn opinions into
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            real-time decisions.
            </span>
          </h2>

          <p
            className={`mt-4 text-base mx-auto leading-7 ${
              dark ? "text-gray-400" : "text-gray-500"
            }`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            PulseHub is an online polling platform that helps you to
            create polls, collect audience responses, and view results
            in one place. Share a poll through a link or QR code and
            make group feedback easier to manage.
          </p>
        </div>

        {/* Content */}
        <div className="mt-16 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Main story */}
          <div
            className={`relative overflow-hidden rounded-3xl border p-8 sm:p-10 ${
              dark
                ? "border-white/10 bg-[#13131f]"
                : "border-gray-200 bg-white"
            }`}
          >
            {/* Decorative pulse */}
            <div
              className={`absolute right-0 top-0 h-full w-1/2 ${
                dark ? "text-fuchsia-400" : "text-fuchsia-500"
              } opacity-[0.06]`}
            >
              <svg
                viewBox="0 0 400 200"
                className="h-full w-full"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 100h70l20-45 30 90 35-120 35 75h70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                />
              </svg>
            </div>

            <div className="relative">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                  dark
                    ? "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-400"
                    : "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-600"
                }`}
              >
                {Icons.about}
              </div>

              <h3
                className={`mt-6 text-2xl font-semibold ${
                  dark ? "text-white" : "text-gray-900"
                }`}
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Polling made simple
              </h3>

              <p
                className={`mt-4 max-w-xl leading-7 ${
                  dark ? "text-gray-400" : "text-gray-600"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                PulseHub gives creators, educators, event organizers,
                and communities a straightforward way to ask questions
                and collect responses. Create a poll, share it with
                participants, and let them submit their choices
                through a simple voting experience.
              </p>

              <p
                className={`mt-4 max-w-xl leading-7 ${
                  dark ? "text-gray-400" : "text-gray-600"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Responses and poll results can be viewed through the
                platform, helping poll creators understand the
                preferences and feedback they receive. Available
                features depend on the selected plan.
              </p>

              {/* Mission */}
              <div className="mt-8 border-l-2 border-amber-400 pl-5">
                <p className="text-sm font-medium text-amber-400">
                  Our mission
                </p>

                <p
                  className={`mt-1 text-lg font-medium ${
                    dark ? "text-gray-200" : "text-gray-800"
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Make collecting opinions and understanding responses
                  simpler for everyone.
                </p>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {/* Easy participation */}
            <div
              className={`rounded-3xl border p-7 ${
                dark
                  ? "border-white/10 bg-[#13131f]"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                  dark
                    ? "border-violet-500/20 bg-violet-500/10 text-violet-400"
                    : "border-violet-200 bg-violet-50 text-violet-600"
                }`}
              >
                {Icons.users}
              </div>

              <h3
                className={`mt-5 text-lg font-semibold ${
                  dark ? "text-white" : "text-gray-900"
                }`}
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Easy participation
              </h3>

              <p
                className={`mt-2 text-sm leading-6 ${
                  dark ? "text-gray-400" : "text-gray-600"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Share polls through unique links or QR codes and make
                it easier for your intended audience to participate.
              </p>
            </div>

            {/* Clear results */}
            <div
              className={`rounded-3xl border p-7 ${
                dark
                  ? "border-white/10 bg-[#13131f]"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                  dark
                    ? "border-pink-500/20 bg-pink-500/10 text-pink-400"
                    : "border-pink-200 bg-pink-50 text-pink-600"
                }`}
              >
                {Icons.checkCircle}
              </div>

              <h3
                className={`mt-5 text-lg font-semibold ${
                  dark ? "text-white" : "text-gray-900"
                }`}
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Clear poll results
              </h3>

              <p
                className={`mt-2 text-sm leading-6 ${
                  dark ? "text-gray-400" : "text-gray-600"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                View collected responses in an organized format.
                Additional analytics and CSV export are available
                according to your subscription plan.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom highlight */}
        <div
          className={`mt-6 rounded-3xl border px-6 py-8 text-center sm:px-10 ${
            dark
              ? "border-fuchsia-500/15 bg-gradient-to-r from-fuchsia-500/[0.06] via-pink-500/[0.04] to-violet-500/[0.06]"
              : "border-fuchsia-100 bg-gradient-to-r from-fuchsia-50 via-pink-50 to-violet-50"
          }`}
        >
          <p
            className={`text-sm ${
              dark ? "text-gray-400" : "text-gray-600"
            }`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            From creating a poll to reviewing audience feedback,
          </p>

          <p
            className={`mt-2 text-xl font-semibold ${
              dark ? "text-white" : "text-gray-900"
            }`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            PulseHub brings polling and responses together.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
