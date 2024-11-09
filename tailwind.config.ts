import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      screens: {
        lg2: "870px",
        xs: "560px",
        xl2: "1200px"
      },
      keyframes: {
        "slide-left-in": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-left-out": {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(-100%)", opacity: "0" },
        },
        "shimmer": {
          '0%': { backgroundPosition: '100% 0' },
          '100%': { backgroundPosition: '-100% 0' },
        },
      },
      animation: {
        "slide-left-in": "slide-left-in 0.6s ease forwards",
        "slide-left-out": "slide-left-out 0.6s ease forwards",
        "shimmer": 'shimmer 2s infinite',
      },
      backgroundSize: {
        '200%': '200% 100%',
      },
      backgroundImage: {
        shimmer: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0) 100%)',
      },
    },
    
  },
  plugins: [],
};
export default config;
