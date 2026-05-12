import * as z from 'zod';

export const registerDto = z.object({
  name: z.string().min(2, "name is too short").max(95).trim(),

  email: z.email("invalid email address").max(322).trim().lowercase().toLowerCase(),

  password: z.string().min(8, "password should be 8 character minimum").max(66).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/, "password should contain capital, small number and a special character"),
})


export const loginDto = z.object({
  email: z.email("invalid email address").max(322).trim().lowercase().toLowerCase(),

  password: z.string().min(8, "password should be 8 character minimum").max(66).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/, "password should contain capital, small number and a special character"),
})