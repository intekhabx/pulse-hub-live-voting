import type { IPollAnalytics } from "./assets/types";

interface DailyResponseTrendsProps {
  poll: IPollAnalytics;
}

const DailyResponseTrends = ({ poll }: DailyResponseTrendsProps) => {
  return (
    <section className="rounded-xl border border-white/[0.08] bg-[#13131f] p-3 sm:p-4 md:p-5 shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
      <div className="mb-5 sm:mb-6 flex items-start sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <h3
            className="text-sm font-semibold text-white"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Daily Response Trends
          </h3>

          <p
            className="mt-1 text-[11px] sm:text-xs text-gray-500"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Daily responses as a percentage of total responses
          </p>
        </div>

        <span className="shrink-0 rounded-md border border-violet-500/20 bg-violet-500/10 px-2 py-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-violet-400">
          PRO & PREMIUM
        </span>
      </div>

      <div className="w-full overflow-x-auto overflow-y-visible pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        <div
          className={`flex h-[250px] sm:h-[280px] md:h-[300px] items-end gap-2 sm:gap-3 md:gap-5 ${
            poll.trends && poll.trends.length > 7
              ? "min-w-[600px]"
              : "w-full min-w-[480px] sm:min-w-0"
          }`}
        >
          {poll.trends?.map((item) => {
            /*
             * Actual percentage.
             *
             * Example:
             * total = 1000
             * today = 100
             * percentage = 10%
             */
            const percentage = Math.min(
              Math.max(item.percentage, 0),
              100
            );

            /*
             * Minimum 3% only for visual visibility.
             * Actual percentage remains unchanged.
             */
            const visualHeight =
              percentage > 0
                ? Math.max(percentage, 3)
                : 1;

            const formattedDate = new Date(
              `${item.date}T00:00:00`
            ).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });

            return (
              <div
                key={item.date}
                className="group flex h-full min-w-[34px] sm:min-w-[40px] flex-1 flex-col items-center justify-end"
              >
                {/* Percentage */}
                <span
                  className="mb-1.5 sm:mb-2 text-[9px] sm:text-[10px] font-semibold text-violet-400 tabular-nums opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {percentage.toFixed(1)}%
                </span>

                {/* Bar area */}
                <div className="relative flex h-full w-full items-end justify-center">
                  <div
                    className="relative w-full max-w-[28px] sm:max-w-[32px] md:max-w-[36px] rounded-t-lg bg-gradient-to-t from-violet-700 via-fuchsia-500 to-orange-400 shadow-[0_0_15px_rgba(139,92,246,0.18)] transition-all duration-500 group-hover:from-violet-600 group-hover:via-fuchsia-400 group-hover:to-orange-300"
                    style={{
                      height: `${visualHeight}%`,
                    }}
                  >
                    {/* Percentage inside bar when enough height */}
                    {percentage >= 8 && (
                      <span
                        className="absolute left-1/2 top-1.5 sm:top-2 -translate-x-1/2 whitespace-nowrap text-[8px] sm:text-[9px] font-bold text-white"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {percentage.toFixed(1)}%
                      </span>
                    )}

                    {/* Tooltip */}
                    <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-[150px] -translate-x-1/2 rounded-lg border border-white/[0.08] bg-[#1b1b29] px-2.5 py-2 opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100 sm:px-3">
                      <p className="text-[10px] sm:text-[11px] font-semibold text-white">
                        {formattedDate}
                      </p>

                      <p className="mt-0.5 text-[9px] sm:text-[10px] text-gray-400">
                        {item.responseCount} responses
                      </p>

                      <p className="text-[9px] sm:text-[10px] font-semibold text-violet-400">
                        {percentage.toFixed(1)}% of total
                      </p>
                    </div>
                  </div>
                </div>

                {/* Date */}
                <span
                  className="mt-2 sm:mt-3 whitespace-nowrap text-[8px] sm:text-[9px] text-gray-600"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {formattedDate}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DailyResponseTrends;
