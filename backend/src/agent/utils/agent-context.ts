import redis from "../../config/redis.config";



type StoredMessage = { role: "user" | "assistant"; content: unknown };


export async function getRedisChatHistory(key: string) {
  // ["{role: "user", constent: "create a poll'}", "{role: "assistant", content: {title: "someitng"...}"]
  const storedMessages = await redis.lrange(key, -20, -1); //-20, -1 means latest 20 data, ||  0, -1 means all data

  const history = storedMessages.map((msg) => {
    const m = JSON.parse(msg) as StoredMessage;
    return {
      role: m.role,
      // object ho to string bana do, LangChain ko string chahiye
      content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
    }
  })

  // lrange(-20) kabhi assistant message se start ho sakta hai,
  // history hamesha user message se shuru honi chahiye
  while (history.length > 0 && history[0]?.role !== "user") {
    history.shift();
  }

  return history;
}


export async function addMessagesInChatHistory(key: string, data: string){
  await redis.rpush(key, data);
  await redis.expire(key, 60 * 60 * 24 * 30); //expires in 30 days in second
}
