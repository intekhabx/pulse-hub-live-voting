import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import pollService from "../services/pollService";
pollService

export function PollPage() {
  const { pollId } = useParams({ from: "/poll/$pollId" });

  const [poll, setPoll] = useState<any>(null);
  const [selected, setSelected] = useState<Record<string, string>>({});

  useEffect(() => {
    pollService.getPollById(pollId).then((res: any) => {
      setPoll(res.data);
    });
  }, [pollId]);

  const handleSelect = (questionId: string, optionId: string) => {
    setSelected((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const answers = Object.entries(selected).map(([questionId, optionId]) => ({
    questionId,
    optionId,
  }));
  const handleSubmit = async () => {
    await pollService.submitVote(pollId, answers);

    alert("Vote submitted!");
  };

  if (!poll) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading poll...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white p-6">
      
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-6">
        <h1 className="text-2xl font-black" style={{ fontFamily: "'Syne', sans-serif" }}>
          {poll.title}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {poll.description}
        </p>
      </div>

      {/* Questions */}
      <div className="max-w-2xl mx-auto space-y-5">
        {poll.questions.map((q: any) => (
          <div
            key={q._id}
            className="rounded-2xl border border-white/[0.07] bg-[#13131f] p-5"
          >
            <h2 className="text-sm font-bold mb-3 text-gray-200">
              {q.questionText}
            </h2>

            <div className="space-y-2">
              {q.options.map((opt: any) => (
                <label
                  key={opt._id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.03] hover:border-violet-500/30 cursor-pointer transition"
                >
                  <input
                    type="radio"
                    name={q._id}
                    onChange={() => handleSelect(q._id, opt._id)}
                    className="accent-violet-500"
                  />
                  <span className="text-sm text-gray-300">
                    {opt.optionText}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 transition"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Submit Vote
        </button>
      </div>
    </div>
  );
}