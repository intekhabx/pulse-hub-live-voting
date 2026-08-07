import pollService from "../../../services/pollService";
import { useState } from "react";
import { Icons } from "../Icons";
import toast from "react-hot-toast";

const TITLE_MAX = 120;
const DESCRIPTION_MAX = 300;
const MAX_OPTIONS = 8;
const OPTION_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"];

type Question = {
  questionText: string;
  required: boolean;
  options: { optionText: string }[];
};

type Errors = {
  title?: string;
  questions?: { [key: number]: { text?: string; options?: string } };
};

export function CreatePollSection({ setActive }: { setActive: (s: string) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [allowAnonymous, setAllowAnonymous] = useState(true);
  const [expiresAt, setExpiresAt] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { questionText: "", required: false, options: [{ optionText: "" }, { optionText: "" }] }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-sm text-white bg-white/[0.03] border border-white/[0.08] outline-none focus:border-violet-500/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-violet-500/[0.08] transition-all placeholder-gray-600";
  const inputErrCls = "w-full px-3.5 py-2.5 rounded-xl text-sm text-white bg-rose-500/[0.04] border border-rose-500/50 outline-none focus:border-rose-500/70 focus:ring-4 focus:ring-rose-500/[0.08] transition-all placeholder-gray-600";

  const totalQuestions = questions.length;
  const filledQuestions = questions.filter(q => q.questionText.trim() && q.options.filter(o => o.optionText.trim()).length >= 2).length;

  const isDirty =
    title.trim() !== "" ||
    description.trim() !== "" ||
    expiresAt !== "" ||
    questions.some(q => q.questionText.trim() !== "" || q.options.some(o => o.optionText.trim() !== ""));

  const validate = (): { valid: boolean; cleanedQuestions: Question[] } => {
    const newErrors: Errors = { questions: {} };
    let valid = true;

    if (!title.trim()) {
      newErrors.title = "Poll title is required";
      valid = false;
    } else if (title.length > TITLE_MAX) {
      newErrors.title = `Title must be under ${TITLE_MAX} characters`;
      valid = false;
    }

    const cleanedQuestions = questions.map((q, qi) => {
      const cleanedOptions = q.options.filter(o => o.optionText.trim() !== "");
      const qErrors: { text?: string; options?: string } = {};

      if (!q.questionText.trim()) {
        qErrors.text = "Question text is required";
        valid = false;
      }
      if (cleanedOptions.length < 2) {
        qErrors.options = "At least 2 options are required";
        valid = false;
      }

      if (Object.keys(qErrors).length > 0) {
        newErrors.questions![qi] = qErrors;
      }

      return { ...q, options: cleanedOptions };
    });

    setErrors(newErrors);
    return { valid, cleanedQuestions };
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAllowAnonymous(true);
    setExpiresAt("");
    setQuestions([{ questionText: "", required: false, options: [{ optionText: "" }, { optionText: "" }] }]);
    setErrors({});
  };

  const handleSubmit = async () => {
    const { valid, cleanedQuestions } = validate();
    if (!valid) {
      toast.error("Please fix the highlighted fields before submitting");
      return;
    }

    setIsCreating(true);
    try {
      await pollService.createPoll({
        title: title.trim(),
        description: description.trim(),
        allowAnonymous,
        expiresAt,
        questions: cleanedQuestions,
      });
      toast.success("Poll created successfully");
      resetForm();
      setActive("polls"); // redirect to the mypolls section
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong while creating the poll");
    } finally {
      setIsCreating(false);
    }
  };


  const handleSaveAsDraft = async () => {
    const { valid, cleanedQuestions } = validate();
    if (!valid) {
      toast.error("Please fix the highlighted fields before saving");
      return;
    }
  
    setIsSavingDraft(true);
    try {
      await pollService.createPollAsDraft({
        title: title.trim(),
        description: description.trim(),
        allowAnonymous,
        expiresAt,
        questions: cleanedQuestions,
      });
      toast.success("Poll saved as draft");
      resetForm();
      setActive("polls"); //redirect to pollSection
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong while saving the draft");
    } finally {
      setIsSavingDraft(false);
    }
  };


  const handleCancel = () => {
    if (isDirty && !window.confirm("Discard this poll? Your changes will be lost.")) {
      return;
    }
    resetForm();
    setActive("overview");
  };

  const addQuestion = () =>
    setQuestions(q => [...q, { questionText: "", required: false, options: [{ optionText: "" }, { optionText: "" }] }]);

  const removeQuestion = (i: number) => setQuestions(q => q.filter((_, idx) => idx !== i));

  const addOption = (qi: number) =>
    setQuestions(q => q.map((qu, i) => (i === qi ? { ...qu, options: [...qu.options, { optionText: "" }] } : qu)));

  const removeOption = (qi: number, oi: number) =>
    setQuestions(q => q.map((qu, i) => (i === qi ? { ...qu, options: qu.options.filter((_, j) => j !== oi) } : qu)));

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-0 pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={handleCancel}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 bg-white/[0.03] border border-white/[0.06] hover:text-white hover:border-violet-500/30 hover:bg-white/[0.06] transition-all flex-shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>Create Poll</h1>
          <p className="text-xs sm:text-sm text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>Build and publish a new poll</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Poll Details */}
        <div className="relative rounded-2xl border border-white/[0.07] bg-[#13131f] p-4 sm:p-6 space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 flex-shrink-0">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <h2 className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Poll Details</h2>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-gray-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>Poll Title *</label>
              <span className={`text-[11px] tabular-nums ${title.length > TITLE_MAX * 0.9 ? "text-amber-500" : "text-gray-600"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>{title.length}/{TITLE_MAX}</span>
            </div>
            <input
              value={title}
              maxLength={TITLE_MAX}
              onChange={e => {
                setTitle(e.target.value);
                if (errors.title) setErrors(er => ({ ...er, title: undefined }));
              }}
              placeholder="e.g. Team Feedback Survey"
              className={errors.title ? inputErrCls : inputCls}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
            {errors.title && (
              <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-gray-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>Description (optional)</label>
              <span className="text-[11px] text-gray-600 tabular-nums" style={{ fontFamily: "'DM Sans', sans-serif" }}>{description.length}/{DESCRIPTION_MAX}</span>
            </div>
            <textarea
              value={description}
              maxLength={DESCRIPTION_MAX}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add context for your respondents…"
              rows={2}
              className={`${inputCls} resize-none`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Expires At</label>
              <div className="relative group">
                <input
                  type="datetime-local"
                  value={expiresAt}
                  min={new Date().toISOString().slice(0, 16)}
                  onChange={e => setExpiresAt(e.target.value)}
                  className={`${inputCls} pr-10 [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:m-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 group-focus-within:bg-violet-500/20 transition-colors">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4.5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M3 9.5h18M8 2.5v3M16 2.5v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <circle cx="8" cy="14" r="1.1" fill="currentColor"/>
                    <circle cx="12" cy="14" r="1.1" fill="currentColor"/>
                    <circle cx="16" cy="14" r="1.1" fill="currentColor"/>
                  </svg>
                </span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Response Mode</label>
              <div className="grid grid-cols-2 gap-1 p-1 h-[42px] rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setAllowAnonymous(true)}
                  className={`rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    allowAnonymous
                      ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-10-8-10-8a19.4 19.4 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 10 8 10 8a19.5 19.5 0 01-3.14 4.44M14.12 14.12a3 3 0 11-4.24-4.24M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Anonymous
                </button>
                <button
                  type="button"
                  onClick={() => setAllowAnonymous(false)}
                  className={`rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    !allowAnonymous
                      ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/></svg>
                  Authenticated
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-white flex items-center gap-2" style={{ fontFamily: "'Syne', sans-serif" }}>
            <span className="w-6 h-6 rounded-lg bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-400">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M9 9a3 3 0 116 0c0 2-3 2-3 5M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            Questions
          </h2>
          <span className="text-[11px] font-medium text-gray-500 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] tabular-nums" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {filledQuestions}/{totalQuestions} complete
          </span>
        </div>

        <div className="space-y-4">
          {questions.map((q, qi) => {
            const qError = errors.questions?.[qi];
            const isComplete = q.questionText.trim() && q.options.filter(o => o.optionText.trim()).length >= 2;
            return (
              <div
                key={qi}
                className={`rounded-2xl border p-4 sm:p-5 space-y-3 transition-all ${
                  qError ? "border-rose-500/30 bg-rose-500/[0.02]" : "border-white/[0.07] bg-[#13131f] hover:border-white/[0.12]"
                }`}
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
                      isComplete ? "bg-emerald-500/15 text-emerald-400" : "bg-violet-500/15 text-violet-400"
                    }`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {isComplete ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      ) : (
                        qi + 1
                      )}
                    </span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest" style={{ fontFamily: "'DM Sans', sans-serif" }}>Question {qi + 1}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer select-none" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      <input
                        type="checkbox"
                        checked={q.required}
                        onChange={e => setQuestions(qs => qs.map((qu, i) => (i === qi ? { ...qu, required: e.target.checked } : qu)))}
                        className="accent-violet-500 w-3.5 h-3.5"
                      />
                      Required
                    </label>
                    {questions.length > 1 && (
                      <button
                        onClick={() => removeQuestion(qi)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors flex-shrink-0"
                        aria-label={`Remove question ${qi + 1}`}
                      >
                        {Icons.trash}
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <input
                    value={q.questionText}
                    onChange={e => {
                      setQuestions(qs => qs.map((qu, i) => (i === qi ? { ...qu, questionText: e.target.value } : qu)));
                      if (qError?.text) {
                        setErrors(er => ({ ...er, questions: { ...er.questions, [qi]: { ...er.questions?.[qi], text: undefined } } }));
                      }
                    }}
                    placeholder="Enter your question…"
                    className={qError?.text ? inputErrCls : inputCls}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                  {qError?.text && <p className="text-xs text-rose-400 mt-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{qError.text}</p>}
                </div>

                <div className="space-y-2 pl-1">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center text-[10px] font-bold text-gray-500 flex-shrink-0" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {OPTION_LABELS[oi] ?? oi + 1}
                      </span>
                      <input
                        value={opt.optionText}
                        onChange={e => {
                          setQuestions(qs =>
                            qs.map((qu, i) =>
                              i === qi ? { ...qu, options: qu.options.map((o, j) => (j === oi ? { optionText: e.target.value } : o)) } : qu
                            )
                          );
                          if (qError?.options) {
                            setErrors(er => ({ ...er, questions: { ...er.questions, [qi]: { ...er.questions?.[qi], options: undefined } } }));
                          }
                        }}
                        placeholder={`Option ${oi + 1}`}
                        className="flex-1 min-w-0 px-3 py-2 rounded-lg text-sm text-gray-300 bg-white/[0.02] border border-white/[0.06] outline-none focus:border-violet-500/40 focus:bg-white/[0.04] transition-all placeholder-gray-700"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      />
                      {q.options.length > 2 && (
                        <button onClick={() => removeOption(qi, oi)} className="w-6 h-6 flex items-center justify-center text-gray-700 hover:text-rose-400 transition-colors flex-shrink-0" aria-label={`Remove option ${oi + 1}`}>
                          {Icons.trash}
                        </button>
                      )}
                    </div>
                  ))}
                  {qError?.options && <p className="text-xs text-rose-400 pl-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>{qError.options}</p>}
                  <button
                    onClick={() => addOption(qi)}
                    disabled={q.options.length >= MAX_OPTIONS}
                    className="text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1 mt-1.5 pl-1 disabled:text-gray-700 disabled:cursor-not-allowed"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    {q.options.length >= MAX_OPTIONS ? `Max ${MAX_OPTIONS} options` : "Add option"}
                  </button>
                </div>
              </div>
            );
          })}
          <button
            onClick={addQuestion}
            className="w-full py-3 rounded-2xl border border-dashed border-white/10 text-sm font-medium text-gray-500 hover:text-violet-300 hover:border-violet-500/40 hover:bg-violet-500/[0.03] transition-all flex items-center justify-center gap-2"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {Icons.plus} Add Question
          </button>
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={isCreating || isSavingDraft}
            className="flex-1 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {isCreating ? (
              <>
                <svg className="animate-spin mr-2" width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                  <path d="M12 3a9 9 0 019 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Creating poll…
              </>
            ) : (
              "Create & Share Poll"
            )}
          </button>

          <button
            onClick={handleSaveAsDraft}
            disabled={isCreating || isSavingDraft}
            className="flex-1 py-3.5 rounded-xl text-sm font-bold text-gray-300 bg-white/[0.03] border border-white/[0.1] hover:bg-white/[0.06] hover:text-white hover:border-white/20 transition-all disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {isSavingDraft ? (
              <>
                <svg className="animate-spin mr-2" width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                  <path d="M12 3a9 9 0 019 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Saving draft…
              </>
            ) : (
              "Save as Draft"
            )}
          </button>

          <button
            onClick={handleCancel}
            disabled={isCreating || isSavingDraft}
            className="px-6 py-3.5 rounded-xl text-sm font-semibold text-gray-400 bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.06] hover:text-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}