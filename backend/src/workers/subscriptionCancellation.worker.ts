import { Worker, Job } from "bullmq"
import redis from "../config/redis.config";
import userModel from "../modules/auth/auth.model";
import subscriptionModel from "../modules/subscription/subscription.model";


export const subscriptionCancellationWorker = new Worker("subscription-cancellation", async (job: Job) => {
  try {
    // step:1 - extract the userId from job
    const {userId, subsId} = job.data;

    // step:2 - find the subscription based on Id
    const subscription = await subscriptionModel.findById(subsId);
    if(!subscription) return;

    // 🛡️ GUARD: Agar plan UPGRADED ho chuka hai, toh sidha abort kar do
    if (subscription.status === "UPGRADED") {
      console.log(`[Worker] Subscription ${subsId} was UPGRADED. Aborting job.`);
      return;
    }

    // 🛑 Normal Cancellation Flow (Only runs if status is still CANCELLED/ACTIVE)
    subscription.status = "EXPIRED";
    await subscription.save();

    // step:3 - find the user and update his cancelled plan to free
    await userModel.findByIdAndUpdate(userId, {
      plan: "FREE",
    })
  }
  catch (error) {
    console.log("subscription cancellation worker failed");
    throw error;
  }
}, {connection: redis});
