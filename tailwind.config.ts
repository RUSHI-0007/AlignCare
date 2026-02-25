import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          background: "#0B1120",
        },
        secondary: {
          card: "#111827",
        },
        healing: {
          teal: "#2DD4BF",
        },
        trust: {
          blue: "#3B82F6",
        },
      },
    },
  },
  plugins: [],
};

export default config;
