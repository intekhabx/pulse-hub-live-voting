import asyncHandler from "../../utils/async-handler.middleware";
import type { Request, Response } from "express";
import pollModel from "./polls.model";
import type { AuthRequest } from "../../types/index.types";
import ApiResponse from "../../utils/api-response.utils";
import ApiError from "../../utils/api-error.utils";


export const createPolls = asyncHandler(async (req: AuthRequest, res: Response)=>{
  // step:1 - extract poll details from body
  const {title, description,expiresAt, question, allowAnonymous} = req.body;

  // step:2 - create poll
  await pollModel.create({
    title,
    description,
    allowAnonymous,
    expiresAt,
    question,
    createdBy: req.user?.id,
  })

  ApiResponse.created(res, "poll created successfylly");
})



export const getMyPolls = asyncHandler(async (req: AuthRequest, res: Response)=>{
  // step:1 - find all polls in DB
  const polls = await pollModel.find({createdBy: req.user?.id}).sort({createdAt: -1});
  if(!polls){
    throw ApiError.notFound("polls not found");
  }

  ApiResponse.ok(res, "polls fetched successfully", polls);
})



export const getPollById = asyncHandler(async(req: Request, res: Response)=>{
  // step:1 - extract pollId from params
  const pollId = req.params?.id;

  const poll = await pollModel.findById(pollId);
  if(!poll){
    throw ApiError.notFound("Poll not found");
  }

  ApiResponse.ok(res, "poll fetched successfully", poll);
})