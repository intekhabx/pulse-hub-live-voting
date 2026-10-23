import * as z from "zod";


export const customBrandingDto = z.object({
  brandName: z .string().trim().min(1, "Brand name cannot be empty").max(50, "Brand name cannot exceed 50 characters"),
  primaryColor: z.string().trim().regex(/^#[0-9A-Fa-f]{6}$/, "Primary color must be a valid hex color").default("#8B5CF6"),
  websiteUrl: z.url().trim().optional(),
  footerText: z.string().trim().max(150, "Footer text cannot exceed 150 characters").optional()
});
