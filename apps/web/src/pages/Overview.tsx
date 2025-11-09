import { useEffect, useMemo, useState } from "react";
import { fetchHourlyMulti } from "../api/social";
import { Link } from "react-router-dom";
import { fetchOverview } from "../api/overview";
import Sparkline from "../components/charts/Sparkline";

function startOfHour(d: Date) {
  const x = new Date(d);
  x.setMinutes(0, 0, 0);
  return x;
}
function range24h() {
  const now = new Date();
  const from = startOfHour(new Date(now.getTime() - 24 * 60 * 60 * 1000));
  const to = new Date(startOfHour(now).getTime() + 60 * 60 * 1000); // экскл.
  return { from, to };
}

export default function Overview() {
  const [rows, setRows] = useState<any[]>([]);
  const [series, setSeries] = useState<Record<string, any[]>>({});
  const [err, setErr] = useState<string | null>(null);

  const { from, to } = useMemo(() => range24h(), []);

  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        const ov = await fetchOverview(12);
        if (dead) return;
        setRows(ov);
        const tokens = ov.map((r: any) => r.token_id);
        if (tokens.length) {
          const batch = await fetchHourlyMulti(tokens, from, to);
          if (!dead && batch?.ok) setSeries(batch.data || {});
        }
      } catch (e: any) {
        if (!dead) setErr(String(e));
      }
    })();
    return () => {
      dead = true;
    };
  }, [from, to]);

  if (err) return <div className="p-6 text-rose-400">Ошибка: {err}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neon-cyan">Overview</h1>
          <Link to="/token/ETH" className="text-sm text-neon-cyan underline">
            К ETH →
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {rows.map((r: any) => {
            const s = (series[r.token_id] || []).map((p: any, i: number) => ({
              x: i,
              y: p.mentions,
            }));
            return (
              <Link
                key={r.token_id}
                to={`/token/${r.token_id}`}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-neon-cyan/40"
              >
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold">{r.token_id}</div>
                  <div className="text-sm text-slate-400">
                    24h mentions:{" "}
                    <span className="text-white">{r.mentions_24h}</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm text-slate-400">
                    Sentiment:{" "}
                    <span className="text-white">
                      {Number(r.avg_sentiment_24h).toFixed(3)}
                    </span>
                  </div>
                  <Sparkline
                    data={
                      s.length
                        ? s
                        : [
                            { x: 0, y: 0 },
                            { x: 1, y: 0 },
                          ]
                    }
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
