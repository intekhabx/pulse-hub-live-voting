import z from "zod";

export const createMessageDto = z.object({
  name: z.string().min(2, "name is too short").max(95).trim(),
  email: z.email("invalid email address").max(322).trim().lowercase().toLowerCase(),
  subject: z.string().min(5, "subject is too short").max(150),
  message: z.string().min(10, "message is too short").max(1000),
})
