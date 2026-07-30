import { useContext, useEffect, useState } from "react";
import pollService from "../../../services/pollService";
import type { IAnalyticsPageData } from "../assets/types";
import { getPollStatus } from "../../../utils/getPollStatus";
import { DataContext } from "../../../Context/ContextApi";

export function AnalyticsSection() {
  const [pollResponse, setPollResponse] = useState<IAnalyticsPageData>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const topPoll = pollResponse?.pollResponses.reduce((a, b) => (a.totalVoteCount > b.totalVoteCount ? a : b), pollResponse.pollResponses[0]);
  const totalResponses = pollResponse?.pollResponses.reduce((a, p) => a + p.totalVoteCount, 0);

  const getAnalyticsPageData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await pollService.getAnalyticsPageData();
      setPollResponse(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load analytics data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAnalyticsPageData();
  }, []);

  const hasData = !!pollResponse?.pollResponses?.length;


  // io totalResponse updation
  const context = useContext(DataContext);
  if(!context){
    throw new Error("DataContext must be used inside ContextApiProvider");
  }
  const {socketRef} = context;

  useEffect(()=> {
    socketRef.current?.on("server:poll-updated", (data) => {
      setPollResponse((prev) => {
        if (!prev) return prev;
    
        return {
          ...prev,
          pollResponses: prev.pollResponses.map((p) => p.pollId === data.pollId ? {...p, totalVoteCount: data.totalResponseCount} : p),
        };
      });
    });
  }, [])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Analytics</h1>
        <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Insights across all your polls</p>
      </div>

      {/* Error state */}
      {error && !isLoading && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.04] p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-rose-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>Couldn't load analytics</p>
            <p className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{error}</p>
          </div>
          <button
            onClick={getAnalyticsPageData}
            className="text-xs font-semibold text-white px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] transition-colors flex-shrink-0"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Response bar chart (visual) */}
      {!error && (
        <div className="rounded-2xl border border-white/[0.07] bg-[#13131f] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Responses per Poll</h2>
            <span className="text-xs text-gray-500 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]" style={{ fontFamily: "'DM Sans', sans-serif" }}>All time</span>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="h-3 rounded-full bg-white/[0.05] animate-pulse" style={{ width: `${45 + (i % 3) * 10}%` }} />
                    <div className="h-3 w-6 rounded-full bg-white/[0.05] animate-pulse" />
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                    <div className="h-full rounded-full bg-white/[0.08] animate-pulse" style={{ width: `${30 + (i % 4) * 15}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : hasData ? (
            <div className="space-y-4">
              {pollResponse!.pollResponses.map(poll => (
                <div key={poll.pollId}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-400 truncate max-w-[60%]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{poll.pollTitle}</span>
                    <span className="text-xs font-bold text-gray-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>{poll.totalVoteCount}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ${
                        getPollStatus(poll.expiresAt) === "active" ? "from-violet-500 to-fuchsia-500" :
                        getPollStatus(poll.expiresAt) === "expired" ? "from-gray-600 to-gray-500" :
                        "from-amber-500 to-orange-500"
                      }`}
                      style={{ width: `${topPoll ? Math.round((poll.totalVoteCount / topPoll.totalVoteCount) * 100) : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3v18h18M7 15l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>No poll data yet</p>
              <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Create a poll to start seeing analytics here</p>
            </div>
          )}
        </div>
      )}

      {/* Summary cards */}
      {!error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {isLoading
            ? [...Array(3)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-white/[0.07] bg-[#13131f] p-5">
                  <div className="h-7 w-16 rounded-lg bg-white/[0.06] animate-pulse mb-2" />
                  <div className="h-3 w-28 rounded-lg bg-white/[0.05] animate-pulse" />
                </div>
              ))
            : [
                {
                  label: "Avg. responses per poll",
                  value: totalResponses && pollResponse?.totalPolls ? Math.round(totalResponses / pollResponse.totalPolls) : 0,
                  suffix: "",
                },
                { label: "Highest response poll", value: topPoll?.totalVoteCount ?? 0, suffix: " responses" },
                { label: "Anonymous polls", value: pollResponse?.anonymousPolls ?? 0, suffix: ` / ${pollResponse?.totalPolls ?? 0}` },
              ].map(({ label, value, suffix }) => (
                <div key={label} className="rounded-2xl border border-white/[0.07] bg-[#13131f] p-5">
                  <div className="text-2xl font-black text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                    {value}
                    <span className="text-sm text-gray-500 font-medium">{suffix}</span>
                  </div>
                  <div className="text-xs text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
                </div>
              ))}
        </div>
      )}
    </div>
  );
}