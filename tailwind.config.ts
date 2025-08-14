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
        // Boerne brand colors
        'boerne-navy': '#1B365D',
        'boerne-gold': '#F5A623', 
        'boerne-gold-alt': '#FF8C00',
        'boerne-green': '#7BA05B',
        'boerne-light-blue': '#4A90B8',
        'boerne-white': '#FFFFFF',
        'boerne-light-gray': '#F8F9FA',
        'boerne-dark-gray': '#2C3E50',
        // Keep the nested version too for compatibility
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
  darkMode: 'class', // Only enable dark mode when explicitly set
} satisfies Config;