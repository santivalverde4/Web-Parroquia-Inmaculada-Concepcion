import Link from "next/link";
import { getMessages, localizedPath, type Locale } from "@/lib/i18n";
import { LanguageSwitch } from "@/components/LanguageSwitch";

const items = [
  ["", "home"], ["/historia", "history"], ["/videos", "videos"],
  ["/noticias", "news"], ["/proyectos", "projects"], ["/mapa", "map"],
] as const;

export function Navbar({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  return <header className="relative z-10 border-b border-[#dfd9ca] bg-paper">
    <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 lg:px-8">
      <Link href={localizedPath(locale)} className="flex shrink-0 items-center text-[#28392f]" aria-label={t.siteName}>
        <span className="flex flex-col"><span className="text-[.65rem] font-bold uppercase tracking-[.22em] text-[#806f56]">{locale === "es" ? "Parroquia" : "Parish"}</span><span className="font-serif text-lg leading-tight sm:text-xl">{locale === "es" ? "Inmaculada Concepción" : "Immaculate Conception"}</span></span>
      </Link>
      <nav aria-label={locale === "es" ? "Navegación principal" : "Main navigation"} className="hidden items-center gap-5 text-sm font-medium text-[#4a5148] xl:flex">
        {items.map(([path, label]) => <Link key={path} href={localizedPath(locale, path)} className="transition-colors hover:text-[#866a44]">{t[label]}</Link>)}
        <span className="h-5 w-px bg-[#d4cabb]" aria-hidden="true" />
        <LanguageSwitch locale={locale} />
      </nav>
      <details className="group relative xl:hidden">
        <summary className="cursor-pointer list-none rounded-full border border-[#c8bdab] px-4 py-2 text-sm font-semibold text-[#28392f]">{locale === "es" ? "Menú" : "Menu"}</summary>
        <nav aria-label={locale === "es" ? "Navegación móvil" : "Mobile navigation"} className="absolute right-0 top-12 flex w-64 flex-col gap-1 rounded-2xl border border-[#dfd9ca] bg-paper p-3 shadow-xl">
          {items.map(([path, label]) => <Link key={path} href={localizedPath(locale, path)} className="rounded-lg px-3 py-2 text-sm hover:bg-[#eee8dc]">{t[label]}</Link>)}
          <div className="border-t border-[#dfd9ca] px-3 pt-3"><LanguageSwitch locale={locale} /></div>
        </nav>
      </details>
    </div>
  </header>;
}
