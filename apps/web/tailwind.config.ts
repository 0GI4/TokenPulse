import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: "#22d3ee",
          purple: "#a855f7",
          blue: "#60a5fa",
        },
      },
      boxShadow: {
        neon: "0 0 20px rgba(34,211,238,0.25)",
      },
    },
  },
  plugins: [],
} satisfies Config;
