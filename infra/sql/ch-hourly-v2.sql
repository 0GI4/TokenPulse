CREATE TABLE IF NOT EXISTS tokenpulse.aggregated_social_hourly_v2
(
  hour DateTime,
  token_id LowCardinality(String),
  mentions UInt64,
  sum_sentiment Float64,
  sum_followers Float64
)
ENGINE = SummingMergeTree((mentions, sum_sentiment, sum_followers))
PARTITION BY toYYYYMM(hour)
ORDER BY (token_id, hour);

CREATE MATERIALIZED VIEW IF NOT EXISTS tokenpulse.mv_enriched_to_hourly_v2
TO tokenpulse.aggregated_social_hourly_v2
AS
SELECT
  toStartOfHour(ts) AS hour,
  token_id,
  count()             AS mentions,
  sum(sentiment)      AS sum_sentiment,
  sum(user_followers) AS sum_followers
FROM tokenpulse.enriched_mentions
GROUP BY token_id, hour;
