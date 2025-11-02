// apps/aggregator-social/src/index.ts
import { createClient } from "@clickhouse/client";
import "dotenv/config";
import { Kafka } from "kafkajs";

const broker = process.env.KAFKA_BROKER ?? "localhost:19092";
const kafka = new Kafka({ clientId: "tp-aggregator", brokers: [broker] });
const consumer = kafka.consumer({ groupId: "aggregator-v1" });
const ch = createClient({
  url: process.env.CLICKHOUSE_URL ?? "http://localhost:8123",
});

type Row = {
  minute: string;
  token_id: string;
  mentions: number;
  sum_sent: number;
  sum_fol: number;
};
const buckets = new Map<string, Row>();

function minuteKey(tsISO: string) {
  const d = new Date(tsISO);
  d.setSeconds(0, 0);
  const minute = d.toISOString().slice(0, 19).replace("T", " ");
  return minute;
}

let flushing = false;
async function flush() {
  if (flushing) return;
  if (!buckets.size) return;
  flushing = true;
  try {
    const values: Array<{
      minute: string;
      token_id: string;
      mentions: number;
      avg_sentiment: number;
      avg_followers: number;
    }> = [];
    for (const {
      minute,
      token_id,
      mentions,
      sum_sent,
      sum_fol,
    } of buckets.values()) {
      values.push({
        minute,
        token_id,
        mentions,
        avg_sentiment: mentions ? sum_sent / mentions : 0,
        avg_followers: mentions ? sum_fol / mentions : 0,
      });
    }
    buckets.clear();
    await ch.insert({
      table: "tokenpulse.aggregated_social_metrics",
      values,
      format: "JSONEachRow",
    });
    console.log(`flushed ${values.length} rows`);
  } finally {
    flushing = false;
  }
}

async function gracefulExit(code = 0) {
  try {
    await flush();
    await consumer.disconnect();
    await ch.close();
  } catch (e) {
    console.error("gracefulExit error", e);
  } finally {
    process.exit(code);
  }
}

process.on("SIGINT", () => {
  console.log("SIGINT received, flushing…");
  gracefulExit(0);
});
process.on("SIGTERM", () => {
  console.log("SIGTERM received, flushing…");
  gracefulExit(0);
});
process.on("uncaughtException", (e) => {
  console.error("uncaughtException", e);
  gracefulExit(1);
});
process.on("unhandledRejection", (e: any) => {
  console.error("unhandledRejection", e);
  gracefulExit(1);
});

async function main() {
  await consumer.connect();
  await consumer.subscribe({
    topic: "normalized.social.mentions",
    fromBeginning: false,
  });

  setInterval(() => {
    flush().catch(console.error);
  }, 5000);

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;
      const m = JSON.parse(message.value.toString());
      const minute = minuteKey(m.ts);
      const key = `${m.token_id}|${minute}`;
      const r = buckets.get(key) ?? {
        minute,
        token_id: m.token_id,
        mentions: 0,
        sum_sent: 0,
        sum_fol: 0,
      };
      r.mentions += 1;
      r.sum_sent += Number(m.sentiment) || 0;
      r.sum_fol += Number(m.user_followers) || 0;
      buckets.set(key, r);
    },
  });

  console.log("aggregator running with graceful flush");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
