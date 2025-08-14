import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        boerne: {
          navy: '#1B365D',
          gold: '#F5A623',
          'gold-alt': '#FF8C00',
          green: '#7BA05B',
          'light-blue': '#4A90B8',
          white: '#FFFFFF',
          'light-gray': '#F8F9FA',
          'dark-gray': '#2C3E50',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;