import Link from "next/link";
import { getMessages, localizedPath, type Locale } from "@/lib/i18n";

export function Footer({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  return <footer className="mt-auto bg-[#263a31] px-5 py-12 text-[#f5f0e6] lg:px-8">
    <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
      <div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#c9b68e]">{locale === "es" ? "Parroquia" : "Parish"}</p><p className="mt-3 font-serif text-2xl">{locale === "es" ? "Inmaculada Concepción" : "Immaculate Conception"}</p><p className="mt-3 max-w-xs text-sm leading-7 text-[#d7dfd7]">{t.footer}</p></div>
      <div><p className="mb-4 text-sm font-semibold">{locale === "es" ? "Explore la comunidad" : "Explore our community"}</p><div className="flex flex-col gap-2 text-sm text-[#d7dfd7]"><Link href={localizedPath(locale, "/historia")} className="hover:text-white">{t.history}</Link><Link href={localizedPath(locale, "/noticias")} className="hover:text-white">{t.news}</Link><Link href={localizedPath(locale, "/proyectos")} className="hover:text-white">{t.projects}</Link></div></div>
      <div><p className="mb-4 text-sm font-semibold">{locale === "es" ? "Planee su visita" : "Plan your visit"}</p><Link href={localizedPath(locale, "/mapa")} className="text-sm text-[#d7dfd7] underline decoration-[#b7a27e] underline-offset-4 hover:text-white">{locale === "es" ? "Cómo llegar" : "Find us"}</Link></div>
    </div>
    <div className="mx-auto mt-12 flex max-w-7xl flex-wrap justify-between gap-4 border-t border-[#ffffff35] pt-5 text-xs text-[#c3cec4]"><span>{new Date().getFullYear()} {t.siteName}.</span><Link href="/admin/login" className="hover:text-white">{t.admin}</Link></div>
  </footer>;
}
