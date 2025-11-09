import { ResponsiveContainer, LineChart, Line, Tooltip } from "recharts";

type Point = { x: number; y: number };

export default function Sparkline({ data }: { data: Point[] }) {
  return (
    <div className="h-10 w-32">
      <ResponsiveContainer>
        <LineChart data={data}>
          <Tooltip
            contentStyle={{
              background: "#0b1220",
              border: "1px solid #334155",
            }}
            labelStyle={{ color: "#94a3b8" }}
          />
          <Line
            type="monotone"
            dataKey="y"
            dot={false}
            stroke="#22d3ee"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
