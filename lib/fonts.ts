import { Plus_Jakarta_Sans, Urbanist } from "next/font/google";

/**
 * Tipografia del sitio.
 *
 * next/font descarga las fuentes en tiempo de build y las sirve desde el
 * mismo dominio: no hay peticion a Google en tiempo de ejecucion y no hay
 * salto visual al cargar la pagina.
 *
 * - sans (Plus Jakarta Sans): interfaz y texto corrido. Tiene una altura de
 *   x generosa, asi que se lee bien en tamanos pequenos y en celular.
 * - display (Urbanist): titulares. Geometrica y de trazos rectos, en la
 *   linea de la referencia visual. Solo se usa en tamanos grandes.
 */
export const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const fontDisplay = Urbanist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

/** Clases que se aplican al <html> de cada layout. */
export const fontVariables = `${fontSans.variable} ${fontDisplay.variable}`;
