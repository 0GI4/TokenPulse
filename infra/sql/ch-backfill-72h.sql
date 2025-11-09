INSERT INTO tokenpulse.aggregated_social_hourly_v2
SELECT
  toStartOfHour(ts) AS hour,
  token_id,
  count()             AS mentions,
  sum(sentiment)      AS sum_sentiment,
  sum(user_followers) AS sum_followers
FROM tokenpulse.enriched_mentions
WHERE ts >= now() - INTERVAL 72 HOUR
GROUP BY token_id, hour;
