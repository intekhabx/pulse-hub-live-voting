import asyncHandler from "../../utils/async-handler.middleware";
import type { Request, Response } from "express";
import pollModel from "./polls.model";
import type { AuthRequest } from "../../types/index.types";
import ApiResponse from "../../utils/api-response.utils";
import ApiError from "../../utils/api-error.utils";
import responseModel from "../response/response.model";
import { io } from "../../server";
import userModel from "../auth/auth.model";


export const createPolls = asyncHandler(async (req: AuthRequest, res: Response)=>{
  // step:1 - extract poll details from body
  const {title, description,expiresAt, questions, allowAnonymous} = req.body;

  // step:2 - create poll
  const poll = await pollModel.create({
    title,
    description,
    allowAnonymous,
    expiresAt,
    questions,
    createdBy: req.user?.id,
  })

  ApiResponse.created(res, "poll created successfylly", {pollId: poll._id});
})



export const getMyPolls = asyncHandler(async (req: AuthRequest, res: Response)=>{
  // step:1 - find all polls in DB
  const polls = await pollModel.find({createdBy: req.user?.id}).sort({createdAt: -1});
  if(!polls){
    throw ApiError.notFound("polls not found");
  }

  // step:2 creating an array to store the response
  const pollResponse = [];

  // step:3 find all responses of every polls
  for (const poll of polls) {
    const res = await responseModel.find({pollId: poll._id});
    pollResponse.push({pollId: poll._id, totalResponse: res.length})
  }

  ApiResponse.ok(res, "polls fetched successfully", {polls, pollResponse});
})



export const getPollById = asyncHandler(async(req: Request, res: Response)=>{
  // step:1 - extract pollId from params
  const pollId = req.params?.pollId;

  const poll = await pollModel.findById(pollId);
  if(!poll){
    throw ApiError.notFound("Poll not found");
  }

  ApiResponse.ok(res, "poll fetched successfully", poll);
})



export const submitVote = asyncHandler(async(req: AuthRequest, res: Response)=>{
  // step:1 - extract answers from body
  const {answers} = req.body;

  // step:2 - find poll using id in params
  const poll = await pollModel.findById(req?.params.pollId);
  if(!poll){
    throw ApiError.notFound("poll not found");
  }

  // step:3 - check poll is expired or not
  if(poll?.expiresAt){
    const expiry = new Date(poll?.expiresAt).getTime();
    const nowTime = Date.now();

    if(expiry < nowTime){
      throw ApiError.badRequest("Poll has expired");
    }
  }

  // step:4 - check poll is for authenticated user or not
  let user;
  if(!poll.allowAnonymous){
    // anonymous can't submit so check user is loggedin or not
    user = await userModel.findById(req?.user?.id);
    if(!user){
      throw ApiError.unAuthorized("please login first to submit the vote");
    }
  }

  // step:5 - store response in DB; if user is logged in then it came here if anonymous is allowed then also
  console.log(user?._id)
  await responseModel.create({
    pollId: poll._id,
    userId: user?._id,
    answers
  })

  // step:6 - update votes count in poll votes //extra
  answers.forEach((ans:any) => {
    // poll.questions.id() --> ye v internally find() ka hi use krta h
    const question = poll.questions.id(ans.questionId);
    // const question = poll.questions.find((q) => q._id.toString() === ans.questionId);
    if(!question) return;

    // questions.options.id() --> ye v internally find() ka hi use krta h
    const option = question.options.id(ans.optionId);
    // const options = question.options.find((o) => o._id.toString() === o.optionId);
    if(!option) return;

    option.votes += 1;
  });

  await poll.save();
  io.emit("pollUpdated");

  ApiResponse.ok(res, "poll submitted successfully");
})



export const getPollAnalytics = asyncHandler(async(req: AuthRequest, res: Response)=>{
  // step:1 - find poll by id, came from params
  const poll = await pollModel.findById(req?.params.pollId);
  if(!poll){
    throw ApiError.notFound("poll not found");
  }

  // step:2 - count total responses
  const totalResponse = await responseModel.countDocuments({
    pollId: poll._id
  })

  ApiResponse.ok(res, "poll analytics fetched", {pollTitle: poll.title, totalResponse, questions: poll.questions});
})