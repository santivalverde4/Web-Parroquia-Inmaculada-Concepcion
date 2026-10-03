import type { Config } from "tailwindcss";

/**
 * Design tokens de la parroquia.
 *
 * La paleta sale del logo: dorado #FCB707, celeste claro #A5DEF9,
 * celeste #46BCEB y azul #2977B5, sobre blanco y negro. Los tonos
 * intermedios de cada escala se derivaron de esos colores base.
 *
 * Reglas de contraste (WCAG AA, minimo 4.5 para texto):
 * - brand-600 (#2977B5) con texto blanco: 4.77. Botones y enlaces.
 * - gold-400 (#FCB707) SOLO con texto negro (10.9). Con blanco da 1.76.
 * - brand-400 y brand-200 (celestes): fondos y decoracion, nunca texto
 *   sobre blanco. Sobre brand-900 si se leen bien (8.8).
 *
 * En los componentes se usan SIEMPRE estos nombres (bg-brand-600,
 * text-ink...), nunca un hexadecimal suelto: cambiar la marca entera es
 * editar solo este archivo.
 */
const config: Config = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eaf6fd",
          100: "#d3eefc",
          200: "#a5def9", // logo
          300: "#74cdf2",
          400: "#46bceb", // logo
          500: "#3698d2",
          600: "#2977b5", // logo
          700: "#1f5f93",
          800: "#184a73",
          900: "#113454",
          950: "#0a2136",
        },
        gold: {
          100: "#fff4cc",
          200: "#fee48a",
          300: "#fdd045",
          400: "#fcb707", // logo
          500: "#dc9f00",
          600: "#a87900",
          700: "#7a5a00",
        },
        ink: "#0b0f14", // negro del logo, un punto suavizado
        muted: "#57606b",
        line: "#e3e9ef",
        surface: "#f4f8fb",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "1.25rem",
        panel: "1.75rem",
      },
      boxShadow: {
        // Sombras tenidas con brand-900 (#113454) en vez de gris neutro:
        // se funden con la paleta en lugar de ensuciar el fondo.
        card: "0 1px 2px rgb(17 52 84 / 0.05), 0 8px 24px -12px rgb(17 52 84 / 0.16)",
        lift: "0 2px 4px rgb(17 52 84 / 0.05), 0 18px 40px -16px rgb(17 52 84 / 0.28)",
      },
      maxWidth: {
        content: "76rem",
      },
    },
  },
};

export default config;
