/** Mensajes que ve la persona despues de guardar (?ok=) o si algo falla (?error=). */

export const successMessages: Record<string, string> = {
  saved: "Listo, los cambios se guardaron y ya se ven en el sitio.",
  "saved-no-english":
    "Se guardó. La lista de servicios en inglés no tenía la misma cantidad que la de español, así que la página en inglés mostrará los nombres en español. Puede corregirla cuando quiera.",
  restored: "Listo, la página volvió a mostrar el texto original.",
  "photo-added": "La fotografía se agregó a la galería de historia.",
  "photo-removed": "La fotografía se quitó de la galería.",
  "project-created": "El proyecto se publicó en la página de proyectos.",
  "project-saved": "Los cambios del proyecto se guardaron.",
  "project-deleted": "El proyecto se eliminó.",
};

export const errorMessages: Record<string, string> = {
  "section-required":
    "Falta el título o el texto en español. Esos dos campos son obligatorios.",
  "english-incomplete":
    "En la parte en inglés complete los dos campos (título y texto) o deje ambos vacíos.",
  "photo-url":
    "El enlace de la imagen no es válido. Debe empezar con https:// (por ejemplo, https://sitio.com/foto.jpg).",
  "schedule-day":
    "Hay una fila de horarios con horas pero sin el nombre del día. Escriba el día o borre esas horas.",
  "schedule-times":
    "Hay un día sin ninguna hora de misa. Agregue al menos una hora o borre el nombre del día.",
  "schedule-format": "Una de las horas no tiene un formato válido.",
  email:
    "El correo electrónico no parece válido. Revise que tenga @ y un dominio.",
  phone: "El teléfono debe tener al menos 8 dígitos.",
  whatsapp: "El número de WhatsApp debe tener al menos 8 dígitos.",
  "project-required":
    "El proyecto necesita al menos un título y una descripción en español.",
  db: "No se pudo guardar porque la base de datos no respondió. Revise la conexión a internet e intente de nuevo. Si el problema sigue, avise a quien administra el sistema.",
  unknown: "No se reconoció la acción. Recargue la página e intente de nuevo.",
};
