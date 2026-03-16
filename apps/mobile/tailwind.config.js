import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL(".", import.meta.url));

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    fileURLToPath(new URL("./index.html", import.meta.url)),
    `${appRoot}src/**/*.{ts,tsx}`,
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      boxShadow: {
        soft: "0 20px 50px -24px rgba(15, 23, 42, 0.35)",
      },
      backgroundImage: {
        "hero-mobile":
          "linear-gradient(180deg, rgba(22, 78, 255, 0.98) 0%, rgba(66, 116, 255, 0.92) 42%, rgba(241, 246, 255, 0) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
