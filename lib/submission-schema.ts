import { z } from "zod";
export const submissionSchema = z.object({
  species: z.string().trim().min(2).max(100),
  angler: z.string().trim().min(2).max(100),
  date: z.string().date(),
  length: z.coerce.number().positive().max(200).optional(),
  weight: z.coerce.number().positive().max(2000).optional(),
  state: z.string().trim().max(100).optional(),
  city: z.string().trim().max(100).optional(),
  water: z.string().trim().min(2).max(160),
  caughtWith: z.string().trim().max(160).optional(),
  story: z.string().trim().max(5000).optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
}).refine((d) => d.length || d.weight, { message: "Enter a length or weight", path: ["length"] });
export type SubmissionInput = z.infer<typeof submissionSchema>;
