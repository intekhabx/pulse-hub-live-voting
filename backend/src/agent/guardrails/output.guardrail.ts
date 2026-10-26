// ! we are not using output guardrails

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createAgent, toolStrategy } from "langchain";
import z from "zod";



const API_KEY = process.env.GOOGLE_API_KEY;
const MODEL = process.env.LLM_MODEL;

if(!API_KEY || !MODEL){
  throw new Error("GOOGLE_API_KEY and LLM_MODEL isn't defined inside env file");
}



const OUTPUT_GUARDRAIL_PROMPT = ``;


const outputGuardrailResponseStructure = z.object({

})



// we are using same model for output guardrail also
const model = new ChatGoogleGenerativeAI({
  model: MODEL,
  apiKey: API_KEY,
})


const agent = createAgent({
  model,
  systemPrompt: OUTPUT_GUARDRAIL_PROMPT,
  responseFormat: toolStrategy(outputGuardrailResponseStructure),
})


export default async function outputGuardrail(){

}
