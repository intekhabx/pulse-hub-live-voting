import { useContext, useEffect, useRef, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import {
  PollCreationContext,
  TITLE_MAX,
  DESCRIPTION_MAX,
  MAX_OPTIONS,
} from "../../Context/PollCreationContext";
import { Icons } from "./Icons";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type AIPollDraft = {
  title: string;
  description: string;
  questions: { questionText: string; required: boolean; options: string[] }[];
};

export type AIPollRequest = {
  topic: string;
  instruction?: string;
  currentDraft?: AIPollDraft;
};

type Message = { id: number; role: "ai" | "user"; text: string; error?: boolean };
type Stage = "topic" | "mode" | "expiry" | "done" | "error";
type Settings = { anon: boolean; hours: number | null };

type Props = {
  open: boolean;
  onClose: () => void;
  onApplied?: () => void;
};

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const MAX_QUESTIONS = 10;

const SUGGESTIONS = [
  "Office lunch vote",
  "Team feedback survey",
  "Event date poll",
  "Customer satisfaction",
];

const EXPIRY_OPTIONS: { label: string; hours: number | null }[] = [
  { label: "24 hours", hours: 24 },
  { label: "3 days", hours: 72 },
  { label: "1 week", hours: 168 },
  { label: "No expiry", hours: null },
];

const REFINE_ACTIONS: { label: string; instruction: string }[] = [
  { label: "Regenerate", instruction: "Write a completely different version of this poll on the same topic." },
  { label: "Make it shorter", instruction: "Shorten the poll: fewer questions and shorter options." },
  { label: "Add one more question", instruction: "Add exactly one more relevant question." },
  { label: "Make it friendlier", instruction: "Rewrite the title, description and questions in a warmer, friendlier tone." },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 0,
    role: "ai",
    text: "Hi! What should your poll be about? Describe it in a sentence and I'll build the form for you.",
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const pad = (n: number) => String(n).padStart(2, "0");

// Format used by <input type="datetime-local">
const toLocalInputValue = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

// Never trust AI output blindly: clean it before it touches the form.
const sanitizeDraft = (raw: any): AIPollDraft => {
  const title = String(raw?.title ?? "").trim().slice(0, TITLE_MAX);
  const description = String(raw?.description ?? "").trim().slice(0, DESCRIPTION_MAX);

  const questions = (Array.isArray(raw?.questions) ? raw.questions : [])
    .slice(0, MAX_QUESTIONS)
    .map((q: any) => ({
      questionText: String(q?.questionText ?? "").trim(),
      required: Boolean(q?.required),
      options: (Array.isArray(q?.options) ? q.options : [])
        .map((o: any) => String(typeof o === "string" ? o : o?.optionText ?? "").trim())
        .filter(Boolean)
        .slice(0, MAX_OPTIONS),
    }))
    .filter((q: AIPollDraft["questions"][number]) => q.questionText && q.options.length >= 2);

  if (!title || questions.length === 0) {
    throw new Error("The AI response was incomplete. Try rephrasing your topic.");
  }
  return { title, description, questions };
};


/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function AIPollCreation({ open, onClose, onApplied }: Props) {
  const pollCreationContext = useContext(PollCreationContext);
  if (!pollCreationContext) {
    throw new Error("AIPollCreation must be rendered inside PollCreationContextProvider");
  }

  const {
    title,
    description,
    questions,
    setTitle,
    setDescription,
    setAllowAnonymous,
    setExpiresAt,
    setQuestions,
    setErrors,
  } = pollCreationContext;

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [stage, setStage] = useState<Stage>("topic");
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");

  const idRef = useRef(1);
  const topicRef = useRef("");
  const settingsRef = useRef<Settings>({ anon: true, hours: null });
  const lastRunRef = useRef<{ req: AIPollRequest; settings?: Settings } | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, stage, open]);

  const push = (role: Message["role"], text: string, error = false) =>
    setMessages((m) => [...m, { id: idRef.current++, role, text, error }]);

  const aiSays = async (text: string) => {
    setTyping(true);
    await sleep(450);
    push("ai", text);
    setTyping(false);
  };

  /* -------------------------- form writing -------------------------- */

  const applyToForm = (draft: AIPollDraft, settings?: Settings) => {
    setTitle(draft.title);
    setDescription(draft.description);
    setQuestions(
      draft.questions.map((q) => ({
        questionText: q.questionText,
        required: q.required,
        options: q.options.map((optionText) => ({ optionText })),
      }))
    );
    setErrors({});

    if (settings) {
      setAllowAnonymous(settings.anon);
      setExpiresAt(
        settings.hours ? toLocalInputValue(new Date(Date.now() + settings.hours * 3600 * 1000)) : ""
      );
    }
  };

  const currentDraftFromForm = (): AIPollDraft => ({
    title,
    description,
    questions: questions.map((q) => ({
      questionText: q.questionText,
      required: q.required,
      options: q.options.map((o) => o.optionText),
    })),
  });

  /* ---------------------------- AI request --------------------------- */

  const run = async (req: AIPollRequest, settings?: Settings) => {
    lastRunRef.current = { req, settings };
    setTyping(true);
    try {
      // const raw = await pollService.generatePollWithAI(req);
      const raw = {}
      const draft = sanitizeDraft(raw);
      applyToForm(draft, settings);

      const n = draft.questions.length;
      push(
        "ai",
        settings
          ? `Done! I've filled in "${draft.title}" with ${n} question${n > 1 ? "s" : ""}. Review it in the form, or tell me what to change.`
          : "Updated the form. Anything else you'd like to change?"
      );
      setStage("done");
      onApplied?.();
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || error?.message || "Something went wrong while generating the poll.";
      push("ai", `Couldn't generate the poll. ${msg}`, true);
      setStage("error");
      toast.error("AI couldn't build the poll");
    } finally {
      setTyping(false);
    }
  };

  /* ---------------------------- conversation ------------------------- */

  const handleTopic = async (raw: string) => {
    const text = raw.trim();
    if (!text) return;

    const formHasContent = title.trim() !== "" || questions.some((q) => q.questionText.trim() !== "");
    if (formHasContent && !window.confirm("The AI will replace what's currently in the form. Continue?")) {
      return;
    }

    push("user", text);
    setInput("");
    topicRef.current = text;
    setStage("mode");
    await aiSays("Should responses be anonymous? Anonymous lets people vote without logging in.");
  };

  const handleMode = async (anon: boolean) => {
    push("user", anon ? "Anonymous" : "Authenticated");
    settingsRef.current = { ...settingsRef.current, anon };
    setStage("expiry");
    await aiSays("How long should the poll stay open?");
  };

  const handleExpiry = async (opt: { label: string; hours: number | null }) => {
    push("user", opt.label);
    settingsRef.current = { ...settingsRef.current, hours: opt.hours };
    await run({ topic: topicRef.current }, { ...settingsRef.current });
  };

  const handleRefine = async (label: string, instruction: string) => {
    const text = label.trim();
    if (!text) return;
    push("user", text);
    setInput("");
    await run({ topic: topicRef.current, instruction, currentDraft: currentDraftFromForm() });
  };

  const handleRetry = async () => {
    if (!lastRunRef.current) return;
    const { req, settings } = lastRunRef.current;
    await run(req, settings);
  };

  const resetChat = () => {
    setMessages(INITIAL_MESSAGES);
    idRef.current = 1;
    topicRef.current = "";
    settingsRef.current = { anon: true, hours: null };
    lastRunRef.current = null;
    setStage("topic");
    setTyping(false);
    setInput("");
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (typing) return;
    if (stage === "topic") handleTopic(input);
    else if (stage === "done") handleRefine(input, input);
  };

  /* ------------------------------ chips ------------------------------ */

  const chips: { label: string; onClick: () => void }[] = (() => {
    if (typing) return [];
    switch (stage) {
      case "topic":
        return SUGGESTIONS.map((s) => ({ label: s, onClick: () => handleTopic(s) }));
      case "mode":
        return [
          { label: "Anonymous", onClick: () => handleMode(true) },
          { label: "Authenticated", onClick: () => handleMode(false) },
        ];
      case "expiry":
        return EXPIRY_OPTIONS.map((o) => ({ label: o.label, onClick: () => handleExpiry(o) }));
      case "done":
        return REFINE_ACTIONS.map((a) => ({ label: a.label, onClick: () => handleRefine(a.label, a.instruction) }));
      case "error":
        return [
          { label: "Try again", onClick: handleRetry },
          { label: "Start over", onClick: resetChat },
        ];
      default:
        return [];
    }
  })();

  const canType = !typing && (stage === "topic" || stage === "done");
  const placeholder =
    stage === "topic"
      ? "e.g. Where should we go for team dinner?"
      : stage === "done"
      ? "Ask for a change…"
      : "Choose an option above";

  /* ------------------------------ render ----------------------------- */

  return (
    <>
      {/* Backdrop: small screens only */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile: bottom-sheet popup. Desktop (lg+): sticky side panel. */}
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
        {/* Drag handle (mobile only, decorative) */}
        <div className="flex justify-center pt-2 lg:hidden" aria-hidden="true">
          <span className="h-1 w-10 rounded-full bg-white/15" />
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white">
            {Icons.sparkle}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold leading-tight text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
              PulseHub AI
            </p>
            <p className="text-xs text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Describe it, I'll build the poll
            </p>
          </div>
          <button
            type="button"
            onClick={resetChat}
            title="Start a new chat"
            aria-label="Start a new chat"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-white"
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

        {/* Messages */}
        <div
          ref={listRef}
          className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-4 py-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:my-4 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:min-h-6 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-violet-500/30 hover:[&::-webkit-scrollbar-thumb]:bg-violet-500/50 [@supports(-moz-appearance:none)]:[scrollbar-width:thin] [@supports(-moz-appearance:none)]:[scrollbar-color:rgba(139,92,246,0.35)_transparent]"
          // fully hide scrollbar
          // className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-4 py-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
          aria-live="polite"
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={[
                "max-w-[88%] px-3.5 py-2.5 text-[13px] leading-relaxed",
                m.role === "user"
                  ? "self-end rounded-2xl rounded-tr-md bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
                  : m.error
                  ? "self-start rounded-2xl rounded-tl-md border border-red-500/30 bg-red-500/10 text-red-200"
                  : "self-start rounded-2xl rounded-tl-md border border-white/[0.06] bg-white/[0.04] text-gray-200",
              ].join(" ")}
            >
              {m.text}
            </div>
          ))}

          {typing && (
            <div className="self-start rounded-2xl rounded-tl-md border border-white/[0.06] bg-white/[0.04] px-3.5 py-3" aria-label="AI is working">
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400"
                    style={{ animationDelay: `${i * 140}ms` }}
                  />
                ))}
              </span>
            </div>
          )}

          {chips.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-2">
              {chips.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={c.onClick}
                  className="rounded-full border border-violet-500/40 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-200 transition-colors hover:bg-violet-500/25"
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={onSubmit} className="border-t border-white/[0.06] p-3">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!canType}
              maxLength={300}
              placeholder={placeholder}
              className="min-w-0 flex-1 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-violet-500/50 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
            <button
              type="submit"
              disabled={!canType || !input.trim()}
              aria-label="Send"
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white transition-opacity disabled:opacity-40"
            >
              {Icons.send}
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-gray-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            AI can make mistakes. Review the poll before publishing.
          </p>
        </form>
      </aside>
    </>
  );
}
