import "dotenv/config";
import { Kafka } from "kafkajs";
import { createClient } from "@clickhouse/client";

const broker = process.env.KAFKA_BROKER ?? "localhost:19092";
const kafka = new Kafka({ clientId: "tp-normalizer", brokers: [broker] });
const consumer = kafka.consumer({ groupId: "normalizer-v1" });
const producer = kafka.producer();
const ch = createClient({
  host: process.env.CLICKHOUSE_URL ?? "http://localhost:8123",
});

function simpleSentiment(text: string): number {
  const t = text.toLowerCase();
  let s = 0;
  if (t.includes("bullish") || t.includes("moon")) s += 0.6;
  if (t.includes("bearish") || t.includes("dump")) s -= 0.6;
  return Math.max(-1, Math.min(1, s));
}

async function persistToCH(ev: any) {
  await ch.insert({
    table: "tokenpulse.enriched_mentions",
    values: [
      {
        ts: ev.ts.replace("Z", "").slice(0, 19),
        source: ev.source,
        token_id: ev.token_id,
        lang: ev.lang,
        sentiment: ev.sentiment,
        user_followers: ev.user_followers,
        is_bot: ev.is_bot ? 1 : 0,
      },
    ],
    format: "JSONEachRow",
  });
}

async function main() {
  await consumer.connect();
  await producer.connect();
  await consumer.subscribe({
    topic: "raw.social.twitter",
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;
      const raw = JSON.parse(message.value.toString());
      const normalized = {
        ts: raw.created_at,
        source: "twitter",
        token_id: (raw.token_ids && raw.token_ids[0]) || "UNKNOWN",
        lang: raw.lang || "en",
        sentiment: simpleSentiment(raw.text),
        user_followers: raw.followers || 0,
        is_bot: false,
      };
      await producer.send({
        topic: "normalized.social.mentions",
        messages: [{ key: raw.id, value: JSON.stringify(normalized) }],
      });
      await persistToCH(normalized);
    },
  });

  console.log("normalizer running");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
