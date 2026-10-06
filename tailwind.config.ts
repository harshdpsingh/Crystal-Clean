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
        navy: {
          DEFAULT: "#0B2545",
          dark: "#07172C",
          light: "#133B6B",
          subtle: "#1B477D",
        },
        teal: {
          DEFAULT: "#0E7C86",
          dark: "#0A5D65",
          light: "#149BA7",
          subtle: "#E6F4F5",
        },
        offwhite: {
          DEFAULT: "#F7F5F0",
          warm: "#FAF9F5",
          darker: "#EDE9DF",
        },
        gold: {
          DEFAULT: "#B08D57",
          dark: "#8F7244",
          light: "#C7A670",
          subtle: "#F9F5EE",
        },
        border: {
          DEFAULT: "#E3E0D8",
          subtle: "#ECEAE4",
          dark: "#D0CCC2",
        },
        body: {
          DEFAULT: "#3D4852",
          muted: "#6B7280",
          light: "#8C96A3",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "DM Serif Display", "Fraunces", "Georgia", "serif"],
        sans: ["var(--font-sans)", "DM Sans", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      maxWidth: {
        site: "1200px",
      },
      borderRadius: {
        DEFAULT: "4px",
        sm: "3px",
        md: "6px",
        lg: "8px",
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(11, 37, 69, 0.05)",
        card: "0 1px 4px 0 rgba(11, 37, 69, 0.06)",
        modal: "0 10px 25px -5px rgba(11, 37, 69, 0.15), 0 8px 10px -6px rgba(11, 37, 69, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
