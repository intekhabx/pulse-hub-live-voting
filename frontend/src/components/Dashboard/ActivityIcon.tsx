// ── Activity Icon ──────────────────────────────────────────────────────────

interface ActivityIconProps {
  type: string;
}

export function ActivityIcon({ type }: ActivityIconProps) {
  const map: Record<string, { bg: string; icon: React.ReactNode }> = {
    response: {
      bg: "bg-violet-500/20 text-violet-400",
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    publish: {
      bg: "bg-emerald-500/20 text-emerald-400",
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    expire: {
      bg: "bg-gray-500/20 text-gray-400",
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
    },
    create: {
      bg: "bg-cyan-500/20 text-cyan-400",
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
    },
  };

  const { bg, icon } = map[type] || map.create;

  return (
    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${bg}`}>
      {icon}
    </div>
  );
}