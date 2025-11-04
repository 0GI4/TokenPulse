import { useMemo, useState } from "react";
import HourlyChart from "../components/charts/HourlyChart";
import TokenPicker from "../components/filters/TokenPicker";
import RangeTabs, {
  rangeToFromTo,
  RangeKey,
} from "../components/filters/RangeTabs";

export default function TokenDashboard() {
  const [token, setToken] = useState("ETH");
  const [range, setRange] = useState<RangeKey>("24h");

  const { from, to } = useMemo(
    () =>
      rangeToFromTo(
        range === "24h"
          ? 24
          : range === "48h"
            ? 48
            : range === "72h"
              ? 72
              : 24 * 7
      ),
    [range]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neon-cyan">
            TokenPulse Dashboard
          </h1>
          <RangeTabs value={range} onChange={setRange} />
        </header>

        <section className="space-y-3">
          <div className="text-sm text-slate-400">Выберите токен</div>
          <TokenPicker value={token} onChange={setToken} />
        </section>

        <section>
          <HourlyChart token={token} from={from} to={to} refreshMs={30000} />
        </section>
      </div>
    </div>
  );
}
