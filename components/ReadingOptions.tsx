"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import {
  applyPreferences,
  readAppliedPreferences,
  type ReadingPreferences,
  type TextSize,
} from "@/lib/readingPreferences";

const copy = {
  es: {
    button: "Opciones de lectura",
    title: "Opciones de lectura",
    size: "Tamaño del texto",
    sizes: { normal: "Normal", lg: "Grande", xl: "Muy grande" },
    contrast: "Alto contraste",
    contrastHint: "Textos más oscuros y bordes más marcados.",
  },
  en: {
    button: "Reading options",
    title: "Reading options",
    size: "Text size",
    sizes: { normal: "Normal", lg: "Large", xl: "Extra large" },
    contrast: "High contrast",
    contrastHint: "Darker text and stronger borders.",
  },
} as const;

/** Tamano de la letra "A" de muestra en cada boton. */
const sampleSize: Record<TextSize, string> = {
  normal: "text-base",
  lg: "text-xl",
  xl: "text-2xl",
};

/**
 * Boton "Aa" de la barra de navegacion con un panel para agrandar el texto y
 * activar el alto contraste. Pensado para quienes leen con dificultad en
 * pantallas pequenas, que en una parroquia son muchos.
 */
export function ReadingOptions({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const panelId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // null = panel cerrado. Al abrirlo se leen las preferencias aplicadas en
  // <html>, asi el estado nunca se desincroniza con lo que se ve.
  const [prefs, setPrefs] = useState<ReadingPreferences | null>(null);
  const open = prefs !== null;

  // Cerrar con Escape o con un clic/toque fuera del panel.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPrefs(null);
        buttonRef.current?.focus();
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setPrefs(null);
    }
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  function update(next: ReadingPreferences) {
    applyPreferences(next);
    setPrefs(next);
  }

  return (
    // En celular el panel se ancla a la barra completa (el <header> es
    // sticky, por lo tanto posicionado) para tener todo el ancho. Desde sm
    // se ancla a este contenedor, justo debajo del boton.
    <div ref={wrapperRef} className="sm:relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setPrefs(open ? null : readAppliedPreferences())}
        aria-expanded={open}
        aria-controls={panelId}
        title={t.button}
        className={`inline-flex h-10 w-10 items-center justify-center rounded-full border font-display text-sm font-bold transition-colors ${
          open
            ? "border-brand-600 bg-brand-50 text-brand-700"
            : "border-line text-ink hover:bg-surface"
        }`}
      >
        <span aria-hidden="true">
          A<span className="text-xs">a</span>
        </span>
        <span className="sr-only">{t.button}</span>
      </button>

      {prefs && (
        <div
          id={panelId}
          role="group"
          aria-label={t.title}
          className="reading-panel absolute inset-x-5 top-full z-50 mt-2 surface-card p-5 shadow-lift sm:inset-x-auto sm:right-0 sm:w-80"
        >
          <p className="font-display text-lg font-bold text-ink">{t.title}</p>

          <p className="mt-4 text-sm font-semibold text-ink">{t.size}</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(["normal", "lg", "xl"] as const).map((size) => {
              const active = prefs.text === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => update({ ...prefs, text: size })}
                  aria-pressed={active}
                  className={`flex flex-col items-center justify-end gap-1 rounded-xl border px-2 pb-2 pt-3 transition-colors ${
                    active
                      ? "border-brand-600 bg-brand-50 text-brand-700"
                      : "border-line text-ink hover:bg-surface"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`font-display font-bold leading-none ${sampleSize[size]}`}
                  >
                    A
                  </span>
                  <span className="text-xs font-medium">{t.sizes[size]}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={prefs.contrast}
            onClick={() => update({ ...prefs, contrast: !prefs.contrast })}
            className="mt-5 flex w-full items-center justify-between gap-4 rounded-xl border border-line px-4 py-3 text-left transition-colors hover:bg-surface"
          >
            <span>
              <span className="block text-sm font-semibold text-ink">
                {t.contrast}
              </span>
              <span className="mt-0.5 block text-xs leading-5 text-muted">
                {t.contrastHint}
              </span>
            </span>
            <span
              aria-hidden="true"
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                prefs.contrast ? "bg-brand-600" : "bg-line"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-card transition-transform ${
                  prefs.contrast ? "translate-x-5.5" : "translate-x-0.5"
                }`}
              />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
