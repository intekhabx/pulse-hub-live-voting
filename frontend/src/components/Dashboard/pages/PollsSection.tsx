import { useEffect, useState } from "react";
import { StatusBadge } from "../StatusBadge";
import { Icons } from "../Icons";
import { getPollStatus } from "../../../utils/getPollStatus";
import { useNavigate } from "@tanstack/react-router";
import pollService from "../../../services/pollService";
import type { IPollResponse, Poll } from "../assets/types";

// ── Polls Section ──────────────────────────────────────────────────────────

interface PollsSectionProps {
  setActive: (s: string) => void;
}
 
type FilterType = "all" | "active" | "expired" | "draft";
 
export function PollsSection({ setActive }: PollsSectionProps) {

  const [polls, setPolls] = useState<Poll[]>();
  const [totalPollResponse, setTotalPollResponse] = useState<IPollResponse[]>();
  
  const [filter, setFilter] = useState<FilterType>("all");  
  const filtered = filter === "all" ? polls : polls?.filter((p) => getPollStatus(p.expiresAt) === filter);

  const getMyPolls = async() => {
    const res = await pollService.getMyPolls();
    const {polls, pollResponse} = res.data;
    // console.log(polls, pollResponse);
    setPolls(polls);
    setTotalPollResponse(pollResponse);
  }

  useEffect(()=> {
    getMyPolls();
  }, [])
  


  const navigate = useNavigate();

  const openPollPage = async (pollId: string) => {
    navigate({
      to: '/poll/$pollId',
      params: { pollId },
    })
  }


  const copyPollLink = (pollId: string) => {
    navigator.clipboard.writeText(`${import.meta.env.VITE_BASE_URL}/votes/${pollId}`);
    alert("copied...");
  }


  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            My Polls
          </h1>
          <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Manage and track all your polls
          </p>
        </div>
        <button
          onClick={() => setActive("create")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 transition-all hover:-translate-y-0.5 whitespace-nowrap"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {Icons.plus} New Poll
        </button>
      </div>
 
      {/* Filter tabs */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit">
        {(["all", "active", "expired", "draft"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 capitalize ${
              filter === f
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                : "text-gray-500 hover:text-gray-300"
            }`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {f}
          </button>
        ))}
      </div>
 
      {/* Polls table */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#13131f] overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/[0.05]">
          {["Poll Title", "Status", "Responses", "Expires", "Actions"].map((h) => (
            <div
              key={h}
              className={`text-[11px] font-bold text-gray-600 uppercase tracking-widest ${
                h === "Poll Title"
                  ? "col-span-4"
                  : h === "Actions"
                  ? "col-span-2 text-right"
                  : "col-span-2"
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {h}
            </div>
          ))}
        </div>
        {filtered?.map((poll, idx) => (
          <div
            key={poll._id}
            className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors group"
          >
            <div className="col-span-4">
              <p
                className="text-sm font-medium text-gray-200 leading-snug"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {poll.title}
              </p>
              <p
                className="text-xs text-gray-600 mt-0.5"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {poll.questions.length} questions · {poll.allowAnonymous ? "Anonymous" : "Authenticated"}
                {poll.isPublished && <span className="ml-2 text-emerald-500">· Published</span>}
              </p>
            </div>
            <div className="col-span-2 flex items-center">
              <StatusBadge expiresAt={poll.expiresAt} />
            </div>
            <div className="col-span-2 flex items-center">
              <span
                className="text-sm font-semibold text-gray-300"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {totalPollResponse?.[idx].totalResponse || "00"}
              </span>
            </div>
            <div className="col-span-2 flex items-center">
              <span
                className="text-xs text-gray-500"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {new Date(poll.expiresAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="col-span-2 flex items-center justify-end gap-2">
              <button
                onClick={()=> openPollPage(poll._id)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
                title="View"
              >
                {Icons.eye}
              </button>
              <button
                onClick={()=> copyPollLink(poll._id)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                title="Copy link"
              >
                {Icons.link}
              </button>
              <button
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Delete"
              >
                {Icons.trash}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}