import { Kafka, Partitioners } from "kafkajs";
import "dotenv/config";

const broker = process.env.KAFKA_BROKER ?? "localhost:19092";
const kafka = new Kafka({ brokers: [broker] });
const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});
const TOKENS = ["ETH", "BTC", "SOL", "UNI", "ARB", "OP"];

const POS = [
  (t: string) => `Bullish vibes on ${t}! 🚀`,
  (t: string) => `${t} to the moon!`,
  (t: string) => `Strong breakout incoming for ${t}`,
  (t: string) => `${t} ath soon?`,
];
const NEG = [
  (t: string) => `${t} looks bearish...`,
  (t: string) => `dump incoming on ${t}`,
  (t: string) => `${t} crash alert`,
  (t: string) => `${t} rug or just noise?`,
];
const NEU = [
  (t: string) => `${t} consolidating`,
  (t: string) => `Watching ${t} range`,
  (t: string) => `${t} sideway chops`,
  (t: string) => `${t} volume flat`,
];

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomTweet() {
  const token = pick(TOKENS);
  const now = new Date().toISOString();

  const r = Math.random();
  const text =
    r < 0.45 ? pick(POS)(token) : r < 0.8 ? pick(NEU)(token) : pick(NEG)(token);

  const langs = ["en", "en", "en", "es", "ru", "de"];
  const lang = pick(langs);

  return {
    id: Math.random().toString(36).slice(2),
    text,
    created_at: now,
    user_id: "u" + Math.floor(Math.random() * 1e6),
    followers: Math.floor(Math.random() * 100000),
    lang,
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
  }, 400);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
