import { useContext, useState } from "react";
import { StatusBadge } from "../StatusBadge";
import { Icons } from "../Icons";
import { getPollStatus } from "../../../utils/getPollStatus";
import { useNavigate } from "@tanstack/react-router";
import { Loader } from "../../Loader";
import { PollContext } from "../../../Context/PollContext";

// ── Polls Section ──────────────────────────────────────────────────────────

interface PollsSectionProps {
  setActive: (s: string) => void;
}

type FilterType = "all" | "active" | "expired" | "draft";
const filterState = {
  all: {
    title: "No polls created yet",
    description: "Get started by creating your first poll."
  },
  active: {
    title: "No active polls",
    description: "You don't have any active polls at the moment."
  },
  expired: {
    title: "No expired polls",
    description: "You don't have any expired polls yet."
  },
  draft: {
    title: "No draft polls",
    description: "You don't have any draft polls yet."
  }
}

export function PollsSection({ setActive }: PollsSectionProps) {

  const pollContext = useContext(PollContext);
  if(!pollContext){
    throw new Error("polls, totalPollResponse, isLoading and handleDelete should be present inside PollContext");
  }

  const {polls, totalPollResponse, isLoading, handleDelete} = pollContext;
  const [copiedPollId, setCopiedPollId] = useState<string | null>(null);
  

  const [filter, setFilter] = useState<FilterType>("all");
  const filtered = filter === "all" ? polls : polls?.filter((p) => getPollStatus(p.expiresAt) === filter);
  const filteredPollResponse = filter === "all" ? totalPollResponse : totalPollResponse?.filter((r) => getPollStatus(r.expiresAt) === filter);


  const navigate = useNavigate();

  const openViewAndEditPage = async(pollId: string) => {
    navigate({
      to: "/dashboard/poll-edit/$pollId",
      params: {pollId},
      search: {mode: "edit"}
    });
  };

  const openPollAnalyticsPage = async (pollId: string) => {
    navigate({
      to: "/dashboard/poll/$pollId",
      params: { pollId },
    });
  };

  // copy a poll link
  const copyPollLink = (pollId: string) => {
    navigator.clipboard.writeText(`${import.meta.env.VITE_BASE_URL}/votes/${pollId}`);
    setCopiedPollId(pollId);
    setTimeout(() => setCopiedPollId(null), 1800);
  };


  const formatExpiry = (expiresAt: string) =>
    new Date(expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            My Polls
          </h1>
          <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Manage and track all your polls
          </p>
        </div>
        <button
          onClick={() => setActive("create")}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {Icons.plus} New Poll
        </button>
      </div>

      {isLoading ? (
        <Loader label="Loading your polls…" className="min-h-[20rem]" />
      ) : (
        <>
          {/* Filter tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit overflow-x-auto max-w-full">
            {(["all", "active", "expired", "draft"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 capitalize whitespace-nowrap ${
                  filter === f
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20"
                    : "text-gray-500 hover:text-gray-300"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Empty state (shared) */}
          {!filtered || filtered.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.07] bg-[#13131f] py-14 text-center px-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-500/10 flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                {filterState[filter].title}
              </p>
              <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {filterState[filter].description}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop / tablet table */}
              <div className="hidden lg:block rounded-2xl border border-white/[0.07] bg-[#13131f] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
                <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/[0.05] bg-white/[0.015]">
                  {["Poll Title", "Status", "Responses", "Expires", "Actions"].map((h) => (
                    <div
                      key={h}
                      className={`text-[11px] font-bold text-gray-600 uppercase tracking-widest ${
                        h === "Poll Title" ? "col-span-4" : h === "Actions" ? "col-span-2 text-right" : "col-span-2"
                      }`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {h}
                    </div>
                  ))}
                </div>
                {filtered.map((poll, idx) => (
                  <div
                    key={poll._id}
                    className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.025] transition-colors group"
                  >
                    <div className="col-span-4 min-w-0">
                      <p className="text-sm font-medium text-gray-200 leading-snug truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {poll.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {poll.questions.length} questions · {poll.allowAnonymous ? "Anonymous" : "Authenticated"}
                        {poll.isPublished && <span className="ml-2 text-emerald-500">· Published</span>}
                      </p>
                    </div>

                    <div className="col-span-2 flex items-center">
                      <StatusBadge expiresAt={poll.expiresAt} />
                    </div>

                    <div className="col-span-2 flex items-center">
                      <span className="text-sm font-semibold text-gray-300 tabular-nums" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {filteredPollResponse?.[idx]?.totalResponse || "00"}
                      </span>
                    </div>

                    <div className="col-span-2 flex items-center">
                      <span className="text-xs text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {formatExpiry(poll.expiresAt)}
                      </span>
                    </div>

                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <button
                        onClick={() => openViewAndEditPage(poll._id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-violet-400 hover:bg-violet-500/10 transition-colors cursor-pointer"
                        title="View"
                      >
                        {Icons.eye}
                      </button>

                      <button
                        onClick={() => openPollAnalyticsPage(poll._id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-orange-400 hover:bg-orange-500/10 transition-colors cursor-pointer"
                        title="Analytics"
                      >
                        {Icons.analytics}
                      </button>

                      <button
                        onClick={() => copyPollLink(poll._id)}
                        className={`h-7 rounded-lg flex items-center justify-center transition-colors ${
                          copiedPollId === poll._id ? "w-auto px-2 text-cyan-400 bg-cyan-500/10" : "w-7 text-gray-600 hover:text-cyan-400 hover:bg-cyan-500/10 cursor-pointer"
                        }`}
                        title={copiedPollId === poll._id ? "Copied" : "Copy link"}
                      >
                        {copiedPollId === poll._id ? (
                          <span className="text-[11px] font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            Copied
                          </span>
                        ) : (
                          Icons.link
                        )}
                      </button>

                      <button
                        onClick={()=> handleDelete(poll._id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        {Icons.trash}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile / small-tablet cards — no collapsing table, dedicated card layout */}
              <div className="lg:hidden space-y-3">
                {filtered.map((poll, idx) => (
                  <div
                    key={poll._id}
                    className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#13131f] shadow-[0_8px_30px_rgba(0,0,0,0.25)] active:scale-[0.995] transition-transform"
                  >
                    <div className="absolute top-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

                    {/* Header */}
                    <div className="p-4 pb-3.5">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <p
                          className="flex-1 min-w-0 text-sm font-semibold text-gray-100 leading-snug"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {poll.title}
                        </p>

                        <div className="flex-shrink-0">
                          <StatusBadge expiresAt={poll.expiresAt} />
                        </div>
                      </div>

                      <p
                        className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] text-gray-600"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        <span>{poll.questions.length} questions</span>
                        <span className="text-gray-700">·</span>
                        <span>
                          {poll.allowAnonymous ? "Anonymous" : "Authenticated"}
                        </span>

                        {poll.isPublished && (
                          <span className="inline-flex items-center gap-1 text-emerald-500">
                            <span className="text-gray-700">·</span>
                            <span className="w-1 h-1 rounded-full bg-emerald-500" />
                            Published
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 divide-x divide-white/[0.05] border-t border-white/[0.05] bg-white/[0.015]">

                      {/* Responses */}
                      <div className="flex items-center gap-2 px-4 py-3">
                        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m5-3.13a3 3 0 100-6 3 3 0 000 6zm7 0a3 3 0 100-6"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>

                        <div className="min-w-0 flex flex-col justify-center">
                          <p
                            className="text-[9px] uppercase tracking-wider text-gray-600"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                          >
                            Responses
                          </p>

                          <p
                            className="mt-0.5 text-xs font-semibold text-gray-200 leading-tight"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                          >
                            {filteredPollResponse?.[idx]?.totalResponse || "00"}
                          </p>
                        </div>
                      </div>

                      {/* Expires */}
                      <div className="flex items-center gap-2 px-4 py-3">
                        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-fuchsia-500/10 text-fuchsia-400">
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <rect
                              x="3"
                              y="4.5"
                              width="18"
                              height="16"
                              rx="3"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            />
                            <path
                              d="M3 9.5h18M8 2.5v3M16 2.5v3"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />
                          </svg>
                        </span>

                        <div className="min-w-0 flex flex-col justify-center">
                          <p
                            className="text-[9px] uppercase tracking-wider text-gray-600"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                          >
                            Expires
                          </p>

                          <p
                            className="mt-0.5 truncate text-xs font-semibold text-gray-200 leading-tight"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                          >
                            {formatExpiry(poll.expiresAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-4 divide-x divide-white/[0.05] border-t border-white/[0.05]">
                      <button
                        onClick={() => openViewAndEditPage(poll._id)}
                        className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-gray-500 transition-colors hover:bg-violet-500/[0.06] hover:text-violet-400"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                        aria-label="View poll"
                      >
                        {Icons.eye}
                        View
                      </button>

                      <button
                        onClick={() => openPollAnalyticsPage(poll._id)}
                        className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-gray-500 transition-colors hover:bg-orange-500/[0.06] hover:text-orange-400"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                        aria-label="Analytics poll"
                      >
                        {Icons.analytics}
                        Analytics
                      </button>

                      <button
                        onClick={() => copyPollLink(poll._id)}
                        className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-colors ${
                          copiedPollId === poll._id
                            ? "bg-cyan-500/[0.06] text-cyan-400"
                            : "text-gray-500 hover:bg-cyan-500/[0.06] hover:text-cyan-400"
                        }`}
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                        aria-label="Copy poll link"
                      >
                        {copiedPollId === poll._id ? (
                          "Copied ✓"
                        ) : (
                          <>
                            {Icons.link}
                            Copy
                          </>
                        )}
                      </button>

                      <button
                        onClick={()=> handleDelete(poll._id)}
                        className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-gray-500 transition-colors hover:bg-rose-500/[0.06] hover:text-rose-400"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                        aria-label="Delete poll"
                      >
                        {Icons.trash}
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}