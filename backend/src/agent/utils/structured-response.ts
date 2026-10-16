import * as z from "zod";



const finalOutputStructure = z.object({
  title: z.string().min(2).max(200).describe("title of the poll"),
  description: z.string().max(500).optional().describe("description of the poll"),
  allowAnonymous: z.boolean().default(true).describe("can ananymous user vote in poll"),
  expiresAt: z.string().describe("expiry date of the poll"),
  questions: z.array(
    z.object({
      questionText: z.string().min(1).describe("question of the poll"),
      required: z.boolean().default(false).describe("question is required or not"),
      options: z.array(
        z.object({
          optionText: z.string().min(1).describe("options of each quesiton")
        })
      ).min(2)
    })
  ).min(1),
  responseMessage: z.string().min(2).describe("output message to the user to tell his poll is generated and he can check and publish it"),
})


const requiredUserInputStructure = z.object({
  message: z.string().describe("message that agent want to take some input"),
  question: z.string().describe("actual question agent want to know"),
  options: z.array(
    z.string().describe("option text that llm provdes to user")
  ).min(2).max(3),
})



const responseStructure = z.object({
  type: z.enum(["require-input", "final-output"]).describe("if agent need any input then select 'require-input' otherwise final-output"),
  input: requiredUserInputStructure.optional(), //type require-input me ye field hoga
  output: finalOutputStructure.optional(), //type final-output me ye field hoga
});


export default responseStructure;
