import { useContext } from "react";
import { Icons } from "./Icons";
import { PollCreationContext, DESCRIPTION_MAX, MAX_OPTIONS, OPTION_LABELS, TITLE_MAX } from "../../Context/PollCreationContext";
import tokenStore from "../../services/tokenStoreService";



export function ManualPollCreation({ setActive }: { setActive: (s: string) => void }) {

  const pollCreationContext = useContext(PollCreationContext);
  if(!pollCreationContext){
    throw new Error("ManualPollCreation must be rendered inside PollCreationContextProvider")
  }

  const {title, setTitle, description, setDescription, allowAnonymous, setAllowAnonymous, expiresAt, setExpiresAt,
      isCreating, isSavingDraft, errors, setErrors, questions, setQuestions, enableCustomBranding, setEnableCustomBranding, handleCancel, handleSubmit, handleSaveAsDraft,
      addQuestion, removeQuestion, addOption, removeOption, totalQuestions, filledQuestions  } = pollCreationContext;

  const {plan} = tokenStore.getUser();

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-sm text-white bg-white/[0.03] border border-white/[0.08] outline-none focus:border-violet-500/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-violet-500/[0.08] transition-all placeholder-gray-600";
  const inputErrCls = "w-full px-3.5 py-2.5 rounded-xl text-sm text-white bg-rose-500/[0.04] border border-rose-500/50 outline-none focus:border-rose-500/70 focus:ring-4 focus:ring-rose-500/[0.08] transition-all placeholder-gray-600";

  return (
    <div className="space-y-4">
      {/* Poll Details */}
      <div className="relative rounded-2xl border border-white/[0.07] bg-[#13131f] p-4 sm:p-6 space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
        <div>
          {/* PREMIUM user can enableCustomBranding*/}
          {plan === "PREMIUM" && (
            <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-300">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Apply Custom Branding</p>
                  <p className="mt-0.5 text-xs text-gray-400">Show your custom logo and primary colors on this poll.</p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={enableCustomBranding}
                onClick={() => setEnableCustomBranding(!enableCustomBranding)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${enableCustomBranding ? "bg-violet-600" : "bg-gray-700"}`}
              >
                <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${enableCustomBranding ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
          )}
        </div>
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
            <span className="text-[11px] text-gray-600 tabular-nums" style={{ fontFamily: "'DM Sans', sans-serif" }}>{description?.length}/{DESCRIPTION_MAX}</span>
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

        {/* expiresAt and allowAnonymous */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            {/* expiresAt */}
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

            {/* expiresAt buttons */}
            <div className="flex flex-wrap gap-2 mt-3">
              {[1, 2, 3, 7].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => {
                    const expiry = new Date();
                    expiry.setDate(expiry.getDate() + days);

                    const formattedDate = new Date(
                      expiry.getTime() - expiry.getTimezoneOffset() * 60000
                    )
                      .toISOString()
                      .slice(0, 16);

                    setExpiresAt(formattedDate);
                  }}
                  className="px-2 py-1 rounded-full text-xs font-medium
                    text-violet-300 bg-violet-500/10
                    border border-violet-500/20
                    hover:bg-violet-500/20 hover:border-violet-500/40
                    transition-all"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {days} {days === 1 ? "day" : "days"}
                </button>
              ))}
            </div>
          </div>

          {/* allowAnonymous */}
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
                  {questions?.length > 1 && (
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
          onClick={()=> handleSubmit({setActive})}
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
          onClick={()=> handleSaveAsDraft({setActive})}
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
          onClick={()=> handleCancel({setActive})}
          disabled={isCreating || isSavingDraft}
          className="px-6 py-3.5 rounded-xl text-sm font-semibold text-gray-400 bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.06] hover:text-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
