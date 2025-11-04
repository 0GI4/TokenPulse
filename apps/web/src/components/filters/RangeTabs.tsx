const RANGES = [
  { key: "24h", hours: 24, label: "24ч" },
  { key: "48h", hours: 48, label: "48ч" },
  { key: "72h", hours: 72, label: "72ч" },
  { key: "7d", hours: 24 * 7, label: "7д" },
];

export type RangeKey = "24h" | "48h" | "72h" | "7d";

export default function RangeTabs({
  value,
  onChange,
}: {
  value: RangeKey;
  onChange: (k: RangeKey) => void;
}) {
  return (
    <div className="inline-flex rounded-xl overflow-hidden border border-slate-700">
      {RANGES.map((r) => {
        const active = value === r.key;
        return (
          <button
            key={r.key}
            onClick={() => onChange(r.key as RangeKey)}
            className={
              "px-3 py-1 text-sm " +
              (active
                ? "bg-slate-700 text-white"
                : "bg-slate-900 text-slate-300 hover:bg-slate-800")
            }
          >
            {r.label}
          </button>
        );
      })}
    </div>
  );
}

export function rangeToFromTo(hours: number) {
  const now = new Date();
  const startHour = new Date(now);
  startHour.setMinutes(0, 0, 0);
  const from = new Date(startHour.getTime() - hours * 60 * 60 * 1000);
  const to = new Date(startHour.getTime() + 60 * 60 * 1000);
  return { from, to };
}
