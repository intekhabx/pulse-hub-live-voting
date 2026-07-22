import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import pollService from "../../../services/pollService";
import type { Poll } from "../assets/types";
import { StatusBadge } from "../StatusBadge";
import { Loader } from "../../Loader";

interface PollDetailsSectionProps {
  pollId: string;
}

export function PollDetailsSection({ pollId }: PollDetailsSectionProps) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getPoll() {
      const result = await pollService.getPollById(pollId);
      setPoll(result.data);
    }
    getPoll();
  }, [pollId]);

  if (!poll) {
    return <Loader label="Loading poll details…" className="min-h-[28rem]" />;
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate({ to: "/dashboard" })}
            className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] text-gray-500 transition-colors hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300"
            aria-label="Back to polls"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5m7 7-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-violet-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>Poll details</span>
              <StatusBadge expiresAt={poll.expiresAt} />
            </div>
            <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>{poll.title}</h1>
            {poll.description && <p className="mt-1.5 text-sm leading-relaxed text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>{poll.description}</p>}
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.07] bg-[#13131f] px-3 py-2 text-xs text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {poll.questions.length} questions · {poll.allowAnonymous ? "Anonymous" : "Authenticated"}
        </div>
      </div>

      <div className="space-y-4">
        {poll.questions.map((question, index) => (
          <section key={question._id} className="rounded-2xl border border-white/[0.07] bg-[#13131f] p-5 sm:p-6">
            <div className="mb-4 flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-xs font-bold text-violet-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>{index + 1}</span>
              <h2 className="pt-0.5 text-base font-bold leading-relaxed text-gray-100" style={{ fontFamily: "'Syne', sans-serif" }}>
                {question.questionText}
                {question.required && <span className="ml-1 text-fuchsia-400">*</span>}
              </h2>
            </div>
            <div className="space-y-2 pl-10">
              {question.options.map((option) => (
                <div key={option._id} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3 text-sm text-gray-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <span className="h-4 w-4 rounded-full border border-gray-600" />
                  {option.optionText}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
