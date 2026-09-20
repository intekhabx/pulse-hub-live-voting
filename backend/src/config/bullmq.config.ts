import { Queue } from "bullmq";
import redis from "./redis.config";


export const pollExpiryQueue = new Queue("poll-expiry", {
  connection: redis,
})


export const subscriptionCancellationQueue = new Queue("subscription-cancellation", {
  connection: redis
})

export const subscriptionCompletedQueue = new Queue("subscription-completed", {
  connection: redis
})
