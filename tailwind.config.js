/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 23, 42, 0.10)",
        glow: "0 16px 40px rgba(239, 68, 68, 0.22)",
      },
      colors: {
        tomato: "#ef4444",
        cheese: "#f59e0b",
        basil: "#16a34a",
        ink: "#1f2937",
      },
    },
  },
  plugins: [],
};
