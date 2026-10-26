import { useContext, useEffect, useRef, useState } from "react";
import { PollCreationContext } from "../../../Context/PollCreationContext";
import { ManualPollCreation } from "../ManualPollCreation";
import AIPollCreation from "../AIPollCreation";
import { Icons } from "../Icons";

const PANEL_KEY = "pulsehub_ai_panel";
const DESKTOP_QUERY = "(min-width: 1024px)";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(DESKTOP_QUERY).matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}



export function CreatePollSection({ setActive }: { setActive: (s: string) => void }) {

  const pollCreationContext = useContext(PollCreationContext);
  if(!pollCreationContext){
    throw new Error("CreatePollSection must be rendered inside PollCreationContextProvider")
  }

  const {handleCancel} = pollCreationContext;

  const isDesktop = useIsDesktop();

  // Desktop: open by default, remembers the user's choice.
  // Mobile: always starts closed (it's a popup there).
  const [aiOpen, setAiOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    if (!window.matchMedia(DESKTOP_QUERY).matches) return false;
    return localStorage.getItem(PANEL_KEY) !== "closed";
  });

  const [flash, setFlash] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const setPanel = (next: boolean) => {
    setAiOpen(next);
    if (isDesktop) {
      try {
        localStorage.setItem(PANEL_KEY, next ? "open" : "closed");
      } catch {
        /* storage unavailable, ignore */
      }
    }
  };

  const handleApplied = () => {
    // Briefly highlight the form so the user sees what the AI changed
    setFlash(true);
    timers.current.push(window.setTimeout(() => setFlash(false), 1400));

    // On small screens, close the popup so the filled form is visible
    if (!isDesktop) {
      timers.current.push(window.setTimeout(() => setAiOpen(false), 1200));
    }
  };

  return (
    <div className="w-full max-w-[1100px] mx-auto pb-6">
      <div className="flex gap-6 items-start justify-center">

        {/* Form column */}
        <div className="w-full max-w-2xl min-w-0">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={()=> handleCancel({setActive})}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 bg-white/[0.03] border border-white/[0.06] hover:text-white hover:border-violet-500/30 hover:bg-white/[0.06] transition-all flex-shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>Create Poll</h1>
              <p className="text-xs sm:text-sm text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>Build and publish a new poll</p>
            </div>

            {/* Desktop toggle */}
            <button
              onClick={() => setPanel(!aiOpen)}
              aria-pressed={aiOpen}
              className={`hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border transition-all ${
                aiOpen
                  ? "text-violet-200 bg-violet-500/15 border-violet-500/40"
                  : "text-gray-300 bg-white/[0.03] border-white/[0.06] hover:text-white hover:border-violet-500/30"
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {Icons.sparkle}
              Create with AI
            </button>
          </div>

          <div
            className={`rounded-2xl ring-2 transition-all duration-500 ${
              flash ? "ring-violet-500/50" : "ring-transparent"
            }`}
          >
            <ManualPollCreation setActive={setActive} />
          </div>
        </div>

        {/* AI panel (side panel on lg+, bottom-sheet popup on small screens) */}
        <AIPollCreation open={aiOpen} onClose={() => setPanel(false)} onApplied={handleApplied} />
      </div>

      {/* Mobile floating button */}
      {!aiOpen && (
        <button
          onClick={() => setPanel(true)}
          aria-label="Create poll with AI"
          className="lg:hidden fixed bottom-5 right-5 z-30 flex items-center gap-2 pl-3.5 pr-4 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-900/50"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {Icons.sparkle}
          AI
        </button>
      )}
    </div>
  );
}
