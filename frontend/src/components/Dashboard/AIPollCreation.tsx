import { useContext, useEffect, useRef, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { PollCreationContext } from "../../Context/PollCreationContext";
import { Icons } from "./Icons";
import pollService from "../../services/pollService";


type RequireInputSchema = {
  message: string;
  question: string;
  options: string[];
};

type FinalOutputSchema = {
  title: string;
  description: string;
  expiresAt: string;
  allowAnonymous: boolean;
  questions: {
    questionText: string;
    required: boolean;
    options: {
      optionText: string;
    }[];
  }[];
  responseMessage: string;
};

type AIResponseData =
    { type: "require-input"; input: RequireInputSchema }
  | { type: "final-response"; output: FinalOutputSchema };

type Message = {
  id: number;
  role: "ai" | "user";
  text: string;
  options?: string[];
  error?: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onApplied?: () => void;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: 0,
    role: "ai",
    text: "Hi! What should your poll be about? Describe your idea, and I'll help you build the form.",
  },
];

export default function AIPollCreation({ open, onClose, onApplied }: Props) {

  const pollCreationContext = useContext(PollCreationContext);

  if (!pollCreationContext) {
    throw new Error("AIPollCreation must be rendered inside PollCreationContextProvider");
  }

  const { setTitle, setDescription, setAllowAnonymous, setExpiresAt, setQuestions, setErrors } = pollCreationContext;


  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing, open]);


  // function that add messages in chat history
  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };


  // function that apply in ai Agent output response data into form
  const applyAgentResponseIntoForm = (data: FinalOutputSchema) => {
    setTitle(data.title);
    setDescription(data.description);
    setAllowAnonymous(data.allowAnonymous);
    setExpiresAt(data.expiresAt);
    setQuestions(
      data.questions.map((question) => ({
        questionText: question.questionText,
        required: question.required,
        options: question.options.map((option) => ({
          optionText: option.optionText,
        })),
      }))
    );
    // setError as empty
    setErrors({});
  };


  // functiont that call the llm agne get the 
  const callAiAgent = async (e: FormEvent<HTMLFormElement> | null, userInput: string) => {
    e?.preventDefault();

    // step:1 - sanitize the input 
    const prompt = userInput.trim();
    if (!prompt) {
      toast.error("Please enter a message.");
      return;
    }

    if (typing) return;

    //step:2 - add user msg in the chat history
    addMessage({id: Date.now(), role: "user", text: prompt });

    setInput("");
    setTyping(true);

    try {
      // step:3 - call the ai agent to get response
      const res = await pollService.generatePollWithAI(prompt);
      const data: AIResponseData = res.data;
      console.log(data);

      // step:4a - if ai agnet need more input
      if (data.type === "require-input") {
        addMessage({
          id: Date.now() + 1,
          role: "ai",
          text: `${data.input.message}\n${data.input.question}`,
          options: data.input.options,
        });
        return;
      }

      // step:4b - apply ai agent poll_creation output response into form
      applyAgentResponseIntoForm(data.output);

      // step:5 - add Ai response to the chat history
      addMessage({ id: Date.now() + 1, role: "ai", text: data.output.responseMessage });

      // after onApplied close the form in small screen
      onApplied?.();
    } 
    catch (error: unknown) {
      const apiError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      const msg = apiError.response?.data?.message || apiError.message || "Something went wrong while generating the poll.";
      addMessage({ id: Date.now() + 1, role: "ai", text: msg, error: true });
      toast.error("AI couldn't build the poll.");
    }
    finally {
      setTyping(false);
    }
  };

  // function that reset the chat
  const resetChat = () => {
    setMessages(INITIAL_MESSAGES);
    setTyping(false);
    setInput("");
  };

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
                      onClick={() => void callAiAgent(null, option)}
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
          onSubmit={(e) => void callAiAgent(e, input)}
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
              disabled={!input.trim() || typing}
              aria-label="Send"
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white transition-opacity disabled:opacity-40"
            >
              {Icons.send}
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
