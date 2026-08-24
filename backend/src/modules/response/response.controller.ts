import type { AuthRequest } from "../../types/index.types";
import ApiError from "../../utils/api-error.utils";
import ApiResponse from "../../utils/api-response.utils";
import asyncHandler from "../../utils/async-handler.middleware";
import pollModel from "../polls/polls.model";
import type {Response} from 'express';
import responseModel from "./response.model";


export const getDashboardData = asyncHandler(async(req: AuthRequest, res: Response)=>{
  // step:1 - find users all poll
  const polls = await pollModel.find({createdBy: req?.user?.id}).sort({createdAt: -1});
  
  const totalPolls = polls.length;

  // step:2 - find total published polls
  const publishedResult = polls.filter((poll)=> poll.isPublished).length;

  // step:3 - find total active polls
  const activePolls = polls.filter((poll)=> {
    return (!poll.expiresAt || (new Date(poll.expiresAt)) > new Date()) && poll.status === "active"
  }).length;

  // step:4 - find total responses
  let totalResponses = 0;
  for (const poll of polls) {
    const response = await responseModel.find({pollId: poll._id});
    totalResponses += response.length;
  }


  // step:5 - send only 6 recent polls
  ApiResponse.ok(res, "dashboard data fetched successfully", {polls: polls.slice(0, 6), totalPolls, publishedResult, activePolls, totalResponses});
})