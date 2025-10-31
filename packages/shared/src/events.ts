// shared/src/events.ts
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

export const NormalizedMention = z.object({
  id: z.string(),
  source: z.literal("twitter"),
  token: z.string(),
  text: z.string(),
  createdAt: z.string(),
  meta: z.object({
    authorId: z.string(),
  }),
});

export type NormalizedMention = z.infer<typeof NormalizedMention>;

export const HourlyAnalytics = z.object({
  token: z.string(),
  hour: z.string(),
  mentions: z.number().int(),
  authors: z.number().int(),
  avgLen: z.number(),
});

export type HourlyAnalytics = z.infer<typeof HourlyAnalytics>;
