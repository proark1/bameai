import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b0f1a",
        foreground: "#e7ecf5",
        primary: "#7c8cff",
        secondary: "#19c37d",
        accent: "#fbbf24",
        card: "#121829",
        muted: "#94a3b8"
      }
    }
  },
  plugins: []
};

export default config;
