import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Gaming theme dark grays
        gray: {
          900: "#0a0a0b",
          800: "#121214",
          700: "#1a1a1d",
          600: "#242428",
          500: "#2e2e33",
          400: "#3d3d42",
          300: "#52525b",
          200: "#71717a",
          100: "#a1a1aa",
        },
        // Accent colors for gaming theme
        accent: {
          primary: "#6366f1", // Indigo
          secondary: "#8b5cf6", // Violet
          success: "#22c55e", // Green
          warning: "#f59e0b", // Amber
          danger: "#ef4444", // Red
          cyan: "#06b6d4", // Cyan for highlights
        },
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
