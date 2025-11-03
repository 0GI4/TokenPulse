import { Injectable } from "@nestjs/common";
import { ClickhouseService } from "../../core/ch/clickhouse.service.js";
import { HourlyQuery } from "./dto/hourly.query.js";

function toCHDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toISOString().slice(0, 19).replace("T", " ");
}

@Injectable()
export class SocialService {
  constructor(private chs: ClickhouseService) {}

  async hourly(q: HourlyQuery) {
    const toISO = q.to ?? new Date().toISOString();
    const fromISO =
      q.from ?? new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const rows = await this.chs.ch.query({
      query: `
  SELECT
    formatDateTime(h, '%Y-%m-%d %H:00:00') AS hour,
    m AS mentions,
    if(m = 0, 0, s_sent / m)  AS avg_sentiment,
    if(m = 0, 0, s_fol  / m)  AS avg_followers
  FROM
  (
    SELECT
      hour AS h,
      sum(mentions)                         AS m,
      sum(avg_sentiment * mentions)         AS s_sent,
      sum(avg_followers * mentions)         AS s_fol
    FROM tokenpulse.aggregated_social_hourly
    WHERE token_id = {token:String}
      AND hour >= toDateTime({from:String})
      AND hour <  toDateTime({to:String})
    GROUP BY h
  )
  ORDER BY hour ASC
`,
      format: "JSONEachRow",
      query_params: {
        token: q.token,
        from: toCHDateTime(fromISO),
        to: toCHDateTime(toISO),
      },
    });

    const data = await rows.json();
    return { ok: true, token: q.token, from: fromISO, to: toISO, data };
  }
}
