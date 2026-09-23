import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";

export function SectionLayout({ locale, title, intro, children }: { locale: Locale; title: string; intro?: string; children: ReactNode }) {
  return <main id="main-content" className="w-full flex-1">
    <header className="border-b border-[#ded9cc] bg-[#eeeae0] px-5 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#796548]">{locale === "es" ? "Inmaculada Concepción" : "Immaculate Conception"}</p><h1 className="mt-4 max-w-4xl font-serif text-5xl leading-tight text-[#263a31] sm:text-6xl">{title}</h1>{intro && <p className="mt-5 max-w-2xl text-lg leading-8 text-[#555b52]">{intro}</p>}</div>
    </header>
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">{children}</div>
  </main>;
}
