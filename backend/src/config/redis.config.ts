import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URI!;
if(!REDIS_URL){
  throw new Error("REDIS_URI is not defined");
}

const redis = new Redis(REDIS_URL, {
  tls: {
    servername: REDIS_URL.split("@")[1] || "pulsehub-post-spark.cloud.layerbase.dev"
  }
});


redis.on("ready", () => {
  console.log("✅ Redis connected successfully");
});

redis.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

export default redis;
