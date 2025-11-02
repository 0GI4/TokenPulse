// packages/shared/src/events.ts
import { z } from "zod";

export const Topic = {
  RAW_TWITTER: "raw.social.twitter",
  NORMALIZED_MENTIONS: "normalized.social.mentions",
  ANALYTICS_HOURLY: "analytics.social.hourly",
} as const;

export const RawTweet = z.object({
  id: z.string(),
  authorId: z.string(),
  createdAt: z.string(),
  text: z.string(),
  lang: z.string().optional(),
  symbols: z.array(z.string()).default([]),
});
export type RawTweet = z.infer<typeof RawTweet>;

// Оставляем старую схему, но параллельно вводим используемый сейчас формат
export const EnrichedMention = z.object({
  ts: z.string(), // ISO
  source: z.literal("twitter"),
  token_id: z.string(),
  lang: z.string(),
  sentiment: z.number(),
  user_followers: z.number().int().nonnegative(),
  is_bot: z.boolean(),
});
export type EnrichedMention = z.infer<typeof EnrichedMention>;

export * from "./events.js";
