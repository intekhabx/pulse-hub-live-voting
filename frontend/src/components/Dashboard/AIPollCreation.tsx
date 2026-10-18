import { useContext } from "react";
import { PollCreationContext } from "../../Context/PollCreationContext";
import { Icons } from "./Icons";


type Props = {
  open: boolean;
  onClose: () => void;
  onApplied?: () => void;
};


export default function AIPollCreation({ open, onClose, onApplied }: Props) {

  const pollCreationContext = useContext(PollCreationContext);

  if (!pollCreationContext) {
    throw new Error("AIPollCreation must be rendered inside PollCreationContextProvider");
  }

  const {messages, typing, input, setInput, listRef, callAiAgent, resetChat} = pollCreationContext;




  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        role="dialog"
        aria-label="PulseHub AI poll assistant"
        className={[
          open ? "flex" : "hidden",
          "flex-col overflow-hidden border border-white/[0.08] bg-[#0c0c14] shadow-2xl shadow-violet-950/40",
          "fixed inset-x-0 bottom-0 z-50 h-[85dvh] rounded-t-3xl",
          "lg:sticky lg:top-20 lg:bottom-auto lg:inset-x-auto lg:z-10 lg:h-[calc(100vh-8rem)] lg:max-h-[720px] lg:w-[360px] lg:flex-shrink-0 lg:rounded-2xl",
        ].join(" ")}
      >
        <div
          className="flex justify-center pt-2 lg:hidden"
          aria-hidden="true"
        >
          <span className="h-1 w-10 rounded-full bg-white/15" />
        </div>

        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white">
            {Icons.sparkle}
          </div>

          <div className="min-w-0 flex-1">
            <p
              className="text-sm font-bold leading-tight text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              PulseHub AI
            </p>
            <p
              className="text-xs text-gray-500"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Describe it, I'll build the poll
            </p>
          </div>

          <button
            type="button"
            onClick={resetChat}
            title="Start a new chat"
            aria-label="Start a new chat"
            disabled={typing}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
          >
            {Icons.refresh}
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close AI assistant"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            {Icons.close}
          </button>
        </div>

        <div
          ref={listRef}
          className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-violet-500/30"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
          aria-live="polite"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={[
                "max-w-[92%] text-[13px] leading-relaxed",
                message.role === "user" ? "self-end" : "self-start",
              ].join(" ")}
            >
              <div
                className={[
                  "whitespace-pre-line rounded-2xl px-3.5 py-2.5",
                  message.role === "user"
                    ? "rounded-tr-md bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
                    : message.error
                      ? "rounded-tl-md border border-red-500/30 bg-red-500/10 text-red-200"
                      : "rounded-tl-md border border-white/[0.06] bg-white/[0.04] text-gray-200",
                ].join(" ")}
              >
                {message.text}
              </div>

              {message.options && message.options.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.options.map((option, index) => (
                    <button
                      key={`${message.id}-${option}-${index}`}
                      type="button"
                      disabled={typing}
                      onClick={() => void callAiAgent(null, option, onApplied)}
                      className="rounded-full border border-violet-500/40 bg-violet-500/10 px-3 py-1.5 text-left text-xs text-violet-200 transition-colors hover:border-violet-400 hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {typing && (
            <div
              className="self-start rounded-2xl rounded-tl-md border border-white/[0.06] bg-white/[0.04] px-3.5 py-3"
              aria-label="AI is working"
            >
              <span className="flex gap-1">
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400"
                    style={{ animationDelay: `${dot * 140}ms` }}
                  />
                ))}
              </span>
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => void callAiAgent(e, input, onApplied)}
          className="border-t border-white/[0.06] p-3"
        >
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={300}
              disabled={typing}
              placeholder="Tell me what to change or answer the question..."
              className="min-w-0 flex-1 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-violet-500/50 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />

            <button
              type="submit"
              aria-label={typing ? "Cancel" : "Send"}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white transition-opacity disabled:opacity-40 cursor-pointer"
            >
              {typing? Icons.cancelCall : Icons.send}
            </button>
          </div>

          <p
            className="mt-2 text-center text-[11px] text-gray-600"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            AI can make mistakes. Review the poll before publishing.
          </p>
        </form>
      </aside>
    </>
  );
}
