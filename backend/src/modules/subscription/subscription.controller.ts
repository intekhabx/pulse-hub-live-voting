import type {Response} from "express";
import { SUBSCRIPTION_PLAN_DETAILS } from "../../constants/subscription-plan-details";
import type { AuthRequest, IPollAnalytics } from "../../types/index.types";
import ApiResponse from "../../utils/api-response.utils";
import asyncHandler from "../../utils/async-handler.middleware";
import ApiError from "../../utils/api-error.utils";
import pollModel from "../polls/polls.model";
import { getPollDetailedAnalytics } from "../polls/polls.controller";
import instance from "../../config/razorpay.config";
import subscriptionModel from "./subscription.model";
import { subscriptionCancellationQueue } from "../../config/bullmq.config";
import userModel from "../auth/auth.model";




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



type subscriptionType = "PRO" | "PREMIUM";
const PLAN_ID: Record<subscriptionType, string> = {
  PRO: process.env.RAZORPAY_PRO_PLAN_ID!,
  PREMIUM: process.env.RAZORPAY_PREMIUM_PLAN_ID!,
}

export const createSubscription = asyncHandler(async (req: AuthRequest, res: Response) => {
  // step:1 - Extract and validate plan
  const plan = req.body.plan as "PRO" | "PREMIUM";
  const userId = req.user?.id.toString()!;

  if (plan !== "PRO" && plan !== "PREMIUM") {
    throw ApiError.badRequest("Invalid plan type. Must be PRO or PREMIUM.");
  }

  // step:2 - delete CREATED plan that is not paid by user("ACTIVE" plan is mark as paid)
  await subscriptionModel.deleteMany({
    userId,
    status: "CREATED",
  });

  // step:3 - check existing ACTIVE/CANCELLED Subscriptions
  const activeSubscription = await subscriptionModel.findOne({
    userId,
    status: { $in: ["ACTIVE", "CANCELLED"] },
  }).sort({ currentPeriodStart: -1 });

  if (activeSubscription) {
    // Rule 1: Same Plan Duplicate Check (PRO -> PRO ya PREMIUM -> PREMIUM)
    if (activeSubscription.plan === plan) {
      throw ApiError.conflict(`You already have an active ${plan} plan.`);
    }

    // Rule 2: Downgrade Check (PREMIUM -> PRO)
    if (activeSubscription.plan === "PREMIUM" && plan === "PRO") {
      throw ApiError.badRequest(
        "Downgrading from PREMIUM to PRO is not supported during an active billing period. You can switch after your current plan expires."
      );
    }

    // Rule 3: Upgrade Path (PRO -> PREMIUM)
    if (activeSubscription.plan === "PRO" && plan === "PREMIUM") {
      try {
        // 1. Razorpay par purani PRO subscription cancel karein taaki duplicate auto-debit na ho
        if (activeSubscription.providerSubscriptionId) {
          await instance.subscriptions.cancel(activeSubscription.providerSubscriptionId, false); // Immediate cancel on provider side
        }
      } 
      catch (error: any) {
        console.warn("Notice: Old subscription cancellation on Razorpay ignored:", error?.message);
      }

      // 2. DB me purani subscription ko UPGRADED mark kar dein
      activeSubscription.status = "UPGRADED";
      await activeSubscription.save();
      
      // 3. 🛡️ LAYER 1: REMOVE SCHEDULED BULLMQ JOB
      try {
        const job = await subscriptionCancellationQueue.getJob(`cancel-sub-${activeSubscription._id}`);
        if (job) {
          await job.remove();
          console.log(`[BullMQ] Cleaned up old pending cancel job: cancel-sub-${activeSubscription._id}`);
        }
      } 
      catch (err: any) {
        console.warn("[BullMQ] Job removal error:", err?.message);
      }
    }
  }

  // step:4 - Create New Razorpay Subscription for PREMIUM
  const razorpaySubscription = await instance.subscriptions.create({
    plan_id: PLAN_ID[plan],
    quantity: 1,
    total_count: 12, //total months
    customer_notify: 1,
    notes: {
      userId,
      plan,
    },
  });

  // step:5 - save new Subscription in DB with CREATED status
  const subscription = await subscriptionModel.create({
    userId,
    plan,
    provider: "RAZORPAY",
    providerPlanId: PLAN_ID[plan],
    status: "CREATED", // Webhook activation tak CREATED rahega
    providerSubscriptionId: razorpaySubscription.id,
  });

  const data = {
    subscriptionId: subscription._id,
    razorpaySubscriptionId: razorpaySubscription.id,
    razorpayKeyId: process.env.RAZORPAY_API_KEY,
    plan,
  };

  // step:6 - Send Response
  ApiResponse.created(res, "Subscription plan created successfully", data);
});



export const cancelSubscription = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  // step:1 - Fetch user's ACTIVE subscription from DB
  const subs = await subscriptionModel.findOne({
    userId,
    status: "ACTIVE",
  });

  if (!subs) {
    throw ApiError.notFound("No active subscription found to cancel");
  }

  // step:2 - Call Razorpay Cancel API (Immediate or End-of-cycle)
  try {
    await instance.subscriptions.cancel(subs.providerSubscriptionId, false);
  } 
  catch (error: any) {
    const errorMsg = error?.error?.description || error?.message || "";
    // Safety check for completed/already cancelled subs
    if (!errorMsg.includes("completed") && !errorMsg.includes("cancelled")) {
      throw ApiError.badRequest(errorMsg || "Failed to cancel subscription with Razorpay");
    }
  }

  // step:3 - 💡 UPDATE DB IMMEDIATELY (Don't wait for webhook)
  subs.status = "CANCELLED";
  await subs.save();

  // step:4 - 💡 SCHEDULE BULLMQ JOB RIGHT HERE
  if (subs.currentPeriodEnd) {
    const delayInMs = subs.currentPeriodEnd.getTime() - Date.now();

    if (delayInMs > 0) {
      await subscriptionCancellationQueue.add("subscription-cancellation",
        {
          userId: subs.userId,
          subsId: subs._id,
        },
        {
          jobId: `cancel-sub-${subs._id}`,
          delay: delayInMs,
          removeOnComplete: true,
          attempts: 3,
        }
      );
    } 
    else {
      // Immediate execution fallback (agar delay 0 ya negative ho)
      await userModel.findByIdAndUpdate(userId, { plan: "FREE" });
      subs.status = "EXPIRED";
      await subs.save();
    }
  }

  ApiResponse.ok(res, "Subscription cancelled successfully. Features remain active until the billing period ends.");
});
