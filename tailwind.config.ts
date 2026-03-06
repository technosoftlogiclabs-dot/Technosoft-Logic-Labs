import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: "#0a0f1f",
        panel: "#0f162d",
        accent: "#38bdf8"
      },
      boxShadow: {
        panel: "0 18px 48px rgba(2, 6, 23, 0.36)"
      }
    }
  },
  plugins: []
};

export default config;