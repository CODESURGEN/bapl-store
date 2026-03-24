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
        brand: { DEFAULT: "#1a3622", light: "#2c5234", dark: "#0f2415" },
        gold: { DEFAULT: "#c5a059", light: "#d9b673", dark: "#a88644" },
        sand: "#f4f1ea",
        stone: "#e8e4db",
        soft: "#f5f5f5",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        heading: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Poppins", "sans-serif"],
      },
      animation: {
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "slow-zoom": "slowZoom 20s ease-in-out infinite alternate",
        "spin-slow": "spinSlow 30s linear infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slowZoom: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.15)" },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
