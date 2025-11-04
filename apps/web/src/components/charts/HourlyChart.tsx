import React, { useEffect, useState } from "react";
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

interface HourlyChartProps {
  token: string;
}

const HourlyChart = ({ token }: HourlyChartProps) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHourly(token)
      .then((res) => setData(res))
      .catch((e) => setError(e?.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="text-gray-400">Загрузка…</div>;
  if (error) return <div className="text-rose-400">Ошибка: {error}</div>;
  if (!data.length) return <div className="text-gray-400">Нет данных</div>;

  return (
    <div className="w-full h-80 bg-black/30 rounded-2xl p-4 shadow-neon borber border-neon-cyan/30">
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
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0b1220",
              border: "1px solid #334155",
            }}
            labelStyle={{ color: "#e2e8f0" }}
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
};

export default HourlyChart;
