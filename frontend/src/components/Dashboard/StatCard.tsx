// ── Stat Card ──────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  gradient: string;
}

export function StatCard({ label, value, sub, icon, gradient }: StatCardProps) {
  return (
    <div className="relative rounded-2xl p-5 border border-white/[0.07] bg-[#13131f] overflow-hidden group hover:border-white/10 transition-all duration-300">
      <div
        className={`absolute top-0 right-0 w-28 h-28 rounded-full ${gradient} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500 -translate-y-6 translate-x-6`}
      />
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}
        >
          {icon}
        </div>
      </div>
      <div
        className="text-2xl font-black text-white mb-0.5"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {value}
      </div>
      <div
        className="text-xs font-semibold text-gray-400 mb-1"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {label}
      </div>
      <div
        className="text-[11px] text-gray-600"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {sub}
      </div>
    </div>
  );
}