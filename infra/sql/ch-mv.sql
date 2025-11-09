CREATE MATERIALIZED VIEW IF NOT EXISTS tokenpulse.mv_enriched_to_hourly
TO tokenpulse.aggregated_social_hourly
AS
SELECT
  toStartOfHour(ts) AS hour,
  token_id,
  count() AS mentions,
  avg(sentiment) AS avg_sentiment,
  avg(user_followers) AS avg_followers
FROM tokenpulse.enriched_mentions
GROUP BY token_id, hour;
