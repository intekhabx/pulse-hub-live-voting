import * as z from 'zod';


const optionDto = z.object({
  _id: z.string().optional(), //id need only for updation
  optionText: z.string().trim().min(1, "Option text is required"),
});

const questionDto = z.object({
  _id: z.string().optional(), //id need only for updation
  questionText: z.string().trim().min(1, "Question text is required"),
  options: z.array(optionDto).min(2, "Each question must have at least 2 options"),
  required: z.boolean().optional(),
});


export const createPollDto = z.object({
  title: z.string().trim().min(2, "Title is too short").max(200, "Title is too long"),
  description: z.string().trim().max(500, "Description is too long").optional(),
  questions: z.array(questionDto).min(1, "At least one question is required"),
  allowAnonymous: z.boolean().optional(),
  expiresAt: z.coerce.date().optional(),
});


export const updatePollDto = z.object({
  title: z.string().trim().min(2, "Title is too short").max(200, "Title is too long"),
  description: z.string().trim().max(500, "Description is too long").optional(),
  questions: z.array(questionDto).min(1, "At least one question is required"),
  allowAnonymous: z.boolean().optional(),
  expiresAt: z.coerce.date().optional(),
});


export const updateActivePollBasicDetailsDto = z.object({
  title: z.string().trim().min(2, "Title is too short").max(200, "Poll title cannot exceed 200 characters"),
  description: z.string().trim().max(500, "Description cannot exceed 500 characters").optional(),
  allowAnonymous: z.boolean({error: "allowAnonymous must be a boolean"}).optional(),
  expiresAt: z.coerce.date().optional(),
});


// Ai agent Dto
export const callAiAgentDto = z.object({
  prompt: z.string().min(1),
});
