export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

const messages = {
  es: {
    siteName: "Parroquia de la Inmaculada Concepción",
    home: "Inicio", history: "Historia", videos: "Videos", news: "Noticias y actividades",
    projects: "Proyectos", map: "Ubicación", admin: "Administración",
    welcome: "Bienvenidos a nuestra parroquia",
    intro: "Un espacio de fe, encuentro y servicio para toda la comunidad.",
    mass: "Horarios de misas", services: "Servicios", contact: "Contacto",
    massText: "Consulte los horarios actualizados con la oficina parroquial.",
    servicesText: "Celebraciones, sacramentos y acompañamiento pastoral.",
    contactText: "Escríbanos o visítenos para recibir información.",
    historyIntro: "Conozca nuestra historia y los recuerdos de la comunidad.",
    videosIntro: "Celebraciones y mensajes de nuestra comunidad.",
    newsIntro: "Novedades y próximas actividades parroquiales.",
    projectsIntro: "Iniciativas que construimos juntos.",
    mapIntro: "Encuentre el templo y planifique su visita.",
    current: "Actual", future: "Futuro", viewOnMaps: "Abrir en Google Maps",
    gallery: "Galería", noPhotos: "Pronto compartiremos fotografías de la parroquia.",
    footer: "Comunidad, fe y servicio.",
  },
  en: {
    siteName: "Immaculate Conception Parish",
    home: "Home", history: "History", videos: "Videos", news: "News and events",
    projects: "Projects", map: "Location", admin: "Administration",
    welcome: "Welcome to our parish",
    intro: "A place of faith, fellowship, and service for the whole community.",
    mass: "Mass times", services: "Services", contact: "Contact",
    massText: "Please confirm the latest schedule with the parish office.",
    servicesText: "Celebrations, sacraments, and pastoral care.",
    contactText: "Write to us or visit us for more information.",
    historyIntro: "Discover our history and community memories.",
    videosIntro: "Celebrations and messages from our community.",
    newsIntro: "Parish news and upcoming events.",
    projectsIntro: "Initiatives we build together.",
    mapIntro: "Find the church and plan your visit.",
    current: "Current", future: "Future", viewOnMaps: "Open in Google Maps",
    gallery: "Gallery", noPhotos: "Parish photos will appear here soon.",
    footer: "Community, faith, and service.",
  },
};

export function getMessages(locale: Locale) { return messages[locale]; }
export function localizedPath(locale: Locale, path = "") {
  const suffix = path === "/" ? "" : path;
  return locale === "es" ? suffix || "/" : `/en${suffix}`;
}
