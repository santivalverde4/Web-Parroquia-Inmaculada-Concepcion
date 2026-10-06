import type { ReactNode } from "react";
import { SubmitButton } from "./_submit";

/**
 * Piezas del panel de administracion.
 *
 * Mismo lenguaje visual que el sitio publico (colores, radios, sombras),
 * pero mas sobrio: aqui lo importante es que cada campo se entienda.
 */

const inputClasses =
  "mt-2 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 font-normal text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

/** Bloque blanco con titulo; agrupa un formulario o una lista. */
export function Card({
  title,
  description,
  children,
  className = "",
}: {
  title?: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-panel border border-line bg-white p-5 shadow-card sm:p-7 ${className}`}
    >
      {title && (
        <h3 className="font-display text-xl font-bold text-ink">{title}</h3>
      )}
      {description && (
        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted">
          {description}
        </p>
      )}
      <div className={title || description ? "mt-6" : ""}>{children}</div>
    </section>
  );
}

/** Etiqueta con la marca de obligatorio u opcional. */
function Label({
  label,
  required,
  optional,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <span className="flex items-baseline gap-2 text-sm font-semibold text-ink">
      {label}
      {required && (
        <span className="text-xs font-medium text-red-700">Obligatorio</span>
      )}
      {optional && (
        <span className="text-xs font-medium text-muted">Opcional</span>
      )}
    </span>
  );
}

function Hint({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <span className="mt-1.5 block text-xs leading-5 text-muted">
      {children}
    </span>
  );
}

export function Field({
  label,
  name,
  defaultValue,
  hint,
  type = "text",
  required = false,
  optional = false,
  placeholder,
  maxLength = 200,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  hint?: ReactNode;
  type?: "text" | "url" | "email" | "tel";
  required?: boolean;
  optional?: boolean;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <Label label={label} required={required} optional={optional} />
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        className={inputClasses}
      />
      <Hint>{hint}</Hint>
    </label>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  hint,
  required = false,
  optional = false,
  rows = 6,
  placeholder,
  maxLength = 20000,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  hint?: ReactNode;
  required?: boolean;
  optional?: boolean;
  rows?: number;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <Label label={label} required={required} optional={optional} />
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        rows={rows}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`${inputClasses} leading-7`}
      />
      <Hint>{hint}</Hint>
    </label>
  );
}

/**
 * Dos columnas, espanol a la izquierda e ingles a la derecha, para que
 * quede claro que son el mismo contenido en dos idiomas.
 */
export function LanguageColumns({
  spanish,
  english,
  englishNote = "Si lo deja vacío, la página en inglés mostrará el texto en español.",
}: {
  spanish: ReactNode;
  english: ReactNode;
  englishNote?: string;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-card border border-line bg-surface/60 p-4 sm:p-5">
        <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-700">
          <span aria-hidden="true">ES</span> Español
        </p>
        <div className="space-y-4">{spanish}</div>
      </div>
      <div className="rounded-card border border-dashed border-line p-4 sm:p-5">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-muted">
          <span aria-hidden="true">EN</span> English · opcional
        </p>
        <p className="mb-4 mt-1 text-xs leading-5 text-muted">{englishNote}</p>
        <div className="space-y-4">{english}</div>
      </div>
    </div>
  );
}

/** Pie del formulario con el boton de guardar. */
export function FormActions({
  children = "Guardar cambios",
}: {
  children?: ReactNode;
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5">
      <SubmitButton>{children}</SubmitButton>
      <span className="text-xs text-muted">
        Los cambios se ven en el sitio apenas se guardan.
      </span>
    </div>
  );
}

/**
 * Accion peligrosa en dos pasos: primero se abre una confirmacion y recien
 * ahi aparece el boton que borra. Funciona sin JavaScript.
 */
export function ConfirmAction({
  action,
  hidden,
  label,
  question,
  confirmLabel,
  tone = "danger",
}: {
  action: (formData: FormData) => Promise<void>;
  hidden: Record<string, string>;
  label: string;
  question: string;
  confirmLabel: string;
  tone?: "danger" | "neutral";
}) {
  return (
    <details className="group">
      <summary
        className={`inline-flex cursor-pointer list-none items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
          tone === "danger"
            ? "text-red-700 hover:bg-red-50"
            : "text-muted hover:bg-surface hover:text-ink"
        }`}
      >
        {label}
      </summary>
      <form
        action={action}
        className="mt-3 rounded-card border border-red-200 bg-red-50 p-4"
      >
        {Object.entries(hidden).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
        <p className="text-sm leading-6 text-red-900">{question}</p>
        <div className="mt-3">
          <SubmitButton variant="danger" pendingText="Procesando…">
            {confirmLabel}
          </SubmitButton>
        </div>
      </form>
    </details>
  );
}

/** Aviso de exito o de error arriba del contenido. */
export function Notice({
  tone,
  children,
}: {
  tone: "success" | "error" | "info";
  children: ReactNode;
}) {
  const styles = {
    success: "border-green-200 bg-green-50 text-green-900",
    error: "border-red-200 bg-red-50 text-red-900",
    info: "border-brand-100 bg-brand-50 text-brand-900",
  }[tone];
  const icon = { success: "✓", error: "!", info: "i" }[tone];
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-card border p-4 text-sm leading-6 ${styles}`}
    >
      <span
        className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/80 text-xs font-bold"
        aria-hidden="true"
      >
        {icon}
      </span>
      <div>{children}</div>
    </div>
  );
}
