import { unverifiedUserCleanUpQueue } from "../config/bullmq.config";


export const setupUnverifiedUserCleanupScheduler = async () => {
  await unverifiedUserCleanUpQueue.upsertJobScheduler(
    "cleanup-unverified-users", //schedulerId
    {
      pattern: "0 30 3 * * *", //runs everyday at 3:30 am
      tz: "Asia/Kolkata" //timezone
    },
    {
      name: "cleanup-unverified-users-in-MongoDB", //job name
      data: {},
      opts: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
        removeOnComplete: 10,
        removeOnFail: 50,
      },
    }
  );

  console.log(
    "[Unverified User Cleanup] Daily scheduler registered"
  );
};
