import { ImageSlot } from "@/components/ui";
import type { Localized, ParishSettings } from "@/lib/parishInfo";
import {
  addPhotoAction,
  deleteProjectAction,
  removePhotoAction,
  resetSectionAction,
  saveContactAction,
  saveProjectAction,
  saveScheduleAction,
  saveSectionAction,
} from "./actions";
import { SubmitButton } from "./_submit";
import { SCHEDULE_ROWS, TIMES_PER_ROW } from "./_tabs";
import {
  Card,
  ConfirmAction,
  Field,
  FormActions,
  LanguageColumns,
  Notice,
  TextArea,
} from "./_ui";

/** Muestra el ingles solo si es distinto del espanol (si no, el campo queda vacio). */
const englishOf = (text: Localized) => (text.en === text.es ? "" : text.en);

/* ------------------------------------------------------------------ */
/* Portada e Historia (mismo formulario de texto)                      */
/* ------------------------------------------------------------------ */

type SectionText = { title: string; content: string };

export function SectionPanel({
  sectionKey,
  spanish,
  english,
  isCustom,
  contentHint,
  rows,
}: {
  sectionKey: "info-general" | "historia";
  spanish: SectionText;
  english: SectionText | null;
  isCustom: boolean;
  contentHint: string;
  rows: number;
}) {
  return (
    <Card
      title="Texto"
      description={
        isCustom
          ? "Este texto fue editado desde el panel."
          : "Ahora se muestra el texto original de la página. Puede cambiarlo aquí cuando quiera."
      }
    >
      <form action={saveSectionAction}>
        <input type="hidden" name="key" value={sectionKey} />
        <LanguageColumns
          englishNote="Si cambia el texto en español, recuerde actualizar también esta versión. Si la deja vacía, la página en inglés mostrará el texto en español."
          spanish={
            <>
              <Field
                label="Título"
                name="titleEs"
                defaultValue={spanish.title}
                required
              />
              <TextArea
                label="Texto"
                name="contentEs"
                defaultValue={spanish.content}
                rows={rows}
                hint={contentHint}
                required
              />
            </>
          }
          english={
            <>
              <Field
                label="Title"
                name="titleEn"
                defaultValue={english?.title}
              />
              <TextArea
                label="Text"
                name="contentEn"
                defaultValue={english?.content}
                rows={rows}
              />
            </>
          }
        />
        <FormActions />
      </form>

      {isCustom && (
        <div className="mt-4">
          <ConfirmAction
            action={resetSectionAction}
            hidden={{ key: sectionKey }}
            label="Volver al texto original"
            question="La página volverá a mostrar el texto con el que se creó el sitio. Lo que escribió aquí se perderá."
            confirmLabel="Sí, volver al original"
            tone="neutral"
          />
        </div>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Fotos de Historia                                                   */
/* ------------------------------------------------------------------ */

export function HistoryPhotosPanel({
  photos,
}: {
  photos: { id: string; url: string; caption: string | null }[];
}) {
  return (
    <Card
      title="Fotografías de la galería"
      description="Las fotos que agregue aquí aparecen primero en la galería de la página de historia, antes de las fotos que ya trae el sitio."
    >
      <form
        action={addPhotoAction}
        className="grid gap-4 rounded-card border border-line bg-surface/60 p-4 sm:p-5 lg:grid-cols-[1.4fr_1fr_auto] lg:items-end"
      >
        <Field
          label="Enlace de la imagen"
          name="url"
          type="url"
          placeholder="https://…"
          maxLength={2000}
          required
          hint="En la foto publicada en internet: clic derecho → «Copiar dirección de imagen»."
        />
        <Field
          label="Descripción"
          name="caption"
          optional
          placeholder="Ej.: Fiesta patronal 2025"
          hint="Se muestra debajo de la foto."
        />
        <div className="lg:pb-6">
          <SubmitButton pendingText="Agregando…">Agregar foto</SubmitButton>
        </div>
      </form>

      {photos.length === 0 ? (
        <p className="mt-5 text-sm leading-6 text-muted">
          Todavía no ha agregado fotos. La galería muestra las fotografías que
          ya trae el sitio.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => (
            <li
              key={photo.id}
              className="overflow-hidden rounded-card border border-line bg-white"
            >
              <ImageSlot
                src={photo.url}
                alt={photo.caption ?? ""}
                ratio="aspect-[4/3]"
                sizes="300px"
              />
              <div className="flex items-start justify-between gap-2 p-3">
                <p className="pt-1.5 text-sm leading-6 text-ink">
                  {photo.caption || (
                    <span className="text-muted">Sin descripción</span>
                  )}
                </p>
                <ConfirmAction
                  action={removePhotoAction}
                  hidden={{ id: photo.id }}
                  label="Quitar"
                  question="¿Quitar esta foto de la galería?"
                  confirmLabel="Sí, quitar"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Horarios y servicios                                                */
/* ------------------------------------------------------------------ */

export function SchedulePanel({ settings }: { settings: ParishSettings }) {
  const rows = Array.from(
    { length: SCHEDULE_ROWS },
    (_, index) => settings.massSchedule[index] ?? null,
  );

  return (
    <form action={saveScheduleAction} className="space-y-6">
      <Card
        title="Horarios de misa"
        description="Una fila por día o grupo de días (por ejemplo «Lunes a viernes»). Puede poner hasta cuatro misas por fila. Las filas vacías no se muestran."
      >
        <div className="space-y-4">
          {rows.map((row, index) => (
            <fieldset
              key={index}
              className="rounded-card border border-line p-4 sm:p-5"
            >
              <legend className="px-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-700">
                Fila {index + 1}
              </legend>
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Día"
                  name={`dayEs${index}`}
                  defaultValue={row?.day.es}
                  placeholder={index === 0 ? "Ej.: Lunes a viernes" : ""}
                />
                <Field
                  label="Day (English)"
                  name={`dayEn${index}`}
                  defaultValue={row ? englishOf(row.day) : ""}
                  placeholder={index === 0 ? "Ej.: Monday to Friday" : ""}
                  optional
                />
              </div>
              <p className="mt-4 text-sm font-semibold text-ink">
                Horas de misa
              </p>
              <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Array.from({ length: TIMES_PER_ROW }, (_, slot) => (
                  <label key={slot} className="block">
                    <span className="sr-only">
                      Fila {index + 1}, misa {slot + 1}
                    </span>
                    <input
                      type="time"
                      name={`time${index}_${slot}`}
                      defaultValue={row?.times[slot] ?? ""}
                      className="w-full rounded-xl border border-line bg-white px-3 py-2.5 tabular-nums text-ink outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    />
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
        <p className="mt-4 text-xs leading-5 text-muted">
          Las horas se ordenan solas y se muestran con «a. m.» o «p. m.». Para
          quitar una misa, borre su hora.
        </p>
      </Card>

      <Card
        title="Servicios y oficina"
        description="Escriba un servicio por línea. Si agrega la versión en inglés, use el mismo orden."
      >
        <LanguageColumns
          englishNote="Si la deja vacía, se usan los nombres en español."
          spanish={
            <>
              <TextArea
                label="Servicios"
                name="servicesEs"
                rows={7}
                defaultValue={settings.services
                  .map((service) => service.es)
                  .join("\n")}
                placeholder={"Bautizos\nMatrimonios"}
                maxLength={2000}
              />
              <Field
                label="Horario de la oficina"
                name="officeEs"
                defaultValue={settings.officeHours.es}
                hint="Se muestra debajo de los servicios. Déjelo vacío para ocultarlo."
                maxLength={300}
              />
            </>
          }
          english={
            <>
              <TextArea
                label="Services"
                name="servicesEn"
                rows={7}
                defaultValue={
                  settings.services.every((service) => !englishOf(service))
                    ? ""
                    : settings.services.map((service) => service.en).join("\n")
                }
                maxLength={2000}
              />
              <Field
                label="Office hours"
                name="officeEn"
                defaultValue={englishOf(settings.officeHours)}
                maxLength={300}
              />
            </>
          }
        />
        <FormActions>Guardar horarios y servicios</FormActions>
      </Card>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Contacto                                                            */
/* ------------------------------------------------------------------ */

export function ContactPanel({ settings }: { settings: ParishSettings }) {
  const { contact } = settings;
  return (
    <Card>
      <form action={saveContactAction}>
        <div className="grid gap-5 md:grid-cols-3">
          <Field
            label="Teléfono"
            name="phone"
            type="tel"
            defaultValue={contact.phone}
            placeholder="2279-5760"
            hint="Al tocarlo en el celular, se abre la llamada."
            optional
          />
          <Field
            label="WhatsApp"
            name="whatsapp"
            type="tel"
            defaultValue={contact.whatsapp}
            placeholder="8972-9668"
            hint="Abre una conversación de WhatsApp con ese número."
            optional
          />
          <Field
            label="Correo electrónico"
            name="email"
            type="email"
            defaultValue={contact.email}
            placeholder="parroquia@ejemplo.com"
            optional
          />
        </div>
        <div className="mt-6">
          <LanguageColumns
            englishNote="Si la deja vacía, se muestra la dirección en español."
            spanish={
              <Field
                label="Dirección"
                name="addressEs"
                defaultValue={contact.address.es}
                placeholder="Concepción, La Unión, Cartago"
                hint="Aparece en el pie de página, junto al botón «Cómo llegar»."
                maxLength={300}
              />
            }
            english={
              <Field
                label="Address"
                name="addressEn"
                defaultValue={englishOf(contact.address)}
                maxLength={300}
              />
            }
          />
        </div>
        <FormActions />
      </form>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Proyectos                                                           */
/* ------------------------------------------------------------------ */

export type AdminProject = {
  id: string;
  title: string;
  description: string;
  status: "ACTUAL" | "FUTURO";
  imageUrl: string | null;
  titleEn: string;
  descriptionEn: string;
};

const statusLabel = { ACTUAL: "En marcha", FUTURO: "Próximamente" } as const;

function ProjectForm({ project }: { project?: AdminProject }) {
  return (
    <form action={saveProjectAction} className="space-y-5">
      <input type="hidden" name="id" value={project?.id ?? ""} />
      <LanguageColumns
        englishNote="Complete los dos campos o deje ambos vacíos. Si los deja vacíos, se muestra el texto en español."
        spanish={
          <>
            <Field
              label="Nombre del proyecto"
              name="title"
              defaultValue={project?.title}
              placeholder="Ej.: Remodelación del salón"
              required
            />
            <TextArea
              label="Descripción"
              name="description"
              defaultValue={project?.description}
              rows={4}
              placeholder="¿Qué se quiere lograr y cómo puede ayudar la comunidad?"
              required
            />
          </>
        }
        english={
          <>
            <Field
              label="Project name"
              name="titleEn"
              defaultValue={project?.titleEn}
            />
            <TextArea
              label="Description"
              name="descriptionEn"
              defaultValue={project?.descriptionEn}
              rows={4}
            />
          </>
        }
      />
      <div className="grid gap-5 md:grid-cols-[auto_1fr] md:items-start">
        <fieldset>
          <legend className="text-sm font-semibold text-ink">Estado</legend>
          <div className="mt-2 flex gap-2">
            {(["ACTUAL", "FUTURO"] as const).map((status) => (
              <label
                key={status}
                className="flex cursor-pointer items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink transition-colors has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50 has-[:checked]:text-brand-700"
              >
                <input
                  type="radio"
                  name="status"
                  value={status}
                  defaultChecked={(project?.status ?? "ACTUAL") === status}
                  className="accent-brand-600"
                />
                {statusLabel[status]}
              </label>
            ))}
          </div>
        </fieldset>
        <Field
          label="Enlace de una imagen"
          name="imageUrl"
          type="url"
          defaultValue={project?.imageUrl}
          placeholder="https://…"
          maxLength={2000}
          hint="Clic derecho sobre una foto publicada → «Copiar dirección de imagen». Sin imagen se muestra un recuadro neutro."
          optional
        />
      </div>
      <FormActions>
        {project ? "Guardar cambios" : "Publicar proyecto"}
      </FormActions>
    </form>
  );
}

export function ProjectsPanel({ projects }: { projects: AdminProject[] }) {
  return (
    <div className="space-y-6">
      {projects.length === 0 && (
        <Notice tone="info">
          Todavía no hay proyectos guardados, así que la página muestra tres
          proyectos de ejemplo. En cuanto publique el primero, los ejemplos
          desaparecen.
        </Notice>
      )}

      <details
        className="group rounded-panel border border-line bg-white shadow-card"
        open={projects.length === 0}
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-7">
          <span>
            <span className="block font-display text-xl font-bold text-ink">
              Agregar un proyecto
            </span>
            <span className="mt-1 block text-sm text-muted">
              Se publica de inmediato en la página de proyectos.
            </span>
          </span>
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-600 text-xl leading-none text-white transition-transform group-open:rotate-45"
            aria-hidden="true"
          >
            +
          </span>
        </summary>
        <div className="border-t border-line p-5 sm:p-7">
          <ProjectForm />
        </div>
      </details>

      {projects.length > 0 && (
        <section>
          <h3 className="font-display text-xl font-bold text-ink">
            Proyectos publicados ({projects.length})
          </h3>
          <ul className="mt-4 space-y-4">
            {projects.map((project) => (
              <li
                key={project.id}
                className="rounded-panel border border-line bg-white p-4 shadow-card sm:p-5"
              >
                <div className="flex gap-4">
                  <ImageSlot
                    src={project.imageUrl}
                    ratio="aspect-[4/3]"
                    className="w-24 shrink-0 rounded-xl sm:w-32"
                    sizes="128px"
                  />
                  <div className="min-w-0 flex-1">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        project.status === "ACTUAL"
                          ? "bg-brand-50 text-brand-700"
                          : "bg-gold-100 text-gold-700"
                      }`}
                    >
                      {statusLabel[project.status]}
                    </span>
                    <p className="mt-1.5 font-display text-lg font-bold leading-snug text-ink">
                      {project.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted">
                      {project.description}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-start gap-1 border-t border-line pt-3">
                  <details className="w-full sm:w-auto sm:flex-1 [&[open]]:w-full">
                    <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-brand-600 hover:bg-brand-50">
                      Editar
                    </summary>
                    <div className="mt-3 rounded-card border border-line bg-surface/50 p-4 sm:p-5">
                      <ProjectForm project={project} />
                    </div>
                  </details>
                  <ConfirmAction
                    action={deleteProjectAction}
                    hidden={{ id: project.id }}
                    label="Eliminar"
                    question={`¿Eliminar «${project.title}»? Dejará de verse en el sitio y no se puede recuperar.`}
                    confirmLabel="Sí, eliminar proyecto"
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
