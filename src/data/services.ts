export interface Subservice {
  id: string;
  title: string;
}

export interface ServiceItem {
  id: string;
  orderNumber: string; // "01", "02", etc.
  title: string;
  description: string;
  subservices: Subservice[];
  technicalSpecs: string[];
}

export const servicesData: ServiceItem[] = [
  {
    id: "visualizacion-arquitectonica",
    orderNumber: "01",
    title: "Visualización Arquitectónica & Renders",
    description:
      "Creación de imágenes fotorrealistas de alta calidad que comunican la esencia, materialidad y atmósfera de cada proyecto arquitectónico.",
    subservices: [
      { id: "renders-exteriores", title: "Renders Exteriores e Inserción Urbana" },
      { id: "renders-interiores", title: "Renders Interiores y Atmósferas de Iluminación" },
      { id: "recorridos-3d", title: "Animaciones y Recorridos 3D" },
      { id: "fotomontajes", title: "Fotomontajes y Renders de Anteproyecto" },
    ],
    technicalSpecs: [
      "3ds Max + Corona Renderer / V-Ray",
      "Flujo de color ACEScg de rango dinámico completo",
      "Texturizado PBR 4K/8K y vegetación de alta densidad",
      "Postproducción editorial en Adobe Photoshop & Camera Raw",
    ],
  },
  {
    id: "modelado-3d-bim",
    orderNumber: "02",
    title: "Modelado 3D BIM",
    description:
      "Estudio detallado de volumetrías, análisis de asoleamiento y documentación técnica integral utilizando metodologías BIM.",
    subservices: [
      { id: "modelado-revit-archicad", title: "Modelado Paramétrico en Revit y Archicad" },
      { id: "documentacion-ejecutiva", title: "Extracción de Planimetría y Documentación" },
      { id: "coordinacion-volumetrica", title: "Detección de Interferencias y Estudios de Masa" },
    ],
    technicalSpecs: [
      "Autodesk Revit / Graphisoft Archicad / Rhinoceros",
      "Interoperabilidad abierta mediante estándar IFC",
      "Estandarización de capas, niveles de detalle (LOD) y filtros gráficos",
      "Coordinación geométrica entre arquitectura, estructura e instalaciones",
    ],
  },
  {
    id: "desarrollo-anteproyecto",
    orderNumber: "03",
    title: "Desarrollo de Anteproyecto",
    description:
      "Diseño conceptual desde cero, exploración de alternativas de distribución espacial y planimetría inicial.",
    subservices: [
      { id: "croquis-distribucion", title: "Plantas de Distribución y Zonificación" },
      { id: "estudio-normativo", title: "Estudio de Códigos Urbanísticos y Morfología" },
      { id: "maqueta-volumetrica", title: "Esquemas Conceptuales 3D de Propuesta" },
    ],
    technicalSpecs: [
      "Relevamiento dimensional y análisis solar del sitio",
      "Iteración de variantes distributivas en 2D y 3D",
      "Coordinación temprana de criterio estructural y constructivo",
      "Presentación editorial clara para toma de decisiones",
    ],
  },
  {
    id: "diseno-interiores",
    orderNumber: "04",
    title: "Diseño de Interiores",
    description:
      "Definición minuciosa de materialidad, esquemas de iluminación y selección de mobiliario para espacios funcionales y estéticos.",
    subservices: [
      { id: "paleta-materiales", title: "Moodboards y Selección de Materiales" },
      { id: "diseno-mobiliario", title: "Detalle de Muebles a Medida y Carpinterías" },
      { id: "estudio-iluminacion", title: "Proyecto Lumínico y Escenas de Luz" },
    ],
    technicalSpecs: [
      "Modelado detallado de interiores y mobiliario",
      "Simulación lumínica de luz cálida, neutra y acentos puntuales",
      "Documentación ejecutiva para gremios y proveedores",
      "Visualización 3D previa a la ejecución en obra",
    ],
  },
  {
    id: "asistencia-freelance",
    orderNumber: "05",
    title: "Asistencia Freelance a Estudios",
    description:
      "Apoyo técnico externo a estudios de arquitectura en fases de diseño, documentación visual y representación 3D.",
    subservices: [
      { id: "soporte-entrega", title: "Refuerzo para Concursos y Entregas Urgentes" },
      { id: "postproduccion-planos", title: "Planimetría Comercial y Gráfica Editorial" },
      { id: "modelado-complejo", title: "Modelado Digital Asistido" },
    ],
    technicalSpecs: [
      "Adaptación inmediata a estándares CAD/BIM del estudio",
      "Comunicación fluida y entregas iterativas por etapas",
      "Confidencialidad total sobre la documentación del proyecto",
      "Dominio transversal de Revit, Archicad, Rhino, 3ds Max y Suite Adobe",
    ],
  },
];
