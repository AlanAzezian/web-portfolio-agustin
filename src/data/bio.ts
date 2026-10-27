export interface EducationItem {
  id: string;
  institution: string;
  detail: string;
  certificateUrl: string | null;
}

export interface WorkAccordionItem {
  id: string;
  orderNumber: string;
  role: string;
  company: string;
  period: string;
  tasks: string[];
  tools?: string[];
  typology?: string;
  projectId?: string;
  gallery?: {
    src: string;
    caption: string;
  }[];
}

export interface ParticipationItem {
  id: string;
  year: string;
  category: string;
  title: string;
  description: string;
  image: string;
  imageCaption: string;
  /** Modalidad 1: Vinculada a un proyecto existente en /proyectos/[id] */
  projectId?: string;
  link?: string;
  /** Modalidad 2: Participación independiente con galería propia exclusiva en Bio */
  gallery?: {
    src: string;
    caption: string;
  }[];
}

export interface SkillCard {
  title: string;
  items: string[];
}

export const BIO_SECTIONS = [
  { id: "sobre-mi", label: "SOBRE MÍ" },
  { id: "experiencia", label: "EXPERIENCIA" },
  { id: "habilidades", label: "HABILIDADES" },
] as const;

export type BioSectionId = (typeof BIO_SECTIONS)[number]["id"];

export const EDUCATION_ITEMS: EducationItem[] = [
  {
    id: "edu-fadu",
    institution: "Facultad de Arquitectura, Diseño y Urbanismo, UBA",
    detail: "2020 - En curso (86%)",
    certificateUrl: null,
  },
  {
    id: "edu-bim",
    institution: "Curso BIM Modeler",
    detail: "2025 - Miller & Co (online)",
    certificateUrl: "https://www.homeofbimcampus.com/certificates/eocr0f5enb",
  },
];

export const WORK_ACCORDION_ITEMS: WorkAccordionItem[] = [
  {
    id: "work-01",
    orderNumber: "01",
    role: "Asistente de Arquitectura",
    company: "ENGAPA (Uru.) | KUAARA (Arg.)",
    period: "2023 - 2025",
    tasks: [
      "Desarrollo de documentación técnica BIM para proyectos de hormigón premoldeado.",
      "Elaboración de planimetrías de taller para fabricación y montaje de piezas de GRC.",
      "Coordinación técnica intersectorial entre ingeniería, fábrica y arquitectura.",
      "Relevamiento dimensional y seguimiento técnico en obra.",
    ],
    tools: ["Revit BIM", "Rhinoceros 7", "AutoCAD", "Detallado GRC"],
    typology:
      "Documentación BIM de premoldeados y planimetrías de taller para piezas GRC.",
  },
  {
    id: "work-02",
    orderNumber: "02",
    role: "Renderista y Delineante",
    company: "Práctica Freelance",
    period: "2021 - Presente",
    tasks: [
      "Modelado 3D de alta precisión y desarrollo de volumetrías arquitectónicas.",
      "Composición de imágenes fotorrealistas exteriores e interiores (D5, Lumion, V-Ray).",
      "Producción de planimetría comercial y gráfica editorial para estudios.",
      "Asesoramiento en diseño espacial, materialidad e iluminación.",
    ],
    tools: ["D5 Render", "Lumion", "V-Ray", "3ds Max", "Photoshop"],
    typology:
      "Visualización arquitectónica fotorrealista y modelado 3D de anteproyectos.",
  },
  {
    id: "work-03",
    orderNumber: "03",
    role: "Diseñador Técnico y Presupuestos",
    company: "Fabrizio Amoblamientos",
    period: "2021 - Presente",
    tasks: [
      "Diseño técnico de equipamiento y mobiliario a medida para obras residenciales y comerciales.",
      "Cómputo de materiales, optimización de cortes y elaboración de presupuestos.",
      "Seguimiento de fabricación en taller y coordinación de montaje.",
      "Relevamiento métrico integral en obra y trato directo con clientes.",
    ],
    tools: ["AutoCAD", "SketchUp", "Cómputo & Presupuestos"],
    typology:
      "Diseño de mobiliario técnico a medida y relevamiento métrico en obra.",
  },
];

export const PARTICIPATION_ITEMS: ParticipationItem[] = [
  {
    id: "comp-01",
    year: "2026",
    category: "MONTAJE EXPOSITIVO (LA BIENAL XX)",
    title: "Maqueta Casa Chacra — BAAG | La Bienal XX",
    description:
      "Colaborador en producción y montaje de maqueta expositiva para el estudio BAAG en la XX Bienal Internacional de Arquitectura de Buenos Aires.",
    image: "/projects/miranda-bosch.jpg",
    imageCaption: "Maqueta Casa Chacra — BAAG | La Bienal XX",
    gallery: [
      {
        src: "/projects/miranda-bosch.jpg",
        caption: "Maqueta Casa Chacra — Vista general de montaje para BAAG",
      },
      {
        src: "/projects/lavenue.jpg",
        caption: "Detalle constructivo y materialidad de maqueta expositiva",
      },
      {
        src: "/projects/bavsa.png",
        caption: "Exposición en La Bienal Internacional de Arquitectura de Buenos Aires",
      },
    ],
  },
  {
    id: "comp-02",
    year: "2026",
    category: "CONCURSO PROVINCIAL (CLAVE 0178)",
    title: "Concurso Provincial Crematorio Parque CEyS",
    description:
      "Colaborador en equipo de proyecto | Clave 0178 — Nueve de Julio, Provincia de Buenos Aires.",
    image: "/projects/utopia.png",
    imageCaption: "Concurso Provincial Crematorio Parque CEyS",
    gallery: [
      {
        src: "/projects/utopia.png",
        caption: "Implantación general y relación paisajística — Clave 0178",
      },
      {
        src: "/projects/frentes.png",
        caption: "Vistas y estudio morfológico del conjunto",
      },
    ],
  },
  {
    id: "comp-03",
    year: "2023",
    category: "CONCURSO DE IDEAS (2° PREMIO)",
    title: "Nuevo Acceso al Parque Natural Laguna de Gómez",
    description:
      "Distinción: 2° Puesto. Concurso de ideas municipal — Junín, Provincia de Buenos Aires.",
    image: "/projects/acceso-pnlq.png",
    imageCaption: "2° Premio — Nuevo Acceso al Parque Natural Laguna de Gómez",
    projectId: "centro-de-trasbordo-1",
    link: "/proyectos/centro-de-trasbordo-1",
  },
  {
    id: "comp-04",
    year: "2023",
    category: "CONCURSO DE VIVIENDA (1° PREMIO)",
    title: "Concurso de Viviendas Colectivas en SteelHouse",
    description:
      "Distinción: 1° Puesto. Concurso interno en Construcciones II (Cátedra Castellano / Patrocinio Tubos Argentinos, FADU-UBA).",
    image: "/projects/50-viviendas.jpg",
    imageCaption: "1° Premio — Concurso de Viviendas Colectivas en SteelHouse",
    projectId: "centro-de-trasbordo-2",
    link: "/proyectos/centro-de-trasbordo-2",
  },
];

export const SKILL_CARDS: SkillCard[] = [
  {
    title: "CAD",
    items: ["SketchUp", "Revit", "AutoCAD"],
  },
  {
    title: "RENDERING",
    items: ["D5 Render", "Lumion", "V-Ray"],
  },
  {
    title: "ADOBE",
    items: ["Illustrator", "Photoshop", "InDesign", "Lightroom"],
  },
  {
    title: "OFFICE",
    items: ["Excel", "Word", "PowerPoint"],
  },
  {
    title: "IDIOMAS",
    items: ["Español (Nativo)", "Inglés (B2)"],
  },
  {
    title: "IA",
    items: ["Google Antigravity"],
  },
];
