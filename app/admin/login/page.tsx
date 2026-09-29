import Link from "next/link";
import { loginAction } from "./actions";
import { hasAdminConfiguration } from "@/lib/env";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const configured = hasAdminConfiguration;

  return (
    <main className="grid min-h-screen place-items-center bg-surface px-5 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          <span aria-hidden="true">&larr;</span>
          Volver al sitio
        </Link>

        <div className="mt-5 rounded-panel border border-line bg-white p-8 shadow-card sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
            Parroquia de la Inmaculada Concepción
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink">
            Administración
          </h1>
          <p className="mt-3 leading-7 text-muted">
            Ingrese con la cuenta de administración de la parroquia.
          </p>

          {!configured ? (
            <p
              role="status"
              className="mt-7 rounded-card border border-line bg-surface p-4 text-sm leading-6 text-ink"
            >
              Configure DATABASE_URL y AUTH_SECRET para habilitar la
              administración. Consulte README.md para los pasos de instalación.
            </p>
          ) : (
            <>
              {error && (
                <p
                  role="alert"
                  className="mt-7 rounded-card border border-red-200 bg-red-50 p-3.5 text-sm leading-6 text-red-800"
                >
                  {error === "missing"
                    ? "Complete el correo y la contraseña."
                    : "No se pudo iniciar sesión. Revise sus datos e intente de nuevo."}
                </p>
              )}

              <form action={loginAction} className="mt-7 space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-ink"
                  >
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    required
                    className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none transition-colors focus:border-brand-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-ink"
                  >
                    Contraseña
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none transition-colors focus:border-brand-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
                >
                  Ingresar
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
