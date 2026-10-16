import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createAgent, toolStrategy } from "langchain";
import SYSTEM_PROMPT from "./utils/system-prompt";
import getCurrentDateAndTime from "./tools/current-datetime.tool";
import webSearch from "./tools/web-search.tool";
import responseStructure from "./utils/structured-response";
import { addMessagesInChatHistory, getRedisChatHistory } from "./utils/agent-context";



const MODEL = process.env.LLM_MODEL;
const API_KEY = process.env.GOOGLE_API_KEY;

if(!MODEL || !API_KEY){
  throw new Error("LLM_MODEL and GOOGLE_API_KEY is not defined in env file");
}



const model = new ChatGoogleGenerativeAI({
  model: MODEL,
  apiKey: API_KEY,
})


const agent = createAgent({
  model,
  tools: [getCurrentDateAndTime, webSearch],
  systemPrompt: SYSTEM_PROMPT,
  responseFormat: toolStrategy(responseStructure),
})


export default async function callMainLLM(prompt: string, userId: string){
  // step:1 - extract the previous history of chat
  const key = `agent-chat:${userId}`;
  const history = await getRedisChatHistory(key);

  // step:2 - after extracting previous chat history add the user current prompt in chat history
  const userMessage = JSON.stringify({role: "user", content: prompt});
  await addMessagesInChatHistory(key, userMessage);

  // step:3 - invoke or call the llm
  const response = await agent.invoke({
    messages: [
      // {role: "system", content: SYSTEM_PROMPT}, //we didn't need it because we alredy add this when we create agent
      ...history,
      {role: "user", content: prompt},
    ],
  })

  // step:4 - add the llm response in the redis chat history
  const llmResponse = JSON.stringify({role: "assistant", content: response.structuredResponse})
  await addMessagesInChatHistory(key, llmResponse);

  console.log("MainLLMResponse:-", response.structuredResponse);
  return response.structuredResponse;
}
