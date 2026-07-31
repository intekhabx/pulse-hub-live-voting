import { useContext, useEffect, useState } from "react";
import pollService from "../../../services/pollService";
import type { IPollAnalytics } from "../assets/types";
import { StatusBadge } from "../StatusBadge";
import { Loader } from "../../Loader";
import { DataContext } from "../../../Context/ContextApi";

interface PollDetailsSectionProps {
  pollId: string;
}

export function PollDetailsSection({ pollId }: PollDetailsSectionProps) {
  const [poll, setPoll] = useState<IPollAnalytics | null>(null);

  // fetching the data from the io
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("DataContext must be used inside ContextApiProvider");
  }

  const { socketRef } = context;
  useEffect(() => {
    socketRef.current?.on("server:poll-updated", (data) => {
      setPoll(data);
    });
  }, []);

  useEffect(() => {
    async function getPoll() {
      const result = await pollService.getPollAnalytics(pollId);
      setPoll(result.data);
    }
    getPoll();
  }, [pollId]);

  if (!poll) {
    return <Loader label="Loading poll details…" className="min-h-[28rem]" />;
  }

  if (!poll || poll.totalResponseCount === 0 || !poll.analytics || poll?.analytics.length <= 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center px-4">
        <div className="rounded-2xl border border-dashed border-white/10 bg-[#13131f] px-6 sm:px-10 py-12 text-center max-w-md">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-500/10 flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 3v18h18M7 15l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            No Analytics Available
          </h2>
          <p className="mt-2 text-sm text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Analytics will appear here once people start responding to your poll.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-3 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-widest text-orange-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Poll Analytics
            </span>
            <StatusBadge expiresAt={poll.expiresAt} />
          </div>

          <h1 className="text-lg sm:text-xl font-bold text-white truncate" style={{ fontFamily: "'Syne', sans-serif" }}>
            {poll.title}
          </h1>

          {poll.description && (
            <p className="mt-1 text-sm text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {poll.description}
            </p>
          )}
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-teal-400/20 bg-gradient-to-r from-teal-500 via-teal-500 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 ring-1 ring-teal-400/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-teal-500/40 active:scale-95 cursor-pointer whitespace-nowrap flex-shrink-0"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 19l9-7-9-7v14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Publish Your Poll
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-white/[0.08] bg-[#13131f] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
          <p className="text-[11px] sm:text-xs text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>Total Responses</p>
          <h2 className="mt-2 text-xl sm:text-2xl font-bold text-orange-400" style={{ fontFamily: "'Syne', sans-serif" }}>
            {poll.totalResponseCount}
          </h2>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#13131f] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
          <p className="text-[11px] sm:text-xs text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>Authenticated</p>
          <h2 className="mt-2 text-xl sm:text-2xl font-bold text-orange-400" style={{ fontFamily: "'Syne', sans-serif" }}>
            {poll.authenticatedUserCount}
          </h2>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#13131f] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
          <p className="text-[11px] sm:text-xs text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>Anonymous</p>
          <h2 className="mt-2 text-xl sm:text-2xl font-bold text-violet-400" style={{ fontFamily: "'Syne', sans-serif" }}>
            {poll.anonymousUserCount}
          </h2>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#13131f] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
          <p className="text-[11px] sm:text-xs text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>Questions</p>
          <h2 className="mt-2 text-xl sm:text-2xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            {poll.analytics.length}
          </h2>
        </div>
      </div>

      {/* Distribution */}
      <div className="rounded-xl border border-white/[0.08] bg-[#13131f] p-4 sm:p-5 shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            Response Distribution
          </h3>
          <p className="text-xs text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            User participation overview
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
          {/* Donut — moved above details on mobile, sized down so it never breaks layout */}
          <div
            className="relative flex h-32 w-32 sm:h-36 sm:w-36 shrink-0 items-center justify-center rounded-full order-first sm:order-last"
            style={{
              background: `conic-gradient(#f97316 ${poll.authecticatedPercentage}%, #8b5cf6 ${poll.authecticatedPercentage}% 100%)`,
            }}
          >
            <div className="flex h-24 w-24 sm:h-28 sm:w-28 flex-col items-center justify-center rounded-full bg-[#13131f]">
              <span className="text-xl sm:text-2xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                {poll.totalResponseCount}
              </span>
              <span className="text-[11px] text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Votes
              </span>
            </div>
          </div>

          {/* Left Details */}
          <div className="w-full flex-1 space-y-3 sm:space-y-4">
            {/* Auth */}
            <div className="flex items-center justify-between rounded-xl border border-orange-500/20 bg-orange-500/[0.05] px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="h-3 w-3 rounded-full bg-orange-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>Authenticated Users</p>
                  <p className="text-sm font-semibold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {poll.authenticatedUserCount} votes
                  </p>
                </div>
              </div>
              <span className="text-lg font-bold text-orange-400 flex-shrink-0 tabular-nums" style={{ fontFamily: "'Syne', sans-serif" }}>
                {Number(poll.authecticatedPercentage).toFixed(1)}%
              </span>
            </div>

            {/* Anonymous */}
            <div className="flex items-center justify-between rounded-xl border border-violet-500/20 bg-violet-500/[0.05] px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="h-3 w-3 rounded-full bg-violet-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>Anonymous Users</p>
                  <p className="text-sm font-semibold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {poll.anonymousUserCount} votes
                  </p>
                </div>
              </div>
              <span className="text-lg font-bold text-violet-400 flex-shrink-0 tabular-nums" style={{ fontFamily: "'Syne', sans-serif" }}>
                {Number(poll.anonymousPercentage).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
        {poll.analytics.map((obj, index) => (
          <section key={obj._id} className="rounded-xl border border-white/[0.08] bg-[#13131f] p-4 sm:p-5 shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-bold text-violet-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {index + 1}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {obj.question}
                </h3>
                <p className="mt-1 text-xs text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {obj.totalVotes} responses
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {obj.options.map((option) => (
                <div key={option.optionId}>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-300 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {option.optionText}
                    </span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-50 tabular-nums" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {option.votes}
                      </span>
                      <span className="rounded-md border border-orange-500/20 bg-orange-500/10 px-2 py-1 text-[11px] font-semibold text-orange-400 tabular-nums" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {option.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-400 shadow-[0_0_10px_rgba(249,115,22,0.35)] transition-all duration-700"
                      style={{ width: `${option.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}