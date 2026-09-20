import { Worker, Job } from "bullmq"
import redis from "../config/redis.config";
import userModel from "../modules/auth/auth.model";
import subscriptionModel from "../modules/subscription/subscription.model";


export const subscriptionCompletedWorker = new Worker("subscription-completed", async (job: Job) => {
  try {
    // step:1 - extract the userId from job
    const {userId, subsId} = job.data;

    // step:2 - find the user and update his pro or premium plan to free
    await userModel.findByIdAndUpdate(userId, {
      plan: "FREE",
    })

    // step:3 - now the completion period is over so mark document as completed
    await subscriptionModel.findByIdAndUpdate(subsId, {
      status: "COMPLETED"
    })
  }
  catch (error) {
    console.log("subscription completion worker failed");
    throw error;
  }
}, {connection: redis});
