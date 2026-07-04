import { useContext } from "react";
import { RECENT_ACTIVITY } from "../assets/mockdata";
import { StatCard } from "../StatCard";
import { StatusBadge } from "../StatusBadge";
import { ActivityIcon } from "../ActivityIcon";
import { Icons } from "../Icons";
import tokenStore from "../../../services/tokenStoreService";
import { DataContext } from "../../../Context/ContextApi";

// ── Overview Section ───────────────────────────────────────────────────────

interface OverviewSectionProps {
  setActive: (s: string) => void;
}
 
export function OverviewSection({ setActive }: OverviewSectionProps) {
  const user = tokenStore.getUser();

  const context = useContext(DataContext);
  if(!context){
    throw new Error("DataContext must be used inside ContextApiProvider")
  }
  const {dashboardData} = context;
 
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            Welcome {user?.name} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Here's what's happening with your polls today.
          </p>
        </div>
        <button
          onClick={() => setActive("create")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 transition-all hover:-translate-y-0.5 whitespace-nowrap"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {Icons.plus} Create Poll
        </button>
      </div>
 
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Polls"
          value={dashboardData?.totalPolls || ""}
          sub="+1 this week"
          gradient="from-violet-500 to-fuchsia-500"
          icon={Icons.polls}
        />
        <StatCard
          label="Active Polls"
          value={dashboardData?.activePolls || ""}
          sub="Collecting responses"
          gradient="from-emerald-500 to-teal-500"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        />
        <StatCard
          label="Total Responses"
          value={dashboardData?.totalResponses || ""}
          sub="Across all polls"
          gradient="from-cyan-500 to-blue-500"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        />
        <StatCard
          label="Published Results"
          value={dashboardData?.publishedResult || ""}
          sub="Publicly visible"
          gradient="from-amber-500 to-orange-500"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        />
      </div>
 
      {/* Bottom: Recent Polls + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Polls */}
        <div className="lg:col-span-2 rounded-2xl border border-white/[0.07] bg-[#13131f] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
              Recent Polls
            </h2>
            <button
              onClick={() => setActive("polls")}
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {dashboardData?.polls?.map((poll) => (
              <div
                key={poll._id}
                className="text-gray-200 flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <div>
                    <p
                      className="text-sm font-medium text-gray-200 truncate"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {poll.title}
                    </p>
                    <p
                      className="text-xs text-gray-600 mt-0.5"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {poll.description} 
                      {/* · {poll.questions.length} questions */}
                    </p>
                  </div>
                </div>
                <div className="text-xs">
                  {poll.createdAt.split("T")[0]}
                </div>
                <StatusBadge expiresAt={poll.expiresAt} />
              </div>
            ))}
          </div>
        </div>
 
        {/* Recent Activity */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#13131f] p-5">
          <h2
            className="text-sm font-bold text-white mb-4"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Recent Activity
          </h2>
          <div className="space-y-3">
            {RECENT_ACTIVITY.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <ActivityIcon type={item.icon} />
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-medium text-gray-300 truncate"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {item.action}
                  </p>
                  <p
                    className="text-[11px] text-gray-600 truncate"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {item.poll}
                  </p>
                  <p
                    className="text-[10px] text-gray-700 mt-0.5"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}