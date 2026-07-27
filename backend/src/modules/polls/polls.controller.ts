import asyncHandler from "../../utils/async-handler.middleware";
import type { Request, Response } from "express";
import pollModel from "./polls.model";
import type { AuthRequest } from "../../types/index.types";
import ApiResponse from "../../utils/api-response.utils";
import ApiError from "../../utils/api-error.utils";
import responseModel from "../response/response.model";
import { io } from "../../server";
import type mongoose from "mongoose";


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
    pollResponse.push({pollId: poll._id, totalResponse: res.length, expiresAt: poll.expiresAt})
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



export const getPollDetailedAnalytics = async(pollId: mongoose.Types.ObjectId)=> {
  // step:1 - find total poll response
  const totalResponses = await responseModel.find({pollId});

  // step:2 - find the total, authenticated and anonymous response count
  const totalResponseCount = totalResponses.length;
  const authenticatedUserCount = totalResponses.filter((r)=> r.userId).length;
  const anonymousUserCount = totalResponseCount - authenticatedUserCount;

  // step:3 - finding percentage of both authecticated and anonymous User
  const authecticatedPercentage = (authenticatedUserCount / totalResponseCount) * 100;
  const anonymousPercentage = (anonymousUserCount / totalResponseCount) * 100;

  // step:4 - finding each answers optionVotes count and their percentage
  const analytics = await pollModel.aggregate([
    // step:1 - Sirf us poll ko select karo jiska analytics chahiye
    {
      $match: {
        _id: pollId
      }
    },
  
    // Step:2 - Response collection se is poll ke saare responses lekar
    // "responses" naam ki ek array bana do
    {
      $lookup: {
        from: "responses",
        localField: "_id",
        foreignField: "pollId",
        as: "responses"
      }
    },
  
    // Step 3: Questions array ko tod do
    // Ek document = Ek question
    {
      $unwind: "$questions"
    },
  
    // Step 4: Har question ke options ko bhi tod do
    // Ab ek document = Ek option
    {
      $unwind: "$questions.options"
    },
  
    // Step 5: Har option ke kitne votes hain wo calculate karo
    {
      $addFields: {
  
        votes: {
  
          // Count nikalo
          $size: {
  
            // Sirf wahi answers rakho jinka optionId
            // current option ke _id ke equal ho
            $filter: {
  
              // Saare responses ke answers ko
              // ek hi array me convert karo
              input: {
  
                $reduce: {
  
                  // responses array
                  input: "$responses",
  
                  // Empty array se start karo
                  initialValue: [],
  
                  // Har response ke answers ko
                  // previous array me add karte jao
                  in: {
  
                    $concatArrays: [
                      "$$value",
                      "$$this.answers"
                    ]
  
                  }
  
                }
  
              },
  
              // Har answer ko "answer" naam se access karenge
              as: "answer",
  
              // Agar answer.optionId == current option._id
              // to us answer ko include karo
              cond: {
                $eq: [
                  "$$answer.optionId",
                  "$questions.options._id"
                ]
              }
  
            }
  
          }
  
        }
  
      }
    },
  
    // Step 6: Ab dubara question wise group karo
    {
      $group: {
  
        // Group by question id
        _id: "$questions._id",
  
        // Question text
        question: {
          $first: "$questions.questionText"
        },
  
        // Total votes of all options
        totalVotes: {
          $sum: "$votes"
        },
  
        // Options array bana do
        options: {
  
          $push: {
  
            optionId: "$questions.options._id",
  
            optionText: "$questions.options.optionText",
  
            votes: "$votes"
  
          }
  
        }
  
      }
    },
  
    // Step 7: Har option ka percentage calculate karo
    {
      $addFields: {
  
        options: {
  
          $map: {
  
            // Options array ke upar loop
            input: "$options",
  
            // Har option ko opt naam do
            as: "opt",
  
            // Naya option object return karo
            in: {
  
              optionId: "$$opt.optionId",
  
              optionText: "$$opt.optionText",
  
              votes: "$$opt.votes",
  
              percentage: {
  
                // Agar vote hi nahi aaye
                // to percentage = 0
                $cond: [
  
                  {
                    $eq: [
                      "$totalVotes",
                      0
                    ]
                  },
  
                  0,
  
                  // warna
                  // (optionVotes / totalVotes) * 100
                  {
  
                    $multiply: [
  
                      {
  
                        $divide: [
  
                          "$$opt.votes",
  
                          "$totalVotes"
  
                        ]
  
                      },
  
                      100
  
                    ]
  
                  }
  
                ]
  
              }
  
            }
  
          }
  
        }
  
      }
  
    }
  
  ]);


  return {totalResponseCount, authenticatedUserCount, anonymousUserCount, authecticatedPercentage, anonymousPercentage, analytics};
}


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
  if(!poll.allowAnonymous && !req?.user?.id){
    throw ApiError.unAuthorized("please login first to submit the vote");
  }

  const anonymousId = req?.signedCookies?.anonymousId;

  // step:6 - check user is already submitted thier vote or not
  let alreadyVoted;
  if(req?.user?.id){
    alreadyVoted = await responseModel.findOne({userId: req.user.id, pollId: poll._id});
  }
  else if(anonymousId){
    alreadyVoted = await responseModel.findOne({anonymousId, pollId: poll._id});
  }
  else{
    throw ApiError.badRequest("session not found, please refresh the page and try again");
  }

  if(alreadyVoted){
    throw ApiError.conflict("you already submitted your vote");
  }

  // step:7 - store response in DB
  if(req?.user?.id){
    await responseModel.create({
      pollId: poll._id,
      userId: req.user.id,
      answers
    })
  }
  else{
    await responseModel.create({
      pollId: poll._id,
      anonymousId,
      answers
    })
  }

  // step:8 - send io response to the poll creator with totalPollCount
  // const data = await getPollDetailedAnalytics(poll._id);
  const totalPollResponse = await responseModel.find({pollId: poll._id});
  io.emit("server:poll-updated", {totalPollResponse, totalPollCount: totalPollResponse.length});

  ApiResponse.ok(res, "poll submitted successfully");
})



export const getPollAnalytics = asyncHandler(async(req: AuthRequest, res: Response)=>{
  // step:1 - find poll by id, came from params
  const poll = await pollModel.findById(req?.params.pollId);
  if(!poll){
    throw ApiError.notFound("poll not found");
  }

  // step:2 - getPollDetailedAnalytics
  const {anonymousPercentage, anonymousUserCount, authecticatedPercentage, analytics, authenticatedUserCount, totalResponseCount} = await getPollDetailedAnalytics(poll._id);

  ApiResponse.ok(res, "poll analytics fetched", {title: poll.title, description: poll.description, isPublished: poll.isPublished, allowAnonymous: poll.allowAnonymous, expiresAt: poll.expiresAt, createdAt: poll.createdAt, createdBy: poll.createdBy , anonymousPercentage, anonymousUserCount, authecticatedPercentage, analytics, authenticatedUserCount, totalResponseCount });
})