import type { Config } from "tailwindcss";

/**
 * Design tokens de la parroquia.
 *
 * La paleta sale de la identidad real del templo: el azul mariano de la
 * cupula iluminada y el dorado de la cruz. El fondo es blanco y el color
 * se usa en dosis pequenas (botones, etiquetas, superficies suaves).
 *
 * Regla de uso: en los componentes se usan SIEMPRE estos nombres
 * (bg-brand-600, text-ink, border-line...) y nunca un hexadecimal suelto.
 * Asi cambiar la marca entera es editar solo este archivo.
 */
const config: Config = {
  theme: {
    extend: {
      colors: {
        // Azul mariano: color principal de la marca.
        brand: {
          50: "#f1f4fd",
          100: "#e2e8fa",
          200: "#c6d2f4",
          300: "#9db1ea",
          400: "#6d87dc",
          500: "#4762c9",
          600: "#2f47ac",
          700: "#26388c",
          800: "#1e2d6f",
          900: "#172352",
        },
        // Dorado de la cruz: solo para detalles y acentos pequenos.
        gold: {
          100: "#f7efd9",
          400: "#d6b45a",
          500: "#c39a34",
          600: "#a37d24",
        },
        ink: "#141a2e", // texto principal
        muted: "#5c6478", // texto secundario
        line: "#e4e7f0", // bordes
        surface: "#f5f6fa", // paneles y fondos suaves
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
        card: "0 1px 2px rgb(20 26 46 / 0.04), 0 8px 24px -12px rgb(20 26 46 / 0.12)",
        lift: "0 2px 4px rgb(20 26 46 / 0.04), 0 18px 40px -16px rgb(20 26 46 / 0.22)",
      },
      maxWidth: {
        content: "76rem",
      },
    },
  },
};

export default config;
