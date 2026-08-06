import { Job, Worker } from "bullmq";
import redis from "../config/redis.config";
import { addRecentActivity } from "../modules/polls/polls.controller";
import { io } from "../server";


export const pollExpiryWorker = new Worker("poll-expiry", async (job: Job)=> {
  try {
    // step:1 - extract pollId that is created
    console.log(job,"*******", job.data);
    const {pollId, userId, pollTitle} = job.data;
  
    // step:2 - whenever poll is expired we have to add in the recentActivity
    await addRecentActivity(userId, {pollId, pollTitle, message: "Poll Expired", icon: "expire"});

    // step:3 - ṣend emit to the frontend that poll expire
    io.emit("server:poll-expired");
  } 
  catch (error) {
    console.error("Poll expiry worker failed:", error);
    throw error; // BullMQ retry karega agar retries configured hain
  }
  
}, {connection: redis});



pollExpiryWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

pollExpiryWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed`, err);
});