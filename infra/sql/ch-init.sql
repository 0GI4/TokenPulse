CREATE DATABASE IF NOT EXISTS tokenpulse;

CREATE TABLE IF NOT EXISTS tokenpulse.enriched_mentions
(
  ts DateTime,
  source LowCardinality(String),
  token_id LowCardinality(String),
  lang LowCardinality(String),
  sentiment Float64,
  user_followers UInt32,
  is_bot UInt8
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(ts)
ORDER BY (token_id, ts);
