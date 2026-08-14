import { Job, Worker } from "bullmq";
import userModel from "../modules/auth/auth.model";
import redis from "../config/redis.config";


export const unverifiedUserCleanUpWorker = new Worker("cleanup-unverified-users-in-MongoDB", async (job: Job) => {
    try {
      // step:1 - Calculate the date from 30 days ago
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // step:2 - Delete users whose email is not verified and whose account was created more than 30 days ago
      const result = await userModel.deleteMany({
        email_verified: false,
        createdAt: {
          $lt: thirtyDaysAgo, // Account was created before the 30-day cutoff ($lt: less than)
        },
      });

      console.log(
        `[Unverified User Cleanup] Deleted ${result.deletedCount} users`
      );

      return {
        deletedCount: result.deletedCount,
      };
    } 
    catch (error) {
      console.error(
        "[Unverified User Cleanup] Worker failed:",
        error
      );

      throw error;
    }
  }, { connection: redis });



unverifiedUserCleanUpWorker.on("completed", (job) => {
  console.log(
    `[Unverified User Cleanup] Job ${job.id} completed`
  );
});

unverifiedUserCleanUpWorker.on("failed", (job, error) => {
  console.error(
    `[Unverified User Cleanup] Job ${job?.id} failed`,
    error
  );
});
