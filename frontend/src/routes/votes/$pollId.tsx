import { createFileRoute } from '@tanstack/react-router'
import { useContext, useEffect, useState } from 'react';
import pollService from '../../services/pollService';
import type { Poll } from '../../components/Dashboard/assets/types';
import axios from 'axios';
import toast from 'react-hot-toast';
import { router } from '../../App';
import authService from '../../services/authService';
import { DataContext } from '../../Context/ContextApi';
import { Loader } from '../../components/Loader';
import { StatusBadge } from '../../components/Dashboard/StatusBadge';


interface IPollInputData {
  questionId: string;
  optionId: string;
}


export const Route = createFileRoute('/votes/$pollId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { pollId } = Route.useParams();

  const context = useContext(DataContext);
  if (!context) {
    throw new Error("Vote page must be used within ContextApiProvider");
  }
  const { dark } = context;

  const [loading, setLoading] = useState(false);
  const [pollLoading, setPollLoading] = useState(true);

  const [pollData, setPollData] = useState<Poll | null>();


  const [pollInputData, setPollInputData] = useState<IPollInputData[]>([]);

  const handleSelect = (questionId: string, optionId: string) => {
    setPollInputData((prev) => {
      // find the index of the question if already selected
      const index = prev?.findIndex((item)=> {
        return item?.questionId === questionId
      })

      if (index !== -1) {
        // Update existing answer
        const updated = [...prev];
        updated[index] = { questionId, optionId };
        return updated;
      }
  
      // Add new answer
      return [...prev, { questionId, optionId }];
    })
  }

  useEffect(() => {
    async function getPollById(){
      try {
        const result = await pollService.getPollById(pollId);
        setPollData(result.data);
      } finally {
        setPollLoading(false);
      }
    }
    getPollById();
  }, []);
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)=> {
    setLoading(true);
    e.preventDefault();

    // step:1 - get data from form
    const formData = new FormData(e.currentTarget);

    // step:2 - creating an array of question and option
    const answers: { questionId: string; optionId: string}[] = [];

    // step:3 - push all {questionId, optionId} in the answers array
    for (const [questionId, optionId] of formData.entries()) {
      answers.push({
        questionId,
        optionId: optionId.toString()
      })
    }

    try {
      await pollService.submitVote(pollId, answers);
      localStorage.removeItem("tempPollData");
      setPollInputData([]);
      toast.success("poll submitted successfully");
    } 
    catch (err) {
      if(axios.isAxiosError(err) && err?.response?.status === 401 && err?.response?.data.message === "please login first to submit the vote"){
        toast.error(err?.response?.data.message);
        
        localStorage.setItem("tempPollData", JSON.stringify(answers));
        router.navigate({
          href: `/login?next=${encodeURIComponent(`/votes/${pollId}`)}`,
        })
      }
      else if (axios.isAxiosError(err)) {
        console.log(err.response?.status);
        console.log(err.response?.data);
        toast.error(err.response?.data.message ?? "Something went wrong");
      }
      else {
        console.error(err);
        toast.error("Unexpected error");
      }
    } 
    finally {
      setLoading(false);
    }
  }

  // getTempPollData to autofill the poll
  useEffect(()=> {
    const data = localStorage.getItem("tempPollData");
    if(data){
      setPollInputData(JSON.parse(data));
    }
  }, [])



  // to get the anonymousId for the unauthorized user
  useEffect(()=> {
    async function addOrVerifyUserSession() {
      await authService.getUserSession();
    }
    addOrVerifyUserSession();
  }, [])

  return (
    <div className={`relative min-h-screen overflow-hidden px-4 pb-8 pt-28 transition-colors duration-300 sm:px-6 sm:pb-12 sm:pt-32 ${dark ? "bg-[#0a0a12] text-white" : "bg-[#f7f6ff] text-gray-950"}`}>
      {/* Background treatment shared with the landing page */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={`absolute left-1/2 top-[-15rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full blur-[120px] ${dark ? "bg-violet-600/15" : "bg-violet-400/20"}`} />
        <div className={`absolute right-[-8rem] top-1/3 h-72 w-72 rounded-full blur-[100px] ${dark ? "bg-fuchsia-500/10" : "bg-fuchsia-400/15"}`} />
        <svg className={`absolute inset-0 h-full w-full ${dark ? "opacity-[0.04]" : "opacity-[0.06]"}`} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="vote-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill={dark ? "white" : "black"} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#vote-dots)" />
        </svg>
      </div>

      <main className="relative z-10 mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-center gap-3 sm:mb-8">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
              <path d="M3 12h3l3-8 4 16 3-8 3 4h2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className={`text-lg font-black tracking-tight ${dark ? "text-white" : "text-gray-950"}`} style={{ fontFamily: "'Syne', sans-serif" }}>
            Pulse<span className="text-violet-500">Hub</span>
          </span>
        </div>

        {pollLoading ? <Loader label="Loading poll…" className="min-h-[28rem]" /> : <div className={`overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl transition-colors duration-300 sm:rounded-3xl ${dark ? "border-white/[0.08] bg-[#13131f]/90 shadow-black/40" : "border-violet-100 bg-white/90 shadow-violet-200/60"}`}>
          <div className={`border-b bg-gradient-to-r from-violet-500/[0.08] via-transparent to-fuchsia-500/[0.08] px-6 py-6 sm:px-8 sm:py-8 ${dark ? "border-white/[0.07]" : "border-violet-100"}`}>
            <div className={`mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1.5 text-xs font-semibold ${dark ? "text-emerald-300" : "text-emerald-700"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <StatusBadge expiresAt={pollData ? pollData?.expiresAt : ""} />
            </div>
            <h1 className={`text-3xl font-black tracking-tight sm:text-4xl ${dark ? "text-white" : "text-gray-950"}`} style={{ fontFamily: "'Syne', sans-serif" }}>
              {pollData?.title}
            </h1>

            {pollData?.description && (
              <p className={`mt-3 max-w-2xl text-sm leading-relaxed sm:text-base ${dark ? "text-gray-400" : "text-gray-600"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {pollData.description}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:space-y-6 sm:p-8">
            {pollData?.questions?.map((ques, idx) => (
              <div
                key={ques._id}
                className={`rounded-2xl border p-5 transition-colors duration-200 sm:p-6 ${dark ? "border-white/[0.07] bg-white/[0.025] hover:border-violet-500/20" : "border-gray-200 bg-[#fcfbff] hover:border-violet-300 hover:shadow-sm"}`}
              >
                <div className="mb-5 flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-xs font-bold text-violet-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {idx + 1}
                  </span>
                  <h2 className={`pt-0.5 text-base font-bold leading-relaxed sm:text-lg ${dark ? "text-gray-100" : "text-gray-900"}`} style={{ fontFamily: "'Syne', sans-serif" }}>
                  {ques.questionText}
                    {ques.required ? <span className="ml-1 text-fuchsia-400">*</span> : null}
                  </h2>
                </div>

                <div className="space-y-3">
                  {ques.options?.map((opt) => {
                    const isSelected = pollInputData?.find((item) => item.questionId === ques._id)?.optionId === opt._id;

                    return (
                      <label
                        key={opt._id}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition-all duration-200 ${
                          isSelected
                            ? dark
                              ? "border-emerald-500/60 bg-emerald-500/[0.10] text-white"
                              : "border-emerald-500/70 bg-emerald-50 text-gray-900"
                            : dark
                              ? "border-white/[0.07] bg-white/[0.025] text-gray-300 hover:border-violet-500/40 hover:bg-violet-500/[0.06] hover:text-white"
                              : "border-gray-200 bg-white text-gray-700 hover:border-violet-300 hover:bg-violet-50/50 hover:text-gray-950"
                        }`}
                      >
                        <input
                          type="radio"
                          name={ques._id}
                          value={opt._id}
                          className="peer sr-only"
                          required= {ques.required ? true : false}
                          checked= {isSelected}
                          onChange={()=> handleSelect(ques._id, opt._id)}
                        />
                        <span className={`relative flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-colors peer-checked:border-emerald-400 peer-checked:bg-emerald-500 after:h-1.5 after:w-1.5 after:rounded-full after:bg-white after:opacity-0 after:transition-opacity peer-checked:after:opacity-100 ${dark ? "border-slate-500" : "border-slate-400"}`} />
                        <span className="text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>{opt.optionText}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="group mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-violet-500 hover:to-fuchsia-500 hover:shadow-violet-500/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {loading ? <><svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" /><path d="M12 3a9 9 0 019 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg> Submitting…</> : "Submit Vote"}
              {!loading && (
                <svg className="transition-transform duration-200 group-hover:translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </form>
        </div>}
        <p className={`mt-5 text-center text-xs ${dark ? "text-gray-600" : "text-gray-500"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Your response is securely recorded by PulseHub.
        </p>
      </main>
    </div>
  )
}
