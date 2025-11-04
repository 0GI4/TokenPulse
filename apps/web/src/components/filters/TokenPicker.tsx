import { useState } from "react";

const PRESETS = ["ETH", "BTC", "SOL", "UNI"];

export default function TokenPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [custom, setCustom] = useState("");

  return (
    <div className="flex flex-wrap items-center gap-2">
      {PRESETS.map((t) => {
        const active = value === t;
        return (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={
              "px-3 py-1 rounded-full text-sm transition " +
              (active
                ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40"
                : "bg-slate-800/80 text-slate-200 hover:bg-slate-700 border border-slate-700")
            }
          >
            {t}
          </button>
        );
      })}
      <div className="flex items-center gap-2 ml-2">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value.toUpperCase())}
          placeholder="Другая монета (например, ARB)"
          className="bg-slate-900 border border-slate-700 rounded px-3 py-1 text-sm w-56 placeholder:text-slate-500"
        />
        <button
          onClick={() => custom && onChange(custom)}
          className="px-3 py-1 rounded text-sm bg-slate-700 hover:bg-slate-600 border border-slate-600"
        >
          Выбрать
        </button>
      </div>
    </div>
  );
}
