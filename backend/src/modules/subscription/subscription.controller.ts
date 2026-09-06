import type {Response} from "express";
import { SUBSCRIPTION_PLAN_DETAILS } from "../../constants/subscription-plan-details";
import type { AuthRequest, IPollAnalytics } from "../../types/index.types";
import ApiResponse from "../../utils/api-response.utils";
import asyncHandler from "../../utils/async-handler.middleware";
import ApiError from "../../utils/api-error.utils";
import pollModel from "../polls/polls.model";
import { getPollDetailedAnalytics } from "../polls/polls.controller";




// function that change the ," and \n into ""(double quotes) so csv file dones't confuse
const escapeCSV = (value: string): string => {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
};


const convertPollAnalyticsIntoCSV = (pollAnalytics: IPollAnalytics, title: string, description?: string | null) => {
  // step:1 - create the header(top_column_name) for the csv table
  const headers = [ "pollId", "title", "description", "totalResponseCount", "authenticatedUserCount", "anonymousUserCount", "authenticatedPercentage", "anonymousPercentage", "questionId", "question", "totalVotes", "optionId", "optionText", "votes", "percentage", ];

  // step:2 - create rows for the csv table
  const rows: string[][] = []; 
  
  for (const ques of pollAnalytics.analytics) { 
    for (const opt of ques.options) { 
      rows.push([ 
        String(pollAnalytics.pollId), 
        title,
        description ? description : "",
        String(pollAnalytics.totalResponseCount), 
        String(pollAnalytics.authenticatedUserCount), 
        String(pollAnalytics.anonymousUserCount), 
        String(pollAnalytics.authenticatedPercentage), 
        String(pollAnalytics.anonymousPercentage), 
        
        String(ques._id), 
        ques.question, 
        String(ques.totalVotes), 

        String(opt.optionId), 
        opt.optionText, 
        String(opt.votes), 
        String(opt.percentage), 
      ]); 
    } 
  }

  // step:3 - join the header with , (comma seperated) and rows eachvalue with , 
  return [ 
    headers.map(escapeCSV).join(","), 
    ...rows.map((row) => 
      row.map(escapeCSV).join(",")), 
  ].join("\n");
}







export const getUserPlanDetails = asyncHandler(async (req: AuthRequest, res: Response)=> {
  // step:1 - extract the user plan
  const {plan} = req.query;
  if(!plan || (plan !== "FREE" && plan !== "PRO" && plan !== "PREMIUM")){
    throw ApiError.badRequest("Plan is missing or invalid");
  }

  // step:2 - send only user plans subscription details
  const userPlan = SUBSCRIPTION_PLAN_DETAILS[plan];
  if(!userPlan){
    throw ApiError.badRequest("Plan is invalid");
  }

  // Infinity is not a valid in json so we change infinity into unlimited
  const userPlanDetails = {
    ...userPlan,
    maxPolls: userPlan.maxPolls === Infinity ? "unlimited": userPlan.maxPolls,
    maxActivePolls:  userPlan.maxActivePolls === Infinity ? "unlimited": userPlan.maxActivePolls,
    maxQuestionsPerPoll:  userPlan.maxQuestionsPerPoll === Infinity ? "unlimited": userPlan.maxQuestionsPerPoll,
    maxResponsesPerPoll:  userPlan.maxResponsesPerPoll === Infinity ? "unlimited": userPlan.maxResponsesPerPoll,
  }

  ApiResponse.ok(res, 'Subscription Plan details send successfully', userPlanDetails);
})



export const canFreeUserUseService = asyncHandler(async(req: AuthRequest, res: Response) => {
  // now the user came here so user must be pro or premium
  ApiResponse.ok(res, "User can use this service", true);
})



export const exportAllPollCSV = asyncHandler(async(req: AuthRequest, res: Response) => {
    // step:1 - find every poll and poll should be created by same user
    const polls = await pollModel.find({createdBy: req.user?.id});
    if(!polls || polls.length <= 0) throw ApiError.notFound("Poll doesn't exists or deleted");
  
    // step:2 - here we use Promise.all so analytics_data and csv conversion happens parallel
    // Poll 1: Fetch → Convert
    // Poll 2:          Fetch → Convert
    // Poll 3:                   Fetch → Convert
    const allCSV = await Promise.all(
      polls.map(async (poll) => {
        // get the analytics of the poll
        const pollAnalytics = await getPollDetailedAnalytics(poll._id);
        // convert each poll and its analytics into csv file
        return convertPollAnalyticsIntoCSV(pollAnalytics, poll.title, poll?.description);
      })
    )

    const finalCSV = allCSV.join("\n\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8"); 
    res.setHeader( "Content-Disposition", `attachment; filename="${req.user?.id}-user-polls.csv"` ); 
    res.status(200).send(finalCSV); //here we directly send blob data not json
})
