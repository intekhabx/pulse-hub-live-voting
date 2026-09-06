import type { IPollAnalytics } from "./assets/types";

interface HourlyResponseTrendsProps {
  poll: IPollAnalytics;
}

const HourlyResponseTrends = ({ poll }: HourlyResponseTrendsProps) => {
  return (
    <section className="rounded-xl border border-white/[0.08] bg-[#13131f] p-3 sm:p-4 md:p-5 shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
      <div className="mb-5 flex items-start sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <h3
            className="text-sm font-semibold text-white"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Hourly Response Trends
          </h3>

          <p
            className="mt-1 text-[11px] sm:text-xs text-gray-500"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Response activity throughout the day
          </p>
        </div>

        <span className="shrink-0 rounded-md border border-violet-500/20 bg-violet-500/10 px-2 py-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-violet-400">
          PRO & PREMIUM
        </span>
      </div>

      {(() => {
        /*
         * Create all 24 hours.
         * If backend doesn't return an hour, its value will be 0.
         */
        const hourlyData = Array.from({ length: 24 }, (_, hour) => {
          const item = poll.hourlyResponses?.find(
            (data) => data.hour === hour
          );

          return {
            hour,
            responseCount: item?.responseCount ?? 0,
          };
        });

        const maxValue = Math.max(
          ...hourlyData.map((item) => item.responseCount),
          1
        );

        const width = 1000;
        const height = 320;

        const paddingLeft = 45;
        const paddingRight = 20;
        const paddingTop = 25;
        const paddingBottom = 45;

        const chartWidth =
          width - paddingLeft - paddingRight;

        const chartHeight =
          height - paddingTop - paddingBottom;

        /*
         * Convert data into SVG coordinates
         */
        const points = hourlyData.map((item, index) => {
          const x =
            paddingLeft +
            (index / 23) * chartWidth;

          const y =
            paddingTop +
            chartHeight -
            (item.responseCount / maxValue) * chartHeight;

          return {
            x,
            y,
            hour: item.hour,
            responseCount: item.responseCount,
          };
        });

        /*
         * Create smooth curved SVG path.
         */
        const createSmoothPath = () => {
          if (points.length === 0) return "";

          let path = `M ${points[0].x} ${points[0].y}`;

          for (let i = 0; i < points.length - 1; i++) {
            const current = points[i];
            const next = points[i + 1];

            const controlPointX =
              (current.x + next.x) / 2;

            path += `
              C
              ${controlPointX} ${current.y},
              ${controlPointX} ${next.y},
              ${next.x} ${next.y}
            `;
          }

          return path;
        };

        const linePath = createSmoothPath();

        /*
         * Area below the curve
         */
        const areaPath = `
          ${linePath}
          L ${points[points.length - 1].x} ${
            paddingTop + chartHeight
          }
          L ${points[0].x} ${
            paddingTop + chartHeight
          }
          Z
        `;

        return (
          <div className="w-full overflow-x-auto overflow-y-hidden pb-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
            <div className="min-w-[560px] sm:min-w-[650px]">
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="h-[230px] w-full sm:h-[280px] md:h-[320px]"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Gradient below line */}
                  <linearGradient
                    id="hourlyAreaGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#8b5cf6"
                      stopOpacity="0.30"
                    />

                    <stop
                      offset="100%"
                      stopColor="#8b5cf6"
                      stopOpacity="0"
                    />
                  </linearGradient>

                  {/* Line gradient */}
                  <linearGradient
                    id="hourlyLineGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop
                      offset="0%"
                      stopColor="#8b5cf6"
                    />

                    <stop
                      offset="50%"
                      stopColor="#d946ef"
                    />

                    <stop
                      offset="100%"
                      stopColor="#f97316"
                    />
                  </linearGradient>

                  {/* Glow */}
                  <filter
                    id="hourlyGlow"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feGaussianBlur
                      stdDeviation="5"
                      result="blur"
                    />

                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Horizontal grid lines */}
                {[0, 25, 50, 75, 100].map((percentage) => {
                  const y =
                    paddingTop +
                    chartHeight -
                    (percentage / 100) * chartHeight;

                  return (
                    <line
                      key={percentage}
                      x1={paddingLeft}
                      x2={width - paddingRight}
                      y1={y}
                      y2={y}
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Area */}
                <path
                  d={areaPath}
                  fill="url(#hourlyAreaGradient)"
                />

                {/* Main curved line */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="url(#hourlyLineGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#hourlyGlow)"
                />

                {/* Points */}
                {points.map((point) => (
                  <g key={point.hour}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="5"
                      fill="#13131f"
                      stroke="#a855f7"
                      strokeWidth="2"
                      className="transition-all"
                    />

                    <title>
                      {`${point.hour}:00 — ${point.responseCount} responses`}
                    </title>
                  </g>
                ))}

                {/* X axis labels */}
                {points.map((point) => {
                  // Show only every 3 hours
                  if (point.hour % 3 !== 0) return null;

                  return (
                    <text
                      key={`label-${point.hour}`}
                      x={point.x}
                      y={height - 15}
                      textAnchor="middle"
                      fill="#6b7280"
                      fontSize="12"
                    >
                      {point.hour === 0
                        ? "12 AM"
                        : point.hour < 12
                        ? `${point.hour} AM`
                        : point.hour === 12
                        ? "12 PM"
                        : `${point.hour - 12} PM`}
                    </text>
                  );
                })}

                {/* Y axis values */}
                {[0, 25, 50, 75, 100].map((percentage) => {
                  const value = Math.round(
                    (percentage / 100) * maxValue
                  );

                  const y =
                    paddingTop +
                    chartHeight -
                    (percentage / 100) * chartHeight +
                    4;

                  return (
                    <text
                      key={`y-${percentage}`}
                      x="35"
                      y={y}
                      textAnchor="end"
                      fill="#4b5563"
                      fontSize="11"
                    >
                      {value}
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>
        );
      })()}
    </section>
  );
};

export default HourlyResponseTrends;
