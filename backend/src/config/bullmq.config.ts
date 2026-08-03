import { Queue } from "bullmq";
import redis from "./redis.config";


export const pollExpiryQueue = new Queue("poll-expiry", {
  connection: redis,
})
