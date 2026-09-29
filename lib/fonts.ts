import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";

/**
 * Tipografia del sitio.
 *
 * next/font descarga las fuentes en tiempo de build y las sirve desde el
 * mismo dominio: no hay peticion a Google en tiempo de ejecucion y no hay
 * salto visual al cargar la pagina.
 *
 * - sans (Plus Jakarta Sans): interfaz y texto corrido. Geometrica y amable.
 * - display (Fraunces): titulares. Aporta la calidez que pide una parroquia
 *   sin caer en lo solemne.
 */
export const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const fontDisplay = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  axes: ["SOFT", "WONK", "opsz"],
});

/** Clases que se aplican al <html> de cada layout. */
export const fontVariables = `${fontSans.variable} ${fontDisplay.variable}`;
