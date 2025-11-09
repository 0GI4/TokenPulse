CREATE TABLE IF NOT EXISTS tokenpulse.aggregated_social_metrics
(
  minute DateTime,
  token_id LowCardinality(String),
  mentions UInt32,
  avg_sentiment Float64,
  avg_followers Float64
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(minute)
ORDER BY (token_id, minute);