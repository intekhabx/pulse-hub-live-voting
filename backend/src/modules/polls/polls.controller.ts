import asyncHandler from "../../utils/async-handler.middleware";
import type { Request, Response } from "express";
import pollModel from "./polls.model";
import type { AuthRequest, IRecentActivityData } from "../../types/index.types";
import ApiResponse from "../../utils/api-response.utils";
import ApiError from "../../utils/api-error.utils";
import responseModel from "../response/response.model";
import { io } from "../../server";
import type mongoose from "mongoose";
import redis from "../../config/redis.config";
import { pollExpiryQueue } from "../../config/bullmq.config";


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

  // step:3 add poll is created in the recent activity
  const userId = req.user?.id.toString()!;
  await addRecentActivity(userId, {pollId: poll._id.toString(), pollTitle: title, message: "New Poll Created", icon: "create"});

  // step:4 - now add expiry in bullmq queue so whenever poll is expired; worker should add expiry in recent activiry
  const expiryDelayInMiliSecond = new Date(expiresAt).getTime() - Date.now();
  if(expiryDelayInMiliSecond > 0){
    await pollExpiryQueue.add("poll-expiry", 
      {
        pollId: poll._id,
        pollTitle: title,
        userId: req?.user?.id,
      },
      {
        jobId: `poll-expiry-${poll._id.toString()}`, //: colon ka use nhi krna hota h jobId me
        delay: expiryDelayInMiliSecond,
        removeOnComplete: true,
        attempts: 3
      }
    )
  }

  // step:5 - send io response to the frontend
  io.emit("server:poll-created");

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



const getPollDetailedAnalytics = async(pollId: mongoose.Types.ObjectId)=> {
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
    // step:2 - Response collection se is poll ke saare responses lekar
    // "responses" naam ki ek array bana do
    {
      $lookup: {
        from: "responses",
        localField: "_id",
        foreignField: "pollId",
        as: "responses"
      }
    },
    // step:3 - Questions array ko tod do
    // Ek document = Ek question
    {
      $unwind: "$questions"
    },
    // step:4 - Har question ke options ko bhi tod do
    // Ab ek document = Ek option
    {
      $unwind: "$questions.options"
    },
  
    // step:5 - Har option ke kitne votes hain wo calculate karo
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
    // step:6 - Ab dubara question wise group karo
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
    // step:7 - Har option ka percentage calculate karo
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


  return {pollId, totalResponseCount, authenticatedUserCount, anonymousUserCount, authecticatedPercentage, anonymousPercentage, analytics};
}


const updateRedisPollAnalyticsData = async(key: string, answers:{questionId: string, optionId: string}[], userId: string | undefined) => {
  // step:1 - find the redis stored data with key
  const redisCachedPollData = await redis.get(key);

  if(!redisCachedPollData){
    return null;
  }


  const analyticsData = JSON.parse(redisCachedPollData);

  // step:2 - update all 3 response count
  analyticsData.totalResponseCount++;

  if (userId) {
    analyticsData.authenticatedUserCount++;
  } else {
    analyticsData.anonymousUserCount++;
  }

  // step:3 - recalculate overall percentages
  analyticsData.authecticatedPercentage = ((analyticsData.authenticatedUserCount / analyticsData.totalResponseCount) * 100).toFixed(2);
  analyticsData.anonymousPercentage = ((analyticsData.anonymousUserCount / analyticsData.totalResponseCount) * 100).toFixed(2);

  //step:4 - updating the answer
  answers.forEach((answer) => {
    const question = analyticsData.analytics.find(
      (q:any) => q._id === answer.questionId
    );
  
    if (!question) return;
  
    // question vote count increase
    question.totalVotes++;
  
    const option = question.options.find(
      (o:any) => o.optionId === answer.optionId
    );
  
    if (!option) return;
  
    // option vote increase
    option.votes++;
  
    // percentage update
    question.options.forEach((opt:any) => {
      opt.percentage = (opt.votes / question.totalVotes) * 100;
    });
  })
  
  //step:5 - saving the updated analyticsData
  await redis.set(key, JSON.stringify(analyticsData), "EX", 60 * 60 * 24 * 30); //30days

  return analyticsData;
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
  // step:5 - check user is already submitted thier vote or not
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

  // step:6 - store response in DB
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

  // step:7 - now add newResponseReceived in recentActivity of the poll creator
  const pollOwner = poll.createdBy?.toString()!;
  await addRecentActivity(pollOwner, {pollId: poll._id.toString(), pollTitle: poll.title, message: "New Response Received", icon: "response"});

  // step:8 - check the redis DB that polAnalyticsData is present or not and if present then update it
  const key = `poll:${poll._id}`;
  let analyticsData = await updateRedisPollAnalyticsData(key, answers, req?.user?.id?.toString());

  if(!analyticsData){
    // now analyticData is not present in redis then fetch from db and store in redis also
    analyticsData = await getPollDetailedAnalytics(poll._id);
    await redis.set(key, JSON.stringify(analyticsData), "EX", 60 * 60 * 24 * 30); //30days
  }
  
  // step:9 - send io response to the poll creator with the pollAnalyticsData
  io.emit("server:poll-updated", analyticsData);

  ApiResponse.ok(res, "poll submitted successfully");
})



export const getPollAnalytics = asyncHandler(async(req: AuthRequest, res: Response)=>{
  // step:1 - find poll by id, came from params
  const poll = await pollModel.findById(req?.params.pollId);
  if(!poll){
    throw ApiError.notFound("poll not found");
  }

  // step:2 - getPollDetailedAnalytics
  const {pollId, anonymousPercentage, anonymousUserCount, authecticatedPercentage, analytics, authenticatedUserCount, totalResponseCount} = await getPollDetailedAnalytics(poll._id);

  ApiResponse.ok(res, "poll analytics fetched", {title: poll.title, description: poll.description, isPublished: poll.isPublished, allowAnonymous: poll.allowAnonymous, expiresAt: poll.expiresAt, createdAt: poll.createdAt, createdBy: poll.createdBy, pollId, anonymousPercentage, anonymousUserCount, authecticatedPercentage, analytics, authenticatedUserCount, totalResponseCount });
})



export const getAnalyticsPageData = asyncHandler(async(req: AuthRequest, res: Response)=> {
  // step1: - find all polls created by the user
  const polls = await pollModel.find({createdBy: req?.user?.id}).sort({createdAt: -1});
  if(!polls){
    throw ApiError.notFound("Not Found any poll");
  }

  // step:2 - find total responses of every poll
  let anonymousPolls = 0;
  const pollResponses = [];
  for (const poll of polls) {
    if(poll.allowAnonymous){
      anonymousPolls++;
    }
    const totalResponse = await responseModel.find({pollId: poll._id});
    pollResponses.push({pollId: poll._id, totalVoteCount: totalResponse.length, pollTitle: poll.title, expiresAt: poll.expiresAt})
  }

  ApiResponse.ok(res, "analytics page data fetched", {totalPolls: polls.length, anonymousPolls, pollResponses})
})



export const deletePollById = asyncHandler(async (req: AuthRequest, res: Response)=> {
  // step:1 - find poll using the pollId
  const {pollId} = req.params;

  const poll = await pollModel.findById(pollId);
  if(!poll){
    throw ApiError.notFound("poll not found");
  }

  // step:2 - delete all responses of the poll and poll also
  await responseModel.deleteMany({pollId});
  await pollModel.findByIdAndDelete(pollId);

  // step:3 - delete pollAnalytics from redis
  await redis.del(`poll:${pollId}`)

  // step:4 - add poll is deleted in the recent activity
  const userId = req?.user?.id.toString()!;
  await addRecentActivity(userId, {pollId: poll._id.toString() ,pollTitle: poll.title, message: "Poll Deleted", icon: "delete"});

  // step:5 - send io response to the client
  io.emit("server:poll-deleted");

  ApiResponse.ok(res, "Poll deleted successfully");
})



// addRecentActivity helper function
export const addRecentActivity = async (userId: string, activity: IRecentActivityData) => {
  const key = `recent-activity:user:${userId}`;

  await redis.lpush(key, JSON.stringify({
    ...activity,
    time: Date.now(),
  }));

  // Keep only latest 7 activity
  await redis.ltrim(key, 0, 6);

  // Optional: expire after 30 days
  // await redis.expire(key, 60 * 60 * 24 * 30);
}



export const getRecentActivity = asyncHandler(async (req: AuthRequest, res: Response)=> {
  // step:1- extract userId from loggedIn user
  const userId = req?.user?.id;

  // step:2 - find recent activity from the redis
  const key = `recent-activity:user:${userId}`
  const recentActivity = await redis.lrange(key, 0, -1); // all activity data

  if(recentActivity.length === 0){
    throw ApiError.notFound("recent activity not found");
  }

  // step:3 - lrange gives array of string(json); so parse every json to object
  const recentActivities = recentActivity.map((item)=> JSON.parse(item));

  ApiResponse.ok(res, "recent activity fetched successfully", recentActivities);
})
