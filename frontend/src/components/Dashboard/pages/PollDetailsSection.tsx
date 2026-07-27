import { useEffect, useState } from "react";
import pollService from "../../../services/pollService";
import type { IPollAnalytics } from "../assets/types";
import { StatusBadge } from "../StatusBadge";
import { Loader } from "../../Loader";

interface PollDetailsSectionProps {
  pollId: string;
}

export function PollDetailsSection({ pollId }: PollDetailsSectionProps) {
  const [poll, setPoll] = useState<IPollAnalytics | null>(null);

  useEffect(() => {
    async function getPoll() {
      const result = await pollService.getPollAnalytics(pollId);
      setPoll(result.data);
    }
    getPoll();
  }, [pollId]);

  if (!poll) {
    return <Loader label="Loading poll details…" className="min-h-[28rem]" />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
  
      {/* Header */}
      <div className="flex items-center justify-between">
  
        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="
              text-xs
              font-semibold
              uppercase
              tracking-widest
              text-orange-400
            ">
              Poll Analytics
            </span>
  
            <StatusBadge expiresAt={poll.expiresAt} />
          </div>
  
  
          <h1 className="
            text-xl
            font-bold
            text-white
          ">
            {poll.title}
          </h1>
  
  
          {
            poll.description && (
              <p className="
                mt-1
                text-sm
                text-gray-500
              ">
                {poll.description}
              </p>
            )
          }
  
        </div>
  
  
  
        <button className="inline-flex items-center gap-2 rounded-xl border border-teal-400/20 bg-gradient-to-r from-teal-500 via-teal-500 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 ring-1 ring-teal-400/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-teal-500/40 active:scale-95 cursor-pointer">
          Publish Your Poll
        </button>
  
  
      </div>
  
  
  
  
  
      {/* Stats */}
      <div className="
        grid
        grid-cols-2
        gap-4
        lg:grid-cols-4
      ">
  
  
        <div className="
          rounded-xl
          border border-white/[0.08]
          bg-[#13131f]
          p-4
        ">
  
          <p className="text-xs text-gray-500">
            Total Responses
          </p>
  
          <h2 className="
            mt-2
            text-2xl
            font-bold
            text-orange-400
          ">
            {poll.totalResponseCount}
          </h2>
  
        </div>
  
  
  
  
  
        <div className="
          rounded-xl
          border border-white/[0.08]
          bg-[#13131f]
          p-4
        ">
  
          <p className="text-xs text-gray-500">
            Authenticated
          </p>
  
          <h2 className="
            mt-2
            text-2xl
            font-bold
            text-orange-400
          ">
            {poll.authenticatedUserCount}
          </h2>
  
        </div>
  
  
  
  
  
        <div className="
          rounded-xl
          border border-white/[0.08]
          bg-[#13131f]
          p-4
        ">
  
          <p className="text-xs text-gray-500">
            Anonymous
          </p>
  
          <h2 className="
            mt-2
            text-2xl
            font-bold
            text-violet-400
          ">
            {poll.anonymousUserCount}
          </h2>
  
        </div>
  
  
  
  
  
        <div className="
          rounded-xl
          border border-white/[0.08]
          bg-[#13131f]
          p-4
        ">
  
          <p className="text-xs text-gray-500">
            Questions
          </p>
  
          <h2 className="
            mt-2
            text-2xl
            font-bold
            text-white
          ">
            {poll.analytics.length}
          </h2>
  
        </div>
  
  
      </div>
  
  
  
  
  
  
  
      {/* Distribution */}
      <div className="
        rounded-xl
        border border-white/[0.08]
        bg-[#13131f]
        p-5
      ">
  
  
        <div className="mb-5">
  
          <h3 className="
            text-sm
            font-semibold
            text-white
          ">
            Response Distribution
          </h3>
  
  
          <p className="
            text-xs
            text-gray-500
          ">
            User participation overview
          </p>
  
        </div>
  
  
  
  
  
        <div className="
          flex
          items-center
          justify-between
          gap-8
        ">
  
  
          {/* Left Details */}
          <div className="
            flex-1
            space-y-4
          ">
  
  
            {/* Auth */}
            <div className="
              flex
              items-center
              justify-between
              rounded-xl
              border border-orange-500/20
              bg-orange-500/[0.05]
              px-4
              py-3
            ">
  
  
              <div className="flex items-center gap-3">
  
                <span className="
                  h-3
                  w-3
                  rounded-full
                  bg-orange-500
                "/>
  
  
                <div>
  
                  <p className="
                    text-xs
                    text-gray-500
                  ">
                    Authenticated Users
                  </p>
  
  
                  <p className="
                    text-sm
                    font-semibold
                    text-white
                  ">
                    {poll.authenticatedUserCount} votes
                  </p>
  
                </div>
  
  
              </div>
  
  
  
              <span className="
                text-lg
                font-bold
                text-orange-400
              ">
                {poll.authecticatedPercentage.toFixed(1)}%
              </span>
  
  
            </div>
  
  
  
  
  
            {/* Anonymous */}
            <div className="
              flex
              items-center
              justify-between
              rounded-xl
              border border-violet-500/20
              bg-violet-500/[0.05]
              px-4
              py-3
            ">
  
  
              <div className="flex items-center gap-3">
  
  
                <span className="
                  h-3
                  w-3
                  rounded-full
                  bg-violet-500
                "/>
  
  
                <div>
  
                  <p className="
                    text-xs
                    text-gray-500
                  ">
                    Anonymous Users
                  </p>
  
  
                  <p className="
                    text-sm
                    font-semibold
                    text-white
                  ">
                    {poll.anonymousUserCount} votes
                  </p>
  
  
                </div>
  
  
              </div>
  
  
  
              <span className="
                text-lg
                font-bold
                text-violet-400
              ">
                {poll.anonymousPercentage.toFixed(1)}%
              </span>
  
  
            </div>
  
  
  
          </div>
  
  
  
  
  
  
          {/* Donut Right */}
          <div
            className="
              relative
              flex
              h-36
              w-36
              shrink-0
              items-center
              justify-center
              rounded-full
            "
            style={{
              background: `
                conic-gradient(
                  #f97316 ${poll.authecticatedPercentage}%,
                  #8b5cf6 ${poll.authecticatedPercentage}% 100%
                )
              `
            }}
          >
  
            <div className="
              flex
              h-28
              w-28
              flex-col
              items-center
              justify-center
              rounded-full
              bg-[#13131f]
            ">
  
  
              <span className="
                text-2xl
                font-bold
                text-white
              ">
                {poll.totalResponseCount}
              </span>
  
  
              <span className="
                text-[11px]
                text-gray-500
              ">
                Votes
              </span>
  
  
            </div>
  
  
          </div>
  
  
        </div>
  
  
      </div>
  
  
  
  
  
  
  
      {/* Questions */}
      <div className="
        grid
        grid-cols-1
        gap-5
        lg:grid-cols-2
      ">
  
  
        {
          poll.analytics.map((obj,index)=>(
  
            <section
              key={obj._id}
              className="
                rounded-xl
                border border-white/[0.08]
                bg-[#13131f]
                p-5
              "
            >
  
  
              <div className="
                mb-5
                flex
                items-start
                gap-3
              ">
  
  
                <div className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-violet-500/10
                  text-xs
                  font-bold
                  text-violet-400
                ">
                  {index + 1}
                </div>
  
  
  
                <div>
  
                  <h3 className="
                    text-sm
                    font-semibold
                    text-white
                  ">
                    {obj.question}
                  </h3>
  
  
                  <p className="
                    mt-1
                    text-xs
                    text-gray-500
                  ">
                    {obj.totalVotes} responses
                  </p>
  
  
                </div>
  
  
              </div>
  
  
  
  
  
              <div className="space-y-4">
  
  
                {
                  obj.options.map((option)=>(
  
                    <div key={option.optionId}>
  
  
                      <div className="
                        mb-2
                        flex
                        items-center
                        justify-between
                      ">
  
  
                        <span className="
                          text-xs
                          text-gray-300
                        ">
                          {option.optionText}
                        </span>
  
  
  
                        <div className="
                          flex
                          items-center
                          gap-2
                        ">
  
  
                          <span className="
                            text-xs
                            text-gray-500
                          ">
                            {option.votes}
                          </span>
  
  
  
                          <span className="
                            rounded-md
                            border border-orange-500/20
                            bg-orange-500/10
                            px-2
                            py-1
                            text-[11px]
                            font-semibold
                            text-orange-400
                          ">
                            {option.percentage.toFixed(1)}%
                          </span>
  
  
                        </div>
  
  
                      </div>
  
  
  
  
  
                      <div className="
                        h-1.5
                        overflow-hidden
                        rounded-full
                        bg-white/[0.08]
                      ">
  
  
                        <div
                          className="
                            h-full
                            rounded-full
                            bg-gradient-to-r
                            from-orange-600
                            via-orange-500
                            to-yellow-400
                            shadow-[0_0_10px_rgba(249,115,22,0.35)]
                            transition-all
                            duration-700
                          "
                          style={{
                            width:`${option.percentage}%`
                          }}
                        />
  
  
                      </div>
  
  
                    </div>
  
                  ))
                }
  
  
              </div>
  
  
            </section>
  
  
          ))
        }
  
  
      </div>
  
  
    </div>
  );
}
