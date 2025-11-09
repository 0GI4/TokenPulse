import { Injectable } from "@nestjs/common";
import { ClickhouseService } from "../../core/ch/clickhouse.service.js";
import { HourlyQuery } from "./dto/hourly.query.js";

function toCHDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toISOString().slice(0, 19).replace("T", " ");
}

function startOfHour(d: Date) {
  const x = new Date(d);
  x.setMinutes(0, 0, 0);
  return x;
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
        if(m = 0, 0, s_sent / m) AS avg_sentiment,
        if(m = 0, 0, s_fol  / m) AS avg_followers
      FROM (
        SELECT
          hour AS h,
          sum(mentions)        AS m,
          sum(sum_sentiment)   AS s_sent,
          sum(sum_followers)   AS s_fol
        FROM tokenpulse.aggregated_social_hourly_v2
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

  async hourlyMulti(tokens: string[], fromISO?: string, toISO?: string) {
    const now = new Date();
    const toJS = toISO
      ? new Date(toISO)
      : new Date(startOfHour(now).getTime() + 60 * 60 * 1000);
    const fromJS = fromISO
      ? new Date(fromISO)
      : startOfHour(new Date(now.getTime() - 24 * 60 * 60 * 1000));

    if (tokens.length === 0) {
      return {
        ok: true,
        from: fromJS.toISOString(),
        to: toJS.toISOString(),
        data: {},
      };
    }

    const params: Record<string, any> = {
      from: toCHDateTime(fromJS.toISOString()),
      to: toCHDateTime(toJS.toISOString()),
    };
    const inList = tokens
      .map((t, i) => {
        const k = `tok${i}`;
        params[k] = t;
        return `{${k}:String}`;
      })
      .join(", ");

    const rows = await this.chs.ch.query({
      query: `
      SELECT
        token_id,
        formatDateTime(h, '%Y-%m-%d %H:00:00') AS hour,
        m AS mentions,
        if(m = 0, 0, s_sent / m) AS avg_sentiment
      FROM (
        SELECT
          token_id,
          hour AS h,
          sum(mentions)        AS m,
          sum(sum_sentiment)   AS s_sent
        FROM tokenpulse.aggregated_social_hourly_v2
        WHERE token_id IN (${inList})
          AND hour >= toDateTime({from:String})
          AND hour <  toDateTime({to:String})
        GROUP BY token_id, h
      )
      ORDER BY token_id ASC, hour ASC
    `,
      format: "JSONEachRow",
      query_params: params,
    });

    const arr = (await rows.json()) as Array<{
      token_id: string;
      hour: string;
      mentions: string | number;
      avg_sentiment: number;
    }>;

    const grouped: Record<string, any[]> = {};
    for (const r of arr) {
      const t = r.token_id;
      if (!grouped[t]) grouped[t] = [];
      grouped[t].push({
        hour: r.hour,
        mentions: Number(r.mentions),
        sentiment: Number(r.avg_sentiment),
      });
    }

    return {
      ok: true,
      from: fromJS.toISOString(),
      to: toJS.toISOString(),
      data: grouped,
    };
  }
}
