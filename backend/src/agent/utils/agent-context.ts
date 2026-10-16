import redis from "../../config/redis.config";



export async function getRedisChatHistory(key: string) {
  // ["{role: "user", constent: "create a poll'}", "{role: "assistant", content: {title: "someitng"...}"]
  const storedMessages = await redis.lrange(key, -10, -1); //-10, -1 means latest 10 data, ||  0, -1 means all data
  return storedMessages.map((msg) => JSON.parse(msg));
}


export async function addMessagesInChatHistory(key: string, data: string){
  await redis.rpush(key, data);
  await redis.expire(key, 60 * 60 * 24 * 30); //expires in 30 days in second
}
