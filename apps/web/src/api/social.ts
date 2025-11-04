export async function fetchHourly(token: string) {
  const res = await fetch(
    `/api/social/hourly?token=${encodeURIComponent(token)}`
  );
  if (!res.ok) throw new Error(`Failed to fetch hourly data: ${res.status}`);
  const json = await res.json();
  const arr = Array.isArray(json?.data) ? json.data : [];
  return arr.map((x: any) => ({
    hour: String(x.hour),
    mentions: Number(x.mentions),
    sentiment: Number(x.avg_sentiment),
  }));
}
