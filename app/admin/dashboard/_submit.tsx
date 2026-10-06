"use client";

import { useFormStatus } from "react-dom";

/**
 * Boton de guardar que se desactiva y dice "Guardando…" mientras el
 * formulario se envia, para que nadie lo presione dos veces.
 */
export function SubmitButton({
  children,
  pendingText = "Guardando…",
  variant = "primary",
}: {
  children: React.ReactNode;
  pendingText?: string;
  variant?: "primary" | "danger" | "secondary";
}) {
  const { pending } = useFormStatus();
  // El color del texto va en el <span> de adentro: globals.css le pone
  // "color: inherit" a los <button> fuera de las capas de Tailwind, y esa
  // regla le ganaria a una clase text-* puesta en el boton. Lo mismo pasa
  // con "font: inherit", por eso el tamano de letra tambien va en el span.
  const styles = {
    primary: ["bg-brand-600 hover:bg-brand-700", "text-white"],
    danger: ["bg-red-700 hover:bg-red-800", "text-white"],
    secondary: [
      "border border-line bg-white hover:border-brand-300",
      "text-ink",
    ],
  }[variant];

  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-full px-6 py-3 text-sm font-semibold transition-colors disabled:cursor-wait disabled:opacity-70 ${styles[0]}`}
    >
      <span
        className={`inline-flex items-center justify-center gap-2 text-sm font-semibold ${styles[1]}`}
      >
        {pending && (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
            aria-hidden="true"
          />
        )}
        {pending ? pendingText : children}
      </span>
    </button>
  );
}
