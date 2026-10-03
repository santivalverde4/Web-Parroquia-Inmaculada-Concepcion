/**
 * Preferencias de lectura del visitante: tamano del texto y alto contraste.
 *
 * Se aplican como atributos en <html> (data-text y data-contrast) y todo el
 * cambio visual vive en globals.css. Se guardan en localStorage para que la
 * persona no tenga que elegirlas de nuevo en cada visita.
 */

export const textSizes = ["normal", "lg", "xl"] as const;
export type TextSize = (typeof textSizes)[number];

export type ReadingPreferences = {
  text: TextSize;
  contrast: boolean;
};

export const readingStorageKey = "parroquia-lectura";

/**
 * Script que corre en el <head> ANTES de pintar la pagina. Si las
 * preferencias se aplicaran despues, al cargar React, la persona veria la
 * pagina un instante con letra normal y luego un salto. Por eso es un
 * script en linea y no codigo de un componente.
 *
 * Si la persona nunca eligio nada pero su sistema pide mas contraste
 * (prefers-contrast: more), se activa el alto contraste por defecto.
 */
export const readingPreferencesScript = `(function(){try{var d=document.documentElement;var p=JSON.parse(localStorage.getItem("${readingStorageKey}")||"null");if(p&&(p.text==="lg"||p.text==="xl"))d.dataset.text=p.text;var c=p&&typeof p.contrast==="boolean"?p.contrast:window.matchMedia("(prefers-contrast: more)").matches;if(c)d.dataset.contrast="high";}catch(e){}})();`;

/** Lee las preferencias que estan aplicadas ahora mismo en <html>. */
export function readAppliedPreferences(): ReadingPreferences {
  const { text, contrast } = document.documentElement.dataset;
  return {
    text: text === "lg" || text === "xl" ? text : "normal",
    contrast: contrast === "high",
  };
}

/** Aplica las preferencias en <html> y las guarda para la proxima visita. */
export function applyPreferences(preferences: ReadingPreferences) {
  const root = document.documentElement;
  if (preferences.text === "normal") delete root.dataset.text;
  else root.dataset.text = preferences.text;
  if (preferences.contrast) root.dataset.contrast = "high";
  else delete root.dataset.contrast;

  try {
    localStorage.setItem(readingStorageKey, JSON.stringify(preferences));
  } catch {
    // Navegacion privada o almacenamiento bloqueado: la preferencia
    // funciona igual, solo que no se recuerda en la proxima visita.
  }
}
