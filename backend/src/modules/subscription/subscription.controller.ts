import type {Response} from "express";
import { SUBSCRIPTION_PLAN_DETAILS } from "../../constants/subscription-plan-details";
import type { AuthRequest } from "../../types/index.types";
import ApiResponse from "../../utils/api-response.utils";
import asyncHandler from "../../utils/async-handler.middleware";
import ApiError from "../../utils/api-error.utils";



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
