import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react';
import pollService from '../../services/pollService';
import type { Poll } from '../../components/Dashboard/assets/types';
import axios from 'axios';
import toast from 'react-hot-toast';
import { router } from '../../App';
import authService from '../../services/authService';


interface IPollInputData {
  questionId: string;
  optionId: string;
}


export const Route = createFileRoute('/votes/$pollId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { pollId } = Route.useParams();
  const [loading, setLoading] = useState(false);

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
      const result = await pollService.getPollById(pollId);
      // console.log(result);
      setPollData(result.data);
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
      const response = await pollService.submitVote(pollId, answers);

      console.log(response);
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
    console.log("tempdata",data);
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
    <>
      <div className="h-72 bg-[#0a0a12] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Vote Page</h1>
          <p className="text-gray-400 mt-2">Poll ID: {pollId}</p>
        </div>
      </div>

      <div className="min-h-screen bg-[#0a0a12] text-white py-10 px-4">
        <div className="mx-auto max-w-3xl rounded-2xl border border-gray-800 bg-[#151520] p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-blue-400">
            {pollData?.title}
          </h1>

          <p className="mt-2 text-gray-400">
            {pollData?.description}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            {pollData?.questions?.map((ques, idx) => (
              <div
                key={ques._id}
                className="rounded-xl border border-gray-700 bg-[#1b1b2a] p-5"
              >
                <h2 className="mb-4 text-lg font-semibold">
                  <span className="text-blue-400">Q{idx + 1}.</span>{" "}
                  {ques.questionText}
                  {ques.required ? <span className="text-red-500">*</span> : null}
                </h2>

                <div className="space-y-3">
                  {ques.options?.map((opt) => (
                    <label
                      key={opt._id}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-700 bg-[#232336] px-4 py-3 transition hover:border-blue-500 hover:bg-[#2c2c44]"
                    >
                      <input
                        type="radio"
                        name={ques._id}
                        value={opt._id}
                        className="accent-blue-500"
                        required= {ques.required ? true : false}
                        checked= {pollInputData?.find((item)=> item.questionId === ques._id)?.optionId === opt._id}
                        onChange={()=> handleSelect(ques._id, opt._id)}
                      />

                      <span>{opt.optionText}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold transition hover:bg-blue-700"
            >
              Submit Vote
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
