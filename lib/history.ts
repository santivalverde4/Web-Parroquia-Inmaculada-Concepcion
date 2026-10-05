import type { Locale } from "@/lib/i18n";

/**
 * Contenido de la pagina de Historia.
 *
 * Mezcla datos reales tomados de fuentes publicas con textos de relleno:
 * - Real: el censo de 1883 (Archivo Historico Arquidiocesano de San Jose),
 *   la fecha del canton (1848), el templo octagonal para 750 personas y
 *   los iconos de Paula Saenz Soto (Eco Catolico, agosto 2021) y la fiesta
 *   patronal del 8 de diciembre.
 * - PLACEHOLDER: todo lo marcado asi. La fecha de ereccion de la parroquia
 *   no se encontro; se debe confirmar con la parroquia.
 */

type Localized = Record<Locale, string>;

export type HistoryPhoto = {
  src: string;
  width: number;
  height: number;
  alt: Localized;
  caption?: Localized;
};

export const historyTitle: Localized = {
  es: "Nuestra historia",
  en: "Our history",
};

/** Relato principal, un parrafo por elemento. */
export const historyStory: Localized[] = [
  {
    es: "La Concepción nació como uno de los barrios de La Unión de Tres Ríos. En el censo parroquial de 1883 ya aparece con ese nombre, junto a San Diego, Dulce Nombre, San Rafael, San Ramón y San Juan, cuando toda la zona pertenecía a la parroquia de Nuestra Señora del Pilar.",
    en: "La Concepción began as one of the neighborhoods of La Unión de Tres Ríos. The 1883 parish census already lists it by that name, alongside San Diego, Dulce Nombre, San Rafael, San Ramón, and San Juan, when the whole area belonged to the parish of Our Lady of the Pillar.",
  },
  // PLACEHOLDER: origen de la ermita y ereccion de la parroquia.
  {
    es: "Con el crecimiento del pueblo, las familias del barrio levantaron su propia ermita dedicada a la Virgen en su Inmaculada Concepción. Aquella pequeña comunidad de fe creció hasta convertirse en parroquia, que hoy forma parte de la Arquidiócesis de San José.",
    en: "As the town grew, local families built their own chapel dedicated to the Virgin of the Immaculate Conception. That small community of faith grew into a parish, which today belongs to the Archdiocese of San José.",
  },
  {
    es: "En los últimos años la comunidad emprendió la construcción de un nuevo templo de diseño octagonal, con capacidad para 750 personas sentadas y decorado con íconos marianos y eucarísticos de la artista costarricense Paula Sáenz Soto.",
    en: "In recent years the community set out to build a new octagonal church that seats 750 people, decorated with Marian and Eucharistic icons by Costa Rican artist Paula Sáenz Soto.",
  },
];

/** Cifras del templo actual (todas reales). */
export const historyFacts: { value: string; label: Localized }[] = [
  {
    value: "1883",
    label: {
      es: "Primer registro como barrio",
      en: "First record as a neighborhood",
    },
  },
  {
    value: "750",
    label: { es: "Personas sentadas en el templo", en: "Seats in the church" },
  },
  {
    value: "15",
    label: {
      es: "Advocaciones marianas en los vitrales",
      en: "Marian titles in the windows",
    },
  },
  {
    value: "7 m",
    label: {
      es: "Altura de los íconos marianos",
      en: "Height of the Marian icons",
    },
  },
];

export const historyTimeline: {
  when: Localized;
  title: Localized;
  text: Localized;
}[] = [
  {
    when: { es: "1848", en: "1848" },
    title: {
      es: "Nace el cantón de La Unión",
      en: "La Unión becomes a canton",
    },
    text: {
      es: "El 7 de diciembre de 1848 La Unión se declara tercer cantón de la provincia de Cartago.",
      en: "On December 7, 1848, La Unión is declared the third canton of the province of Cartago.",
    },
  },
  {
    when: { es: "1883", en: "1883" },
    title: {
      es: "La Concepción, barrio de La Unión",
      en: "La Concepción, a La Unión neighborhood",
    },
    text: {
      es: "El censo de la parroquia de La Unión registra a La Concepción como uno de sus barrios.",
      en: "The La Unión parish census records La Concepción as one of its neighborhoods.",
    },
  },
  // PLACEHOLDER: confirmar epoca y detalles con la parroquia.
  {
    when: { es: "Siglo XX", en: "20th century" },
    title: { es: "Una comunidad propia", en: "A community of its own" },
    text: {
      es: "La ermita del barrio se convierte en el centro de la vida de fe de Concepción y, con el tiempo, es erigida como parroquia.",
      en: "The neighborhood chapel becomes the heart of faith in Concepción and, in time, is established as a parish.",
    },
  },
  {
    when: { es: "2020", en: "2020" },
    title: {
      es: "Comienza el proyecto de íconos",
      en: "The icon project begins",
    },
    text: {
      es: "La artista Paula Sáenz Soto inicia los íconos del nuevo templo: imágenes marianas de 7 metros de alto e íconos eucarísticos de 2,5 metros.",
      en: "Artist Paula Sáenz Soto begins the icons for the new church: Marian images 7 meters tall and Eucharistic icons of 2.5 meters.",
    },
  },
  {
    when: { es: "2021", en: "2021" },
    title: {
      es: "El nuevo templo toma forma",
      en: "The new church takes shape",
    },
    text: {
      es: "Los vitrales del templo octagonal reciben las imágenes de quince advocaciones de la Virgen, entre ellas Guadalupe, Fátima y la Altagracia.",
      en: "The windows of the octagonal church receive images of fifteen titles of the Virgin, among them Guadalupe, Fátima, and Altagracia.",
    },
  },
  {
    when: { es: "Hoy", en: "Today" },
    title: { es: "Una comunidad viva", en: "A living community" },
    text: {
      es: "Cada 8 de diciembre celebramos nuestra fiesta patronal en honor a la Inmaculada Concepción de María.",
      en: "Every December 8 we celebrate our patronal feast in honor of the Immaculate Conception of Mary.",
    },
  },
];

export const sacredArt = {
  title: {
    es: "Un templo que anuncia la fe",
    en: "A church that proclaims the faith",
  },
  paragraphs: [
    {
      es: "El nuevo templo se pensó como una catequesis en imágenes. Sobre los vitrales se colocaron grandes íconos de la Virgen María en sus distintas advocaciones, acompañados de íconos eucarísticos alrededor del presbiterio.",
      en: "The new church was conceived as catechesis in images. Large icons of the Virgin Mary under her different titles were placed over the windows, with Eucharistic icons around the sanctuary.",
    },
    {
      es: "Las obras son de la artista costarricense de arte sacro Paula Sáenz Soto, quien comenzó el proyecto en 2020.",
      en: "The works are by Costa Rican sacred artist Paula Sáenz Soto, who began the project in 2020.",
    },
  ] as Localized[],
  advocations: [
    { es: "Guadalupe", en: "Guadalupe" },
    { es: "Fátima", en: "Fátima" },
    { es: "Altagracia", en: "Altagracia" },
    { es: "y 12 advocaciones más", en: "and 12 more titles" },
  ] as Localized[],
};

export const coverPhoto: HistoryPhoto = {
  src: "/images/historia/templo-exterior.jpg",
  width: 1476,
  height: 1507,
  alt: {
    es: "Fachada del templo octagonal iluminada de noche, junto a su torre con la cruz",
    en: "The octagonal church lit up at night, next to its bell tower with the cross",
  },
};

export const artPhoto: HistoryPhoto = {
  src: "/images/historia/iconos-marianos.jpg",
  width: 2048,
  height: 1366,
  alt: {
    es: "Interior del templo con los íconos marianos sobre los vitrales durante una misa",
    en: "Inside the church with the Marian icons above the windows during Mass",
  },
};

export const galleryPhotos: HistoryPhoto[] = [
  {
    src: "/images/historia/misa-familias.jpg",
    width: 2048,
    height: 1366,
    alt: {
      es: "Niños y familias alrededor del altar durante la misa",
      en: "Children and families around the altar during Mass",
    },
    caption: { es: "Misa con las familias", en: "Mass with families" },
  },
  {
    src: "/images/historia/incienso.jpg",
    width: 1200,
    height: 1600,
    alt: {
      es: "Sacerdote incensando el altar",
      en: "A priest incensing the altar",
    },
    caption: { es: "Celebración solemne", en: "Solemn celebration" },
  },
  {
    src: "/images/historia/nave-central.jpg",
    width: 1600,
    height: 900,
    alt: {
      es: "Nave central del templo llena de fieles",
      en: "The nave of the church full of worshippers",
    },
    caption: { es: "La nave central", en: "The nave" },
  },
  {
    src: "/images/historia/alabanza.jpg",
    width: 2048,
    height: 1366,
    alt: {
      es: "Jóvenes y monaguillos con las manos en alto durante la alabanza",
      en: "Young people and altar servers raising their hands in praise",
    },
    caption: { es: "Alabanza", en: "Praise" },
  },
  {
    src: "/images/historia/santisimo.jpg",
    width: 1200,
    height: 1600,
    alt: {
      es: "Custodia con el Santísimo junto al crucifijo",
      en: "Monstrance with the Blessed Sacrament beside the crucifix",
    },
    caption: { es: "Adoración al Santísimo", en: "Eucharistic adoration" },
  },
  {
    src: "/images/historia/comunidad.jpg",
    width: 1280,
    height: 960,
    alt: {
      es: "Grupo de la comunidad reunido frente al altar",
      en: "A community group gathered in front of the altar",
    },
    caption: { es: "Nuestra comunidad", en: "Our community" },
  },
  {
    src: "/images/historia/ministerio-musica.jpg",
    width: 1434,
    height: 1080,
    alt: {
      es: "Integrante del ministerio de música cantando con guitarra",
      en: "A music ministry member singing with a guitar",
    },
    caption: { es: "Ministerio de música", en: "Music ministry" },
  },
  {
    src: "/images/historia/altar.jpg",
    width: 1434,
    height: 1080,
    alt: {
      es: "Sacerdote celebrando la misa frente al crucifijo del altar mayor",
      en: "A priest celebrating Mass before the crucifix of the main altar",
    },
    caption: { es: "El altar mayor", en: "The main altar" },
  },
  {
    src: "/images/historia/presbiterio.jpg",
    width: 1600,
    height: 886,
    alt: {
      es: "Vista lateral del presbiterio y los vitrales",
      en: "Side view of the sanctuary and the windows",
    },
    caption: { es: "El presbiterio", en: "The sanctuary" },
  },
  {
    src: "/images/historia/consagracion.jpg",
    width: 1434,
    height: 1080,
    alt: {
      es: "Sacerdote elevando la hostia y el cáliz",
      en: "A priest elevating the host and the chalice",
    },
    caption: { es: "La Eucaristía", en: "The Eucharist" },
  },
];
