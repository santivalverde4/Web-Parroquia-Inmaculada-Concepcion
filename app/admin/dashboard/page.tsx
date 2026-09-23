import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSection } from "@/lib/services/content";
import { addPhotoAction, deleteProjectAction, removePhotoAction, saveProjectAction, saveSectionAction, signOutAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/admin/login");
  const [{ saved }, infoEs, infoEn, historyEs, historyEn, projects] = await Promise.all([
    searchParams,
    getSection("info-general", "es"), getSection("info-general", "en"),
    getSection("historia", "es"), getSection("historia", "en"),
    prisma.project.findMany({ include: { translations: { where: { locale: "en" } } }, orderBy: { createdAt: "desc" } }),
  ]);
  return <main className="min-h-screen bg-paper px-5 py-8 text-ink sm:py-12"><div className="mx-auto max-w-5xl">
    <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-7"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-accent">Parroquia de la Inmaculada Concepción</p><h1 className="mt-2 font-serif text-4xl">Administración</h1><p className="mt-2 text-sm text-muted">{session.user.name || session.user.email}</p></div><div className="flex items-center gap-4"><Link href="/" className="text-sm font-semibold text-accent hover:underline">Ver sitio</Link><form action={signOutAction}><button className="rounded-full border border-line px-4 py-2 text-sm hover:bg-white">Cerrar sesión</button></form></div></header>
    {saved && <p role="status" className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900">Cambios guardados correctamente.</p>}
    <section className="mt-10"><h2 className="font-serif text-3xl">Contenido de la parroquia</h2><p className="mt-2 text-muted">Edite cada idioma por separado. El contenido se muestra en la página de inicio y en la sección de historia.</p><div className="mt-6 grid gap-5 lg:grid-cols-2"><SectionEditor sectionKey="info-general" locale="es" label="Inicio · Español" title={infoEs.title} content={infoEs.content} /><SectionEditor sectionKey="info-general" locale="en" label="Home · English" title={infoEn.title} content={infoEn.content} /><SectionEditor sectionKey="historia" locale="es" label="Historia · Español" title={historyEs.title} content={historyEs.content} /><SectionEditor sectionKey="historia" locale="en" label="History · English" title={historyEn.title} content={historyEn.content} /></div></section>
    <section className="mt-14"><h2 className="font-serif text-3xl">Galería de historia</h2><p className="mt-2 text-muted">Agregue una dirección pública de imagen para mostrarla en la página de historia.</p><form action={addPhotoAction} className="mt-6 grid gap-4 rounded-2xl border border-line bg-white p-6 sm:grid-cols-[1fr_1fr_auto] sm:items-end"><Field label="URL de la imagen" name="url" type="url" required /><Field label="Descripción de la imagen" name="caption" /><button type="submit" className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white">Agregar foto</button></form>{historyEs.photos.length > 0 && <ul className="mt-4 space-y-2 text-sm text-muted">{historyEs.photos.map((photo) => <li key={photo.id} className="flex flex-wrap items-center justify-between gap-3 break-all rounded-lg border border-line bg-white p-3"><span>{photo.caption || "Sin descripción"} · <a href={photo.url} target="_blank" rel="noopener noreferrer" className="text-accent underline">Ver imagen</a></span><form action={removePhotoAction}><input type="hidden" name="id" value={photo.id} /><button type="submit" className="text-red-700 hover:underline">Quitar</button></form></li>)}</ul>}</section>
    <section className="mt-14"><h2 className="font-serif text-3xl">Proyectos</h2><p className="mt-2 text-muted">Publique proyectos en marcha o futuros. La traducción al inglés es opcional.</p><div className="mt-6 space-y-5"><ProjectEditor label="Agregar proyecto" />{projects.map((project) => <ProjectEditor key={project.id} id={project.id} label={`Editar: ${project.title}`} title={project.title} description={project.description} titleEn={project.translations[0]?.title} descriptionEn={project.translations[0]?.description} status={project.status} imageUrl={project.imageUrl} />)}</div></section>
  </div></main>;
}

function Field({ label, name, value, type = "text", required = false }: { label: string; name: string; value?: string | null; type?: string; required?: boolean }) {
  return <label className="block text-sm font-semibold">{label}<input name={name} type={type} defaultValue={value ?? ""} required={required} className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2.5 font-normal outline-none focus:border-accent" /></label>;
}

function TextArea({ label, name, value, required = false }: { label: string; name: string; value?: string | null; required?: boolean }) {
  return <label className="block text-sm font-semibold">{label}<textarea name={name} defaultValue={value ?? ""} required={required} rows={5} className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2.5 font-normal leading-6 outline-none focus:border-accent" /></label>;
}

function SectionEditor({ sectionKey, locale, label, title, content }: { sectionKey: string; locale: string; label: string; title: string; content: string }) {
  return <form action={saveSectionAction} className="rounded-2xl border border-line bg-white p-6"><h3 className="mb-5 font-serif text-2xl">{label}</h3><input type="hidden" name="key" value={sectionKey} /><input type="hidden" name="locale" value={locale} /><div className="space-y-4"><Field label="Título" name="title" value={title} required /><TextArea label="Contenido" name="content" value={content} required /></div><button type="submit" className="mt-5 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">Guardar cambios</button></form>;
}

function ProjectEditor({ id, label, title, description, titleEn, descriptionEn, status = "ACTUAL", imageUrl }: { id?: string; label: string; title?: string; description?: string; titleEn?: string; descriptionEn?: string; status?: "ACTUAL" | "FUTURO"; imageUrl?: string | null }) {
  return <details className="rounded-2xl border border-line bg-white" open={!id}><summary className="cursor-pointer p-6 font-serif text-2xl">{label}</summary><form action={saveProjectAction} className="grid gap-5 border-t border-line p-6 md:grid-cols-2"><input type="hidden" name="id" value={id ?? ""} /><Field label="Título · Español" name="title" value={title} required /><Field label="Title · English" name="titleEn" value={titleEn} /><TextArea label="Descripción · Español" name="description" value={description} required /><TextArea label="Description · English" name="descriptionEn" value={descriptionEn} /><label className="block text-sm font-semibold">Estado<select name="status" defaultValue={status} className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2.5 font-normal"><option value="ACTUAL">En marcha</option><option value="FUTURO">Futuro</option></select></label><Field label="URL de imagen (opcional)" name="imageUrl" type="url" value={imageUrl} /><div className="md:col-span-2"><button type="submit" className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">Guardar proyecto</button></div></form>{id && <details className="mx-6 mb-6 border-t border-line pt-4"><summary className="cursor-pointer text-sm text-red-700">Eliminar proyecto</summary><form action={deleteProjectAction} className="mt-3"><input type="hidden" name="id" value={id} /><button type="submit" className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">Confirmar eliminación</button></form></details>}</details>;
}
