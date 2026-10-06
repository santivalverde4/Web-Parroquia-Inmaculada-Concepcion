/** Pestanas del panel, en el orden en que aparecen. */
export const adminTabs = [
  {
    id: "inicio",
    label: "Portada",
    summary: "Texto de bienvenida",
    title: "Texto de la portada",
    description:
      "Es el título y el párrafo de bienvenida que aparecen en la página de inicio, en el bloque de información general.",
    where: { href: "/", label: "Página de inicio" },
  },
  {
    id: "horarios",
    label: "Horarios y servicios",
    summary: "Misas, sacramentos y oficina",
    title: "Horarios y servicios",
    description:
      "Los horarios de misa, la lista de servicios y el horario de la oficina parroquial que se muestran en la página de inicio.",
    where: { href: "/", label: "Página de inicio" },
  },
  {
    id: "contacto",
    label: "Contacto",
    summary: "Teléfono, WhatsApp y dirección",
    title: "Datos de contacto",
    description:
      "Aparecen en el pie de todas las páginas del sitio. Los campos vacíos no se muestran.",
    where: { href: "/", label: "Pie de página" },
  },
  {
    id: "historia",
    label: "Historia",
    summary: "Relato y fotografías",
    title: "Historia de la parroquia",
    description:
      "El relato principal de la página de historia y las fotografías que se agregan a su galería.",
    where: { href: "/historia", label: "Página de historia" },
  },
  {
    id: "proyectos",
    label: "Proyectos",
    summary: "Obras en marcha y futuras",
    title: "Proyectos",
    description:
      "Las iniciativas de la comunidad. Cada proyecto puede estar en marcha o ser un plan para el futuro.",
    where: { href: "/proyectos", label: "Página de proyectos" },
  },
] as const;

export type AdminTab = (typeof adminTabs)[number]["id"];

export function isAdminTab(value: string | undefined): value is AdminTab {
  return adminTabs.some((tab) => tab.id === value);
}

/** Filas y horas por fila del formulario de horarios de misa. */
export const SCHEDULE_ROWS = 5;
export const TIMES_PER_ROW = 4;
