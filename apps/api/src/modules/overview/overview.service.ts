import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ClickhouseService } from "../../core/ch/clickhouse.service.js";

type Cache = { ts: number; data: any };
const CACHE_TTL_MS = 30_000;
let cache: Cache | null = null;

function startOfHour(d: Date) {
  const x = new Date(d);
  x.setMinutes(0, 0, 0);
  return x;
}
function toCH(iso: string) {
  return iso.slice(0, 19).replace("T", " ");
}

@Injectable()
export class OverviewService {
  constructor(private chs: ClickhouseService) {}

  async overview(limit: number) {
    const now = new Date();
    const to = new Date(startOfHour(now).getTime() + 60 * 60 * 1000); // экскл.
    const from = new Date(startOfHour(now).getTime() - 24 * 60 * 60 * 1000);

    const nowMs = Date.now();
    if (cache && nowMs - cache.ts < CACHE_TTL_MS) return cache.data;

    try {
      const rows = await this.chs.ch.query({
        query: `
          SELECT
            token_id,
            sum(mentions) AS mentions_24h,
            if(sum(mentions)=0, 0, sum(sum_sentiment)/sum(mentions))  AS avg_sentiment_24h,
            if(sum(mentions)=0, 0, sum(sum_followers)/sum(mentions))  AS avg_followers_24h
          FROM tokenpulse.aggregated_social_hourly_v2
          WHERE hour >= toDateTime({from:String})
            AND hour <  toDateTime({to:String})
          GROUP BY token_id
          ORDER BY mentions_24h DESC, token_id ASC
          LIMIT {limit:UInt32}
        `,
        format: "JSONEachRow",
        query_params: {
          from: toCH(from.toISOString()),
          to: toCH(to.toISOString()),
          limit,
        },
      });

      const data = await rows.json();
      const res = {
        ok: true,
        from: from.toISOString(),
        to: to.toISOString(),
        data,
      };
      cache = { ts: nowMs, data: res };
      return res;
    } catch (e: any) {
      console.error("overview query failed:", e?.message, e?.cause?.body);
      throw new InternalServerErrorException("CH_QUERY_FAILED");
    }
  }
}
