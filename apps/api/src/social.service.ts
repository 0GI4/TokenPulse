import { Injectable } from "@nestjs/common";
import { getCH } from "./clickhouse";
import { z } from "zod";

const QuerySchema = z.object({
  token: z.string().min(1),
  from: z.string().optional(), // ISO
  to: z.string().optional(), // ISO
});

function toCHDateTime(iso: string): string {
  // CH HTTP expects 'YYYY-MM-DD HH:MM:SS'
  const d = new Date(iso);
  const s = d.toISOString().slice(0, 19).replace("T", " ");
  return s;
}

@Injectable()
export class SocialService {
  async hourly(raw: Record<string, any>) {
    const parsed = QuerySchema.safeParse(raw);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.flatten() };
    }
    const { token, from, to } = parsed.data;

    const toISO = to ?? new Date().toISOString();
    const fromISO =
      from ?? new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // последние 24 часа

    const ch = getCH();
    const query = `
      SELECT
        formatDateTime(hour, '%Y-%m-%d %H:00:00') AS hour,
        mentions,
        round(avg_sentiment, 6) AS avg_sentiment,
        round(avg_followers, 3) AS avg_followers
      FROM tokenpulse.aggregated_social_hourly
      WHERE token_id = {token:String}
        AND hour >= toDateTime({from:String})
        AND hour <  toDateTime({to:String})
      ORDER BY hour ASC
    `;

    const rows = await ch.query({
      query,
      format: "JSONEachRow",
      query_params: {
        token,
        from: toCHDateTime(fromISO),
        to: toCHDateTime(toISO),
      },
    });

    const data = await rows.json();
    return { ok: true, token, from: fromISO, to: toISO, data };
  }
}
