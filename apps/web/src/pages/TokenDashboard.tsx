import { useState } from "react";
import HourlyChart from "../components/charts/HourlyChart";

const TokenDashboard = () => {
  const [token, setToken] = useState("ETH");

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black text-white p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-neon-cyan">
          TokenPulse Dashboard
        </h1>

        <div className="flex items-center gap-2">
          <label className="text-gray-400">Token:</label>
          <input
            value={token}
            onChange={(e) => setToken(e.target.value.toUpperCase())}
            className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white"
          />
        </div>

        <HourlyChart token={token} />
      </div>
    </div>
  );
};

export default TokenDashboard;
