import { MOCK_POLLS } from "../assets/mockdata";


export function AnalyticsSection() {
  const topPoll = MOCK_POLLS.reduce((a, b) => a.responses > b.responses ? a : b);
  const totalResponses = MOCK_POLLS.reduce((a, p) => a + p.responses, 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Analytics</h1>
        <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Insights across all your polls</p>
      </div>

      {/* Response bar chart (visual) */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#13131f] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Responses per Poll</h2>
          <span className="text-xs text-gray-500 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]" style={{ fontFamily: "'DM Sans', sans-serif" }}>All time</span>
        </div>
        <div className="space-y-4">
          {MOCK_POLLS.map(poll => (
            <div key={poll.id}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-gray-400 truncate max-w-[60%]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{poll.title}</span>
                <span className="text-xs font-bold text-gray-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>{poll.responses}</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ${
                    poll.status === "active" ? "from-violet-500 to-fuchsia-500" :
                    poll.status === "expired" ? "from-gray-600 to-gray-500" :
                    "from-amber-500 to-orange-500"
                  }`}
                  style={{ width: `${Math.round((poll.responses / topPoll.responses) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Avg. responses per poll", value: Math.round(totalResponses / MOCK_POLLS.length), suffix: "" },
          { label: "Highest response poll", value: topPoll.responses, suffix: " responses" },
          { label: "Anonymous polls", value: MOCK_POLLS.filter(p => p.allowAnonymous).length, suffix: ` / ${MOCK_POLLS.length}` },
        ].map(({ label, value, suffix }) => (
          <div key={label} className="rounded-2xl border border-white/[0.07] bg-[#13131f] p-5">
            <div className="text-2xl font-black text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
              {value}<span className="text-sm text-gray-500 font-medium">{suffix}</span>
            </div>
            <div className="text-xs text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}