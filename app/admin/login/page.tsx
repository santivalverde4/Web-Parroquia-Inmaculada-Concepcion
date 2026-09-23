import Link from "next/link";
import { loginAction } from "./actions";
import { hasAdminConfiguration } from "@/lib/env";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const configured = hasAdminConfiguration;
  return <main className="flex min-h-screen items-center justify-center bg-[#eeeae0] px-5 py-10"><div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-sm sm:p-10">
    <Link href="/" className="text-sm font-semibold text-accent hover:underline">Volver al sitio</Link>
    <p className="mt-9 text-xs font-bold uppercase tracking-[.2em] text-accent">Parroquia de la Inmaculada Concepción</p>
    <h1 className="mt-3 font-serif text-4xl text-ink">Administración</h1>
    <p className="mt-3 leading-7 text-muted">Ingrese con la cuenta de administración de la parroquia.</p>
    {!configured ? <p role="status" className="mt-6 rounded-lg bg-accent-soft p-4 text-sm leading-6 text-ink">Configure DATABASE_URL y AUTH_SECRET para habilitar la administración. Consulte README.md para los pasos de instalación.</p> : <>{error && <p role="alert" className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error === "missing" ? "Complete el correo y la contraseña." : "No se pudo iniciar sesión. Revise sus datos e intente de nuevo."}</p>}
    <form action={loginAction} className="mt-7 space-y-5"><div><label htmlFor="email" className="mb-2 block text-sm font-semibold">Correo electrónico</label><input id="email" name="email" type="email" autoComplete="username" required className="w-full rounded-lg border border-line px-4 py-3 outline-none focus:border-accent" /></div><div><label htmlFor="password" className="mb-2 block text-sm font-semibold">Contraseña</label><input id="password" name="password" type="password" autoComplete="current-password" required className="w-full rounded-lg border border-line px-4 py-3 outline-none focus:border-accent" /></div><button type="submit" className="w-full rounded-full bg-accent px-6 py-3 font-semibold text-white hover:opacity-90">Ingresar</button></form></>}
  </div></main>;
}
