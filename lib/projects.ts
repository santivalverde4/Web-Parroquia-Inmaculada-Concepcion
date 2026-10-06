import type { Locale } from "@/lib/i18n";
import type { PublicProject } from "@/lib/services/content";

/**
 * PLACEHOLDER: proyectos de ejemplo.
 *
 * Se muestran solo mientras no haya ningun proyecto guardado desde el
 * panel. En cuanto se agrega el primero, estos desaparecen.
 */
const examples: {
  id: string;
  status: PublicProject["status"];
  imageUrl: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
}[] = [
  {
    id: "ejemplo-templo",
    status: "ACTUAL",
    imageUrl: "/images/historia/templo-exterior.jpg",
    title: {
      es: "Terminación del nuevo templo",
      en: "Completing the new church",
    },
    description: {
      es: "Seguimos trabajando en los acabados del templo octagonal: piso, cielo raso e iluminación. Cada aporte nos acerca a tener la casa de oración que la comunidad merece.",
      en: "We continue working on the finishes of the octagonal church: flooring, ceiling, and lighting. Every contribution brings us closer to the house of prayer our community deserves.",
    },
  },
  {
    id: "ejemplo-catequesis",
    status: "ACTUAL",
    imageUrl: "/images/historia/misa-familias.jpg",
    title: {
      es: "Catequesis familiar",
      en: "Family catechesis",
    },
    description: {
      es: "Encuentros semanales para niños y sus familias en preparación a la primera comunión y la confirmación.",
      en: "Weekly gatherings for children and their families preparing for First Communion and Confirmation.",
    },
  },
  {
    id: "ejemplo-juvenil",
    status: "ACTUAL",
    imageUrl: "/images/historia/alabanza.jpg",
    title: {
      es: "Pastoral juvenil",
      en: "Youth ministry",
    },
    description: {
      es: "Un grupo que crece cada viernes con música, oración y servicio. Buscamos acompañantes adultos y apoyo para el retiro anual de jóvenes.",
      en: "A group that grows every Friday through music, prayer, and service. We are looking for adult mentors and support for the annual youth retreat.",
    },
  },
  {
    id: "ejemplo-salon",
    status: "FUTURO",
    imageUrl: "/images/historia/comunidad.jpg",
    title: {
      es: "Salón pastoral",
      en: "Pastoral hall",
    },
    description: {
      es: "Un espacio para reuniones de grupos, retiros y actividades comunitarias junto al templo.",
      en: "A space next to the church for group meetings, retreats, and community activities.",
    },
  },
  {
    id: "ejemplo-adoracion",
    status: "FUTURO",
    imageUrl: "/images/historia/santisimo.jpg",
    title: {
      es: "Capilla de adoración",
      en: "Adoration chapel",
    },
    description: {
      es: "Un espacio silencioso y abierto durante el día para orar ante el Santísimo, con entrada independiente del templo.",
      en: "A quiet space open during the day to pray before the Blessed Sacrament, with its own entrance separate from the church.",
    },
  },
];

export function getExampleProjects(locale: Locale): PublicProject[] {
  return examples.map((project) => ({
    id: project.id,
    status: project.status,
    imageUrl: project.imageUrl,
    title: project.title[locale],
    description: project.description[locale],
  }));
}
