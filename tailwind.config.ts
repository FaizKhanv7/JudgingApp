import type { Config } from "tailwindcss";
export default { content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"], theme: { extend: { colors: { ink: "#172037", sky: "#edf6ff", coral: "#ef6351", mint: "#2bb673" } } }, plugins: [] } satisfies Config;
