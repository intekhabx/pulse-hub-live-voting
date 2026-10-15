import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createAgent, toolStrategy } from "langchain";
import SYSTEM_PROMPT from "./utils/system-prompt";
import getCurrentDateAndTime from "./tools/current-datetime.tool";
import webSearch from "./tools/web-search.tool";
import responseStructure from "./utils/structured-response";



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

export default agent;
