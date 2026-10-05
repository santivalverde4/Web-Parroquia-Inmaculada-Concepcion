"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Reproductor "liviano" de YouTube.
 *
 * Primero muestra solo la miniatura con un boton de play; el iframe de
 * YouTube (que pesa cerca de 1 MB de scripts) se carga recien cuando la
 * persona decide verlo. Usa youtube-nocookie.com para no dejar cookies de
 * seguimiento hasta que se reproduzca.
 */
export function YouTubePlayer({
  id,
  title,
  poster,
  playLabel,
}: {
  id: string;
  title: string;
  poster: string | null;
  playLabel: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="aspect-video overflow-hidden rounded-card bg-brand-950">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative block aspect-video w-full overflow-hidden rounded-card bg-brand-900"
    >
      {poster && (
        <Image
          src={poster}
          alt=""
          fill
          unoptimized
          priority
          sizes="(max-width: 1024px) 100vw, 700px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      )}
      <span
        className="absolute inset-0 bg-gradient-to-t from-brand-900/55 via-brand-900/10 to-transparent"
        aria-hidden="true"
      />
      <span className="absolute inset-0 grid place-items-center">
        <PlayBadge size="lg" />
      </span>
      <span className="sr-only">
        {playLabel}: {title}
      </span>
    </button>
  );
}

/** Circulo con el triangulo de play; tambien lo usan las tarjetas. */
export function PlayBadge({ size = "sm" }: { size?: "sm" | "lg" }) {
  const box = size === "lg" ? "h-16 w-16 sm:h-20 sm:w-20" : "h-12 w-12";
  const icon = size === "lg" ? "h-7 w-7 sm:h-8 sm:w-8" : "h-5 w-5";
  return (
    <span
      className={`grid ${box} place-items-center rounded-full bg-white/90 text-brand-700 shadow-lift transition-all duration-300 group-hover:scale-110 group-hover:bg-gold-400 group-hover:text-ink`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`${icon} translate-x-0.5`}
      >
        <path d="M8 5.6v12.8a1 1 0 0 0 1.52.85l10.2-6.4a1 1 0 0 0 0-1.7L9.52 4.75A1 1 0 0 0 8 5.6Z" />
      </svg>
    </span>
  );
}
