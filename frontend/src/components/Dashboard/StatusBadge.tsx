import { getPollStatus } from "../../utils/getPollStatus";
import type { IPoll } from "./assets/types";

// ── Status Badge ───────────────────────────────────────────────────────────

interface StatusBadgeProps {
  expiresAt: IPoll["expiresAt"];
  pollCreationStatus: IPoll["status"];
}

export function StatusBadge({ expiresAt, pollCreationStatus }: StatusBadgeProps) {
  const map = {
    active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    expired: "bg-gray-500/15 text-gray-400 border-gray-500/20",
    draft: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  };

  const status = getPollStatus(expiresAt, pollCreationStatus);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${map[status]}`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "active"
            ? "bg-emerald-400 animate-pulse"
            : status === "draft" ? "bg-amber-400"
            : "bg-gray-500"
        }`}
      />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}