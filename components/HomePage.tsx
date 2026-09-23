import Link from "next/link";
import { getMessages, localizedPath, type Locale } from "@/lib/i18n";
import { getSection } from "@/lib/services/content";
import { PublicShell } from "@/components/PublicShell";

const destinations = [
  { path: "/historia", key: "history", number: "01" },
  { path: "/noticias", key: "news", number: "02" },
  { path: "/proyectos", key: "projects", number: "03" },
] as const;

export async function HomePage({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const info = await getSection("info-general", locale);
  return <PublicShell locale={locale}>
    <main id="main-content" className="flex-1">
      <section className="border-b border-[#ddd5c7] bg-[#eeeae0]">
        <div className="mx-auto grid max-w-7xl lg:min-h-[570px] lg:grid-cols-[1.12fr_.88fr]">
          <div className="flex flex-col justify-center px-5 py-20 lg:px-8 lg:py-24">
            <p className="text-xs font-bold uppercase tracking-[.25em] text-[#796548]">{locale === "es" ? "Bienvenidos a nuestra comunidad" : "Welcome to our community"}</p>
            <h1 className="mt-6 max-w-2xl font-serif text-5xl leading-[1.08] tracking-tight text-[#293d31] sm:text-6xl lg:text-7xl">{locale === "es" ? "Un lugar para encontrarnos en la fe." : "A place to gather in faith."}</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#536057]">{t.intro}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={localizedPath(locale, "/historia")} className="rounded-full bg-[#2c4938] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1e3328]">{locale === "es" ? "Conozca la parroquia" : "Discover the parish"}</Link>
              <Link href={localizedPath(locale, "/mapa")} className="rounded-full border border-[#9b967f] px-6 py-3 text-sm font-semibold text-[#2c4938] transition-colors hover:bg-[#e2ddcf]">{locale === "es" ? "Cómo llegar" : "Find us"}</Link>
            </div>
          </div>
          <div className="relative min-h-80 overflow-hidden bg-[#dfe5db] lg:min-h-full" aria-hidden="true">
            <div className="absolute inset-8 rounded-t-[48%] border border-[#9cae9f] sm:inset-12" />
            <div className="absolute inset-x-[22%] top-[15%] bottom-[-15%] rounded-t-[48%] border border-[#9cae9f]" />
            <div className="absolute left-1/2 top-[19%] h-[45%] w-[2px] -translate-x-1/2 bg-[#86785d]" />
            <div className="absolute left-1/2 top-[31%] h-[2px] w-20 -translate-x-1/2 bg-[#86785d]" />
            <div className="absolute -bottom-[44%] left-1/2 aspect-square w-[80%] -translate-x-1/2 rounded-full bg-[#cad6c9]" />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-[#796548]">{locale === "es" ? "Vida parroquial" : "Parish life"}</p><h2 className="mt-3 font-serif text-4xl text-[#293d31] sm:text-5xl">{locale === "es" ? "Explore la comunidad" : "Explore our community"}</h2></div><p className="max-w-md leading-7 text-[#62675f]">{locale === "es" ? "Hay muchas maneras de acercarse, participar y mantenerse al tanto." : "There are many ways to connect, take part, and stay informed."}</p></div>
        <div className="mt-9 grid gap-4 md:grid-cols-3">{destinations.map(({ path, key, number }) => <Link key={path} href={localizedPath(locale, path)} className="group flex min-h-52 flex-col justify-between rounded-2xl border border-[#ddd5c7] bg-white p-7 transition-all hover:-translate-y-1 hover:border-[#a99b82] hover:shadow-lg"><span className="text-xs font-semibold tracking-widest text-[#a28b66]">{number}</span><span className="font-serif text-3xl text-[#293d31]">{t[key]}</span></Link>)}</div>
      </section>
      <section className="bg-[#e8eee6] px-5 py-16 lg:px-8 lg:py-20"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-[#796548]">{t.siteName}</p><h2 className="mt-4 font-serif text-4xl text-[#293d31]">{info.title}</h2><p className="mt-5 whitespace-pre-wrap leading-8 text-[#4f5d52]">{info.content}</p></div><div className="grid gap-4 sm:grid-cols-2"><div className="rounded-2xl bg-white/75 p-7"><h3 className="font-serif text-2xl text-[#293d31]">{t.mass}</h3><p className="mt-3 leading-7 text-[#5e665e]">{t.massText}</p></div><div className="rounded-2xl bg-white/75 p-7"><h3 className="font-serif text-2xl text-[#293d31]">{t.services}</h3><p className="mt-3 leading-7 text-[#5e665e]">{t.servicesText}</p></div></div></div></section>
    </main>
  </PublicShell>;
}
