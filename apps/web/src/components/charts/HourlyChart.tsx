import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import { fetchHourly } from "../../api/social";

type Props = { token: string; from?: Date; to?: Date; refreshMs?: number };

export default function HourlyChart({
  token,
  from,
  to,
  refreshMs = 30000,
}: Props) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    try {
      const d = await fetchHourly(token, from, to);
      setData(d);
      setErr(null);
    } catch (e: any) {
      setErr(e?.message ?? "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    let dead = false;
    load();
    const t = setInterval(() => {
      if (!dead) load();
    }, refreshMs);
    return () => {
      dead = true;
      clearInterval(t);
    };
  }, [token, from?.toISOString(), to?.toISOString(), refreshMs]);

  if (loading) return <div className="text-gray-400">Загрузка…</div>;
  if (err) return <div className="text-rose-400">Ошибка: {err}</div>;
  if (!data.length) return <div className="text-gray-400">Нет данных</div>;

  return (
    <div className="w-full h-80 bg-black/30 rounded-2xl p-4 shadow-neon border border-neon-cyan/30">
      <h2 className="text-neon-cyan mb-3 font-semibold text-lg">
        Активность токена {token}
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="hour" stroke="#94a3b8" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="left" stroke="#22d3ee" tick={{ fontSize: 12 }} />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#a855f7"
            tick={{ fontSize: 12 }}
            domain={[-1, 1]}
          />
          <Tooltip
            formatter={(value: any, name: string) =>
              name === "Настроение"
                ? [Number(value).toFixed(3), name]
                : [value, name]
            }
            labelStyle={{ color: "#e2e8f0" }}
            contentStyle={{
              backgroundColor: "#0b1220",
              border: "1px solid #334155",
            }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="mentions"
            stroke="#22d3ee"
            strokeWidth={2}
            dot={false}
            name="Упоминания"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="sentiment"
            stroke="#a855f7"
            strokeWidth={2}
            dot={false}
            name="Настроение"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
