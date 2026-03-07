/** @type {import('tailwindcss').Config} */
module.exports = {
  // Archivos donde Tailwind buscará clases
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      /**
       * Colores basados en variables CSS.
       * Permite que Tailwind use clases como:
       * bg-bg, text-text, bg-surface, border-border, text-muted, etc.
       */
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2) / <alpha-value>)",
        text: "rgb(var(--text) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
      },

      /**
       * Sombra “pro” también dependiente del tema mediante --shadow
       */
      boxShadow: {
        pro: "0 12px 30px rgb(var(--shadow) / 0.18)",
      },
    },
  },

  // Plugins tailwind (si luego usas forms, typography, etc., van aquí)
  plugins: [],
};