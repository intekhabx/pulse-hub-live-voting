import pollService from "../../../services/pollService";
import { useState } from "react";
import { Icons } from "../Icons";


export function CreatePollSection({ setActive }: { setActive: (s: string) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [allowAnonymous, setAllowAnonymous] = useState(true);
  const [expiresAt, setExpiresAt] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", required: false, options: [{ optionText: "" }, { optionText: "" }] }
  ]);

  const handleSubmit = async ()=>{
    const res = await pollService.createPoll({title, description, allowAnonymous, expiresAt, questions});
    console.log(res);
  }

  const addQuestion = () => setQuestions(q => [...q, { questionText: "", required: false, options: [{ optionText: "" }, { optionText: "" }] }]);
  const removeQuestion = (i: number) => setQuestions(q => q.filter((_, idx) => idx !== i));
  const addOption = (qi: number) => setQuestions(q => q.map((qu, i) => i === qi ? { ...qu, options: [...qu.options, { optionText: "" }] } : qu));
  const removeOption = (qi: number, oi: number) => setQuestions(q => q.map((qu, i) => i === qi ? { ...qu, options: qu.options.filter((_, j) => j !== oi) } : qu));

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-sm text-white bg-white/[0.04] border border-white/[0.08] outline-none focus:border-violet-500/50 transition-all placeholder-gray-600";

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center gap-3">
        <button onClick={() => setActive("polls")} className="text-gray-600 hover:text-gray-300 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Create Poll</h1>
          <p className="text-sm text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>Build and publish a new poll</p>
        </div>
      </div>

      {/* Poll Details */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#13131f] p-6 space-y-4">
        <h2 className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Poll Details</h2>
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Poll Title *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Team Feedback Survey" className={inputCls} style={{ fontFamily: "'DM Sans', sans-serif" }} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Description (optional)</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Add context for your respondents…" rows={2} className={`${inputCls} resize-none`} style={{ fontFamily: "'DM Sans', sans-serif" }} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Expires At</label>
            <input type="datetime-local" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} className={inputCls} style={{ fontFamily: "'DM Sans', sans-serif" }} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Response Mode</label>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => setAllowAnonymous(!allowAnonymous)}
                className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${allowAnonymous ? "bg-violet-600" : "bg-white/10"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${allowAnonymous ? "translate-x-4" : "translate-x-0.5"}`} />
              </button>
              <span className="text-xs text-gray-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>{allowAnonymous ? "Anonymous" : "Authenticated"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((q, qi) => (
          <div key={qi} className="rounded-2xl border border-white/[0.07] bg-[#13131f] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-violet-400 uppercase tracking-widest" style={{ fontFamily: "'DM Sans', sans-serif" }}>Question {qi + 1}</span>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <input type="checkbox" checked={q.required} onChange={e => setQuestions(qs => qs.map((qu, i) => i === qi ? { ...qu, required: e.target.checked } : qu))} className="accent-violet-500" />
                  Required
                </label>
                {questions.length > 1 && (
                  <button onClick={() => removeQuestion(qi)} className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">{Icons.trash}</button>
                )}
              </div>
            </div>
            <input
              value={q.questionText}
              onChange={e => setQuestions(qs => qs.map((qu, i) => i === qi ? { ...qu, questionText: e.target.value } : qu))}
              placeholder="Enter your question…"
              className={inputCls}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
            <div className="space-y-2 pl-2 border-l-2 border-violet-500/20">
              {q.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border border-gray-600 flex-shrink-0" />
                  <input
                    value={opt.optionText}
                    onChange={e => setQuestions(qs => qs.map((qu, i) => i === qi ? { ...qu, options: qu.options.map((o, j) => j === oi ? { optionText: e.target.value } : o) } : qu))}
                    placeholder={`Option ${oi + 1}`}
                    className="flex-1 px-3 py-1.5 rounded-lg text-sm text-gray-300 bg-white/[0.03] border border-white/[0.06] outline-none focus:border-violet-500/40 transition-all placeholder-gray-700"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                  {q.options.length > 2 && (
                    <button onClick={() => removeOption(qi, oi)} className="text-gray-700 hover:text-rose-400 transition-colors flex-shrink-0">{Icons.trash}</button>
                  )}
                </div>
              ))}
              <button onClick={() => addOption(qi)} className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1 mt-1 pl-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                Add option
              </button>
            </div>
          </div>
        ))}
        <button onClick={addQuestion} className="w-full py-3 rounded-2xl border border-dashed border-white/10 text-sm text-gray-500 hover:text-gray-300 hover:border-violet-500/30 transition-all flex items-center justify-center gap-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {Icons.plus} Add Question
        </button>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <button className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 transition-all hover:-translate-y-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Create & Share Poll
        </button>
        <button onClick={handleSubmit} className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-400 border border-white/[0.08] hover:bg-white/[0.04] transition-all" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}