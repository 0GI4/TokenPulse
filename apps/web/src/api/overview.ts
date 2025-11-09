export async function fetchOverview(limit = 10) {
  const url = `/api/overview?limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`overview ${res.status}: ${await res.text()}`);
  const j = await res.json();
  return Array.isArray(j?.data) ? j.data : [];
}
