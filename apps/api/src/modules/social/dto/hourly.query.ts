import { z } from "zod";

export const HourlyQuerySchema = z.object({
  token: z.string().min(1),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});
export type HourlyQuery = z.infer<typeof HourlyQuerySchema>;
