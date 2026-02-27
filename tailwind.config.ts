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
        // ── Preset F: Aligncare Indian Premium Wellness ──────────────────
        kapur: { DEFAULT: '#FAF7F2', 50: '#FAF7F2' },
        jasmine: { DEFAULT: '#F0F4FF' },
        navy: { DEFAULT: '#0F1E3C' },
        slate: { DEFAULT: '#64748B' },
        turmeric: { DEFAULT: '#F59E0B' },

        // ── Keep legacy tokens so admin & booking stay working ───────────
        cream: { 50: '#FAF7F2', 100: '#FAF3E7', 200: '#F5E6D0' },
        'clinic-blue': {
          50: '#EEF2FF',
          100: '#DBEAFE',
          200: '#C7D2FE',
          400: '#818CF8',
          600: '#2D5BE3',   // Healing Indigo
          700: '#1E40AF',
        },
        'clinic-navy': '#0F1E3C',
        'clinic-muted': '#64748B',
        primary: { background: '#0B1120' },
        secondary: { card: '#111827' },
        healing: { teal: '#0D9488' },
        trust: { blue: '#2D5BE3' },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'DM Sans', 'system-ui', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 16px rgba(45, 91, 227, 0.06)',
        'card-hover': '0 8px 32px rgba(45, 91, 227, 0.14)',
        indigo: '0 8px 32px rgba(15, 30, 60, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
