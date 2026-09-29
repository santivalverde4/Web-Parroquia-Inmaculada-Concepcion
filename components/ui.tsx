import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Piezas visuales compartidas por todo el sitio.
 *
 * Existen para que el ancho, los botones y los espacios de imagen se vean
 * igual en todas las paginas: si hay que cambiar el estilo de un boton se
 * cambia aqui una sola vez, no en diez archivos.
 */

/** Ancho maximo y margenes laterales comunes a todas las secciones. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-content px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

/** Etiqueta pequena en mayusculas que va encima de un titulo. */
export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-xs font-bold uppercase tracking-[0.18em] text-brand-700 ${className}`}
    >
      {children}
    </p>
  );
}

const buttonStyles = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-card",
  // Dorado del logo: siempre con texto negro (con blanco no se lee).
  accent:
    "bg-gold-400 text-ink hover:bg-gold-300 active:bg-gold-500 shadow-card",
  secondary:
    "bg-white text-ink border border-line hover:border-brand-300 hover:text-brand-700",
  light:
    "bg-white/15 text-white border border-white/35 backdrop-blur-sm hover:bg-white/25",
} as const;

/** Boton en forma de pastilla. Es un enlace, no un <button>. */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof buttonStyles;
  external?: boolean;
  className?: string;
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 ${buttonStyles[variant]} ${className}`;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

/**
 * Espacio para una fotografia.
 *
 * Si no recibe `src` dibuja un recuadro neutro en vez de la imagen. Asi el
 * diseno se puede terminar antes de tener las fotos definitivas: cuando la
 * foto exista basta con pasarle el `src` y el hueco se llena solo.
 *
 * - `focus`: punto que no se debe recortar, en formato CSS object-position
 *   ("50% 30%" = centro horizontal, un poco arriba). Importa cuando una
 *   foto vertical entra en un marco horizontal.
 * - `zoomOnHover`: la foto crece un poco cuando el cursor pasa sobre la
 *   tarjeta que la contiene (la tarjeta debe tener la clase `group`).
 *
 * Las fotos locales (/images/...) pasan por el optimizador de Next.js, que
 * las redimensiona y las sirve en WebP/AVIF. Las URLs externas (fotos que
 * se cargan desde administracion, miniaturas de YouTube) van sin optimizar
 * porque el optimizador solo acepta dominios configurados.
 */
export function ImageSlot({
  src,
  alt = "",
  ratio = "aspect-[4/3]",
  className = "",
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
  focus = "50% 50%",
  zoomOnHover = false,
}: {
  src?: string | null;
  alt?: string;
  ratio?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  focus?: string;
  zoomOnHover?: boolean;
}) {
  if (!src) {
    return (
      <div
        className={`${ratio} ${className} grid place-items-center bg-surface`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          className="h-8 w-8 text-line"
        >
          <rect x="3" y="4" width="18" height="16" rx="2.5" />
          <circle cx="8.5" cy="9.5" r="1.5" />
          <path d="m4 17 4.5-4.5a1.6 1.6 0 0 1 2.2 0L15 17" />
          <path d="m14 15 1.8-1.8a1.6 1.6 0 0 1 2.2 0L20 15" />
        </svg>
      </div>
    );
  }

  const isExternal = /^https?:\/\//.test(src) || src.startsWith("/api/");

  return (
    <div
      className={`${ratio} ${className} relative overflow-hidden bg-surface`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={isExternal}
        style={{ objectPosition: focus }}
        className={`object-cover ${
          zoomOnHover
            ? "transition-transform duration-700 ease-out group-hover:scale-105"
            : ""
        }`}
      />
    </div>
  );
}

/** Aviso que ocupa el lugar de una lista cuando todavia no hay contenido. */
export function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-panel border border-line bg-surface px-8 py-16 text-center">
      <p className="mx-auto max-w-md leading-7 text-muted">{text}</p>
    </div>
  );
}

/** Enlace para regresar a la portada, al pie de cada pagina interna. */
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
    >
      <span aria-hidden="true">&larr;</span>
      {label}
    </Link>
  );
}

/**
 * Franja con los cuatro colores del logo, en el mismo orden que sus arcos.
 * Es la "firma" visual de la marca: aparece en la portada, en el
 * encabezado de cada seccion y en el pie de pagina.
 */
export function BrandStripe({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-1.5 ${className}`} aria-hidden="true">
      <span className="h-1.5 w-8 rounded-full bg-gold-400" />
      <span className="h-1.5 w-5 rounded-full bg-brand-200" />
      <span className="h-1.5 w-5 rounded-full bg-brand-400" />
      <span className="h-1.5 w-8 rounded-full bg-brand-600" />
    </div>
  );
}
