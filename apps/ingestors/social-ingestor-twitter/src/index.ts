import { Kafka, Partitioners } from "kafkajs";
import "dotenv/config";

const broker = process.env.KAFKA_BROKER ?? "localhost:19093";
const kafka = new Kafka({ brokers: [broker] });
const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});
const TOKENS = ["ETH", "BTC", "SOL", "UNI"];

function randomTweet() {
  const token = TOKENS[Math.floor(Math.random() * TOKENS.length)];
  const now = new Date().toISOString();
  return {
    id: Math.random().toString(36).slice(2),
    text: `Bullish vibes on ${token}!`,
    created_at: now,
    user_id: "u" + Math.floor(Math.random() * 1e6),
    followers: Math.floor(Math.random() * 50000),
    lang: "en",
    token_ids: [token],
  };
}

async function main() {
  await producer.connect();
  console.log("social-ingestor-twitter connected");
  setInterval(async () => {
    const msg = randomTweet();
    await producer.send({
      topic: "raw.social.twitter",
      messages: [{ key: msg.id, value: JSON.stringify(msg) }],
    });
    process.stdout.write(".");
  }, 500);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
