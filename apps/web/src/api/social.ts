export async function fetchHourly(token: string, from?: Date, to?: Date) {
  const params = new URLSearchParams({ token });
  if (from) params.set("from", from.toISOString());
  if (to) params.set("to", to.toISOString());

  const res = await fetch(`/api/social/hourly?${params.toString()}`);
  if (!res.ok) throw new Error(`Failed to fetch hourly data: ${res.status}`);
  const json = await res.json();
  const arr = Array.isArray(json?.data) ? json.data : [];
  return arr.map((x: any) => ({
    hour: String(x.hour),
    mentions: Number(x.mentions),
    sentiment: Number(x.avg_sentiment),
  }));
}

export async function fetchHourlyMulti(
  tokens: string[],
  from?: Date,
  to?: Date
) {
  const p = new URLSearchParams({ tokens: tokens.join(",") });
  if (from) p.set("from", from.toISOString());
  if (to) p.set("to", to.toISOString());
  const res = await fetch(`/api/social/hourly-multi?${p.toString()}`);
  if (!res.ok) throw new Error(`hourly-multi: ${res.status}`);
  return res.json(); // { ok, from, to, data: { ETH: [...], BTC: [...], ... } }
}
