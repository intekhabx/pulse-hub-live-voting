import { Queue } from "bullmq";
import redis from "./redis.config";


export const pollExpiryQueue = new Queue("poll-expiry", {
  connection: redis,
})


export const unverifiedUserCleanUpQueue = new Queue("cleanup-unverified-users-in-MongoDB", {
  connection: redis
})
