/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,jsx,ts,tsx}",
      "./components/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          page: "#0f0d14",
          card: "#16131f",
          lifted: "#1e1a2e",
          hover: "#242038",
          accent: "#9b9be8",
          "accent-dim": "#6f6fbe",
          "green-soft": "#7ec4a0",
          "green-dim": "#1e2a25",
          "red-soft": "#e88080",
          "red-dim": "#2a1f1f",
          "text-primary": "#e8e6f0",
          "text-secondary": "#9b98b0",
          "text-hint": "#4a4760",
          border: "#2a2640",
          "border-soft": "#1e1a2e",
        },
      },
    },
    plugins: [],
  }