interface LoaderProps {
  label?: string;
  className?: string;
}

export function Loader({ label = "Loading…", className = "" }: LoaderProps) {
  return (
    <div className={`flex min-h-40 flex-col items-center justify-center gap-3 ${className}`} role="status" aria-live="polite">
      <div className="relative h-9 w-9">
        <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-r-fuchsia-500 border-t-violet-500" />
      </div>
      <span className="text-sm text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
    </div>
  );
}
