import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 16px 45px rgba(15, 23, 42, 0.09)",
        lift: "0 24px 60px rgba(15, 23, 42, 0.13)"
      },
      colors: {
        vecxtor: {
          green: "#16A34A",
          dark: "#0B642D",
          mist: "#F4F8F5",
          ink: "#111827"
        }
      }
    }
  },
  plugins: []
};

export default config;
