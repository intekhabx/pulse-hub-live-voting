import crypto from "node:crypto";
import type { Request, Response } from "express";
import subscriptionModel from "./subscription.model.js";
import asyncHandler from "../../utils/async-handler.middleware.js";
import ApiError from "../../utils/api-error.utils.js";
import userModel from "../auth/auth.model.js";
import { subscriptionCancellationQueue } from "../../config/bullmq.config.js";


export const razorpayWebhook = asyncHandler( async(req: Request, res: Response) => {
  // step:1 - extract the webhook secret from env file
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) throw ApiError.badRequest("Webhook secret is not configured in environment variables");

  // step:2 - extract the hashed signature form req hearder that is comming form razorpay
  const signature = req.headers["x-razorpay-signature"];
  if (!signature) {
    throw ApiError.badRequest("Missing Razorpay signature");
  }

  // step:3 - Verification using raw body buffer (req.body MUST be a Buffer)
  const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body));
  const expectedSignature = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

  if(expectedSignature !== signature){
    console.warn("⚠️ Invalid Razorpay Webhook Signature");
    return res.status(400).json({ status: "error", message: "Invalid webhook signature" });
  }

  // step:4 - Parse JSON Payload and extract event and payload
  const bodyString = rawBody.toString("utf-8");
  const {event, payload} = JSON.parse(bodyString);
  console.log(`🔔 Webhook received: ${event}`);

  // step:5 - Extract Subscription Object
  const razorpaySubscription = payload?.subscription?.entity;

  if (!razorpaySubscription) {
    return res.status(200).json({ status: "ok", message: "Event ignored (Not a subscription event)" });
  }

  const subscriptionId = razorpaySubscription.id;

  // step:6 - update the DB based on the event string
  switch (event) {
    case "subscription.activated": {
      // 1. Update subscription document in the Db
      const subs = await subscriptionModel.findOneAndUpdate(
        { providerSubscriptionId: subscriptionId },
        {
          status: "ACTIVE",
          currentPeriodStart: razorpaySubscription.current_start
            ? new Date(razorpaySubscription.current_start * 1000)
            : undefined,
          currentPeriodEnd: razorpaySubscription.current_end
            ? new Date(razorpaySubscription.current_end * 1000)
            : undefined,
        },
        {returnDocument: "after"}
      );

      // 2. User Document Ko FREE se PRO Upgrade Karein 🚀
      if (subs) {
        await userModel.findByIdAndUpdate(subs.userId, {
          plan: subs.plan
        });
      }
      break;
    }

    case "subscription.charged": { // 👈 Charged, when user plan is renewed by autopay
      // 1. Update subscription document in the Db
      const subs = await subscriptionModel.findOneAndUpdate(
        { providerSubscriptionId: subscriptionId },
        {
          status: "ACTIVE",
          currentPeriodStart: razorpaySubscription.current_start
            ? new Date(razorpaySubscription.current_start * 1000)
            : undefined,
          currentPeriodEnd: razorpaySubscription.current_end
            ? new Date(razorpaySubscription.current_end * 1000)
            : undefined,
        },
        {returnDocument: "after"}
      );

      // 2. update the user obj in DB based on plan (PRO, PREMIUM)
      if (subs) {
        await userModel.findByIdAndUpdate(subs.userId, {
          plan: subs.plan
        });
      }
      break;
    }

    case "subscription.halted": {
      // 1. Update subscription document in the Db on payment failure
      const subs = await subscriptionModel.findOneAndUpdate(
        { providerSubscriptionId: subscriptionId },
        { status: "HALTED" },
        {returnDocument: "after"}
      );

      //2. update the user documnet in the DB
      if(subs){
        await userModel.findByIdAndUpdate(subs.userId, {
          plan: "FREE"
        })
      }
      break;
    }

    case "subscription.cancelled": {
      // 1. find the subscription
      const subs = await subscriptionModel.findOne({ providerSubscriptionId: subscriptionId });
      if (!subs) break;

      // 🛡️ GUARD: Agar controller ne upgrade ke waqt status UPGRADED mark kar diya tha,
      // toh late-arriving cancellation webhook ko bilkul IGNORE kar do!
      if (subs.status === "UPGRADED") {
        console.log(`[Webhook] Skipping cancellation webhook because subscription ${subs._id} was UPGRADED.`);
        break; // Return early, NO DB update, NO BullMQ job scheduled!
      }

      // Normal cancellation processing...
      subs.status = "CANCELLED";
      await subs.save();
    
      // 2. Call the BullMQ worker that runs after currentPeriodEnd
      if (subs && subs.currentPeriodEnd) {

        const delayInMs = subs.currentPeriodEnd.getTime() - Date.now();
    
        // Safety Check: Agar subscription ka end-time already pass ho chuka hai (delay <= 0)
        if (delayInMs > 0) {
          await subscriptionCancellationQueue.add("subscription-cancellation",
            {
              userId: subs.userId,
              subsId: subs._id,
            },
            {
              jobId: `cancel-sub-${subs._id}`,
              delay: delayInMs, // delay in milisecond from now to start worker
              removeOnComplete: true,
              attempts: 3,
            }
          );
        } 
        else {
          // Immediate execution fallback (agar delay 0 ya negative ho)
          await userModel.findByIdAndUpdate(subs.userId, {
            plan: "FREE",
          });
          subs.status = "EXPIRED";
          await subs.save();
        }
      }
      break;
    }

    case "subscription.completed": {
      //1. here we do not direct mark subscription as completed becaus razorpay send completed event when we paild last month bill
      const subs = await subscriptionModel.findOne({ providerSubscriptionId: subscriptionId });
    
      // 2. Call the BullMQ worker that runs after time completion
      if (subs && subs.currentPeriodEnd) {

        const delayInMs = subs.currentPeriodEnd.getTime() - Date.now();
    
        // Safety Check: Agar subscription ka end-time already pass ho chuka hai (delay <= 0)
        if (delayInMs > 0) {
          await subscriptionCancellationQueue.add("subscription-completed",
            {
              userId: subs.userId,
              subsId: subs._id,
            },
            {
              jobId: `completed-sub-${subs._id}`,
              delay: delayInMs, // delay in milisecond from now to start worker
              removeOnComplete: true,
              attempts: 3,
            }
          );
        } 
        else {
          // Immediate execution fallback (agar delay 0 ya negative ho)
          await userModel.findByIdAndUpdate(subs.userId, {
            plan: "FREE",
          });
          subs.status = "COMPLETED";
          await subs.save();
        }
      }
      break;
    }

    default:
      console.log(`Unhandled webhook event: ${event}`);
  }

  // step:7 - Return 200 OK
  return res.status(200).json({ status: "success" });
});
