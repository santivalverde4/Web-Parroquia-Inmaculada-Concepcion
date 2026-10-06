import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { historyStory, historyTitle } from "@/lib/history";
import { prisma } from "@/lib/prisma";
import { getFallbackSection, getStoredSection } from "@/lib/services/content";
import { getParishSettings } from "@/lib/services/settings";
import { signOutAction } from "./actions";
import { errorMessages, successMessages } from "./_messages";
import {
  ContactPanel,
  HistoryPhotosPanel,
  ProjectsPanel,
  SchedulePanel,
  SectionPanel,
  type AdminProject,
} from "./_panels";
import { adminTabs, isAdminTab, type AdminTab } from "./_tabs";
import { Notice } from "./_ui";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; ok?: string; error?: string }>;
}) {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/admin/login");

  const params = await searchParams;
  const activeTab: AdminTab = isAdminTab(params.tab) ? params.tab : "inicio";
  const tab = adminTabs.find(({ id }) => id === activeTab)!;
  const success = params.ok ? successMessages[params.ok] : undefined;
  const error = params.error
    ? (errorMessages[params.error] ?? errorMessages.unknown)
    : undefined;
  const firstName = (session.user.name || "").split(" ")[0];

  return (
    <div className="min-h-screen bg-surface text-ink">
      {/* Barra superior ---------------------------------------------- */}
      <header className="sticky top-0 z-20 border-b border-line bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src="/images/logo-parroquia.png"
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 shrink-0"
            />
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-700">
                Inmaculada Concepción
              </p>
              <p className="truncate font-display text-lg font-bold">
                Panel de administración
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand-300 hover:text-brand-700 sm:inline-flex"
            >
              Ver el sitio ↗
            </a>
            <form action={signOutAction}>
              <button className="rounded-full px-4 py-2 transition-colors hover:bg-surface">
                <span className="text-sm font-semibold text-muted">
                  Cerrar sesión
                </span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10 lg:py-10">
        {/* Navegacion ------------------------------------------------- */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="font-display text-2xl font-bold">
            {firstName ? `Hola, ${firstName}` : "Hola"}
          </p>
          <p className="mt-1 text-sm text-muted">¿Qué desea actualizar hoy?</p>

          <nav aria-label="Secciones del panel" className="mt-5">
            {/* En celular las pestanas se desplazan de lado; en escritorio
                forman una columna. */}
            <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
              {adminTabs.map((item) => {
                const active = item.id === activeTab;
                return (
                  <li key={item.id} className="shrink-0">
                    <Link
                      href={`/admin/dashboard?tab=${item.id}`}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-card border px-4 py-3 transition-colors ${
                        active
                          ? "border-brand-600 bg-white shadow-card"
                          : "border-transparent hover:border-line hover:bg-white"
                      }`}
                    >
                      <span
                        className={`block text-sm font-semibold ${
                          active ? "text-brand-700" : "text-ink"
                        }`}
                      >
                        {item.label}
                      </span>
                      <span className="mt-0.5 hidden text-xs text-muted lg:block">
                        {item.summary}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-6 hidden rounded-card border border-line bg-white p-4 text-xs leading-5 text-muted lg:block">
            <p className="font-semibold text-ink">¿Cómo funciona?</p>
            <p className="mt-1">
              Elija una sección, cambie lo que necesite y presione «Guardar».
              Puede revisar el resultado con «Ver el sitio».
            </p>
          </div>
        </aside>

        {/* Contenido ------------------------------------------------- */}
        <main className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {tab.title}
              </h1>
              <p className="mt-2 max-w-2xl leading-7 text-muted">
                {tab.description}
              </p>
            </div>
            <a
              href={tab.where.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-600 shadow-card transition-colors hover:text-brand-700"
            >
              Ver en el sitio: {tab.where.label} ↗
            </a>
          </div>

          {(success || error) && (
            <div className="mt-6">
              {success && <Notice tone="success">{success}</Notice>}
              {error && <Notice tone="error">{error}</Notice>}
            </div>
          )}

          <div className="mt-6 space-y-6">
            <TabContent tab={activeTab} />
          </div>
        </main>
      </div>
    </div>
  );
}

/** Carga solo los datos de la pestana abierta. */
async function TabContent({ tab }: { tab: AdminTab }) {
  if (tab === "inicio") {
    const stored = await getStoredSection("info-general");
    return (
      <SectionPanel
        sectionKey="info-general"
        spanish={stored.es ?? getFallbackSection("info-general", "es")}
        english={
          stored.es ? stored.en : getFallbackSection("info-general", "en")
        }
        isCustom={Boolean(stored.es)}
        contentHint="Un párrafo corto funciona mejor: dos o tres oraciones."
        rows={5}
      />
    );
  }

  if (tab === "historia") {
    const stored = await getStoredSection("historia");
    // Si nunca se edito, el formulario muestra el relato actual de la
    // pagina para que se pueda corregir en vez de escribir desde cero.
    const original = (locale: "es" | "en") => ({
      title: historyTitle[locale],
      content: historyStory.map((paragraph) => paragraph[locale]).join("\n\n"),
    });
    return (
      <>
        <SectionPanel
          sectionKey="historia"
          spanish={stored.es ?? original("es")}
          english={stored.es ? stored.en : original("en")}
          isCustom={Boolean(stored.es)}
          contentHint="Para separar párrafos, deje una línea en blanco entre ellos."
          rows={12}
        />
        <HistoryPhotosPanel photos={stored.photos} />
      </>
    );
  }

  if (tab === "horarios") {
    return <SchedulePanel settings={await getParishSettings()} />;
  }

  if (tab === "contacto") {
    return <ContactPanel settings={await getParishSettings()} />;
  }

  const projects = await prisma.project.findMany({
    include: { translations: { where: { locale: "en" } } },
    orderBy: { createdAt: "desc" },
  });
  const adminProjects: AdminProject[] = projects.map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description,
    status: project.status,
    imageUrl: project.imageUrl,
    titleEn: project.translations[0]?.title ?? "",
    descriptionEn: project.translations[0]?.description ?? "",
  }));
  return <ProjectsPanel projects={adminProjects} />;
}
