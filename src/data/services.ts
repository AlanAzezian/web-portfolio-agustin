export interface Subservice {
  id: string;
  title: string;
}

export interface MethodStep {
  stepNumber: string; // "PASO 01", "PASO 02", etc.
  title: string;
  description: string;
}

export interface ServiceItem {
  id: string;
  orderNumber: string; // "01", "02", etc.
  title: string;
  description: string;
  subservices: Subservice[];
  methodologyTitle: string;
  methodologySteps: MethodStep[];
}

export const servicesData: ServiceItem[] = [
  {
    id: "visualizacion-arquitectonica",
    orderNumber: "01",
    title: "Visualización Arquitectónica & Renders",
    description: "Creación de imágenes fotorrealistas de alta calidad que comunican la esencia, materialidad y atmósfera de cada proyecto arquitectónico.",
    subservices: [
      { id: "renders-exteriores", title: "Renders Exteriores e Inserción Urbana" },
      { id: "renders-interiores", title: "Renders Interiores y Atmósferas de Iluminación" },
      { id: "recorridos-3d", title: "Animaciones y Recorridos 3D" },
      { id: "fotomontajes", title: "Fotomontajes y Renders de Anteproyecto" }
    ],
    methodologyTitle: "METODOLOGÍA DE VISUALIZACIÓN",
    methodologySteps: [
      { stepNumber: "PASO 01", title: "Briefing & Conceptualización", description: "Análisis profundo de los requerimientos, planos base y el entorno del proyecto." },
      { stepNumber: "PASO 02", title: "Modelado Blanco", description: "Definición de volumetría, proporciones arquitectónicas y encuadres de cámara." },
      { stepNumber: "PASO 03", title: "Materialidad & Iluminación", description: "Aplicación de texturas realistas y estudio lumínico natural y artificial." },
      { stepNumber: "PASO 04", title: "Render Final & Post-producción", description: "Ajuste de detalles, ambientación fina, color grading y entrega en alta resolución." }
    ]
  },
  {
    id: "modelado-3d-bim",
    orderNumber: "02",
    title: "Modelado 3D BIM",
    description: "Estudio detallado de volumetrías, análisis de asoleamiento y documentación técnica integral utilizando metodologías BIM.",
    subservices: [
      { id: "modelado-revit-archicad", title: "Modelado Paramétrico en Revit y Archicad" },
      { id: "documentacion-ejecutiva", title: "Extracción de Planimetría y Documentación" },
      { id: "coordinacion-volumetrica", title: "Detección de Interferencias y Estudios de Masa" }
    ],
    methodologyTitle: "METODOLOGÍA DE MODELADO BIM",
    methodologySteps: [
      { stepNumber: "PASO 01", title: "Recepción de Planimetría", description: "Revisión de documentación base CAD/croquis y definición de estándares LOD requeridos." },
      { stepNumber: "PASO 02", title: "Construcción del Modelo", description: "Modelado paramétrico de elementos arquitectónicos, niveles y envolventes." },
      { stepNumber: "PASO 03", title: "Coordinación & Ajustes", description: "Verificación volumétrica, detección de interferencias espaciales y cotas." },
      { stepNumber: "PASO 04", title: "Extracción de Entregables", description: "Generación de vistas técnicas, cortes axonométricos y documentación exportable." }
    ]
  },
  {
    id: "desarrollo-anteproyecto",
    orderNumber: "03",
    title: "Desarrollo de Anteproyecto",
    description: "Diseño conceptual desde cero, exploración de alternativas de distribución espacial y planimetría inicial.",
    subservices: [
      { id: "croquis-distribucion", title: "Plantas de Distribución y Zonificación" },
      { id: "estudio-normativo", title: "Estudio de Códigos Urbanísticos y Morfología" },
      { id: "maqueta-volumetrica", title: "Esquemas Conceptuales 3D de Propuesta" }
    ],
    methodologyTitle: "METODOLOGÍA DE ANTEPROYECTO",
    methodologySteps: [
      { stepNumber: "PASO 01", title: "Relevamiento & Programa", description: "Identificación de necesidades funcionales, dimensiones del lote y normativas vigentes." },
      { stepNumber: "PASO 02", title: "Esquemas de Zonificación", description: "Exploración de variantes distributivas y relaciones espaciales principales." },
      { stepNumber: "PASO 03", title: "Definición Morfológica", description: "Consolidación de la propuesta formal en plantas, cortes y volumetrías 3D." },
      { stepNumber: "PASO 04", title: "Paquete de Presentación", description: "Compilación de memoria gráfica y esquemas listos para validación con el cliente." }
    ]
  },
  {
    id: "diseno-interiores",
    orderNumber: "04",
    title: "Diseño de Interiores",
    description: "Definición minuciosa de materialidad, esquemas de iluminación y selección de mobiliario para espacios funcionales y estéticos.",
    subservices: [
      { id: "paleta-materiales", title: "Moodboards y Selección de Materiales" },
      { id: "diseno-mobiliario", title: "Detalle de Muebles a Medida y Carpinterías" },
      { id: "estudio-iluminacion", title: "Proyecto Lumínico y Escenas de Luz" }
    ],
    methodologyTitle: "METODOLOGÍA DE DISEÑO INTERIOR",
    methodologySteps: [
      { stepNumber: "PASO 01", title: "Moodboard & Estilo", description: "Definición de atmósfera estética, paleta cromática y sensaciones espaciales deseadas." },
      { stepNumber: "PASO 02", title: "Distribución & Equipamiento", description: "Disposición funcional del espacio y dimensionamiento ergonómico del mobiliario." },
      { stepNumber: "PASO 03", title: "Selección de Materiales", description: "Curaduría técnica de revestimientos, textiles, maderas y artefactos de iluminación." },
      { stepNumber: "PASO 04", title: "Especificaciones Técnicas", description: "Planos de carpinterías a medida y guía de especificaciones para compra e instalación." }
    ]
  },
  {
    id: "asistencia-freelance",
    orderNumber: "05",
    title: "Asistencia Freelance a Estudios",
    description: "Apoyo técnico externo a estudios de arquitectura en fases de diseño, documentación visual y representación 3D.",
    subservices: [
      { id: "soporte-entrega", title: "Refuerzo para Concursos y Entregas Urgentes" },
      { id: "postproduccion-planos", title: "Planimetría Comercial y Gráfica Editorial" },
      { id: "modelado-complejo", title: "Modelado Digital Asistido" }
    ],
    methodologyTitle: "METODOLOGÍA DE COLABORACIÓN FREELANCE",
    methodologySteps: [
      { stepNumber: "PASO 01", title: "Alineación de Alcance", description: "Recepción de archivos de trabajo, criterios del estudio y cronograma de hitos/entregas." },
      { stepNumber: "PASO 02", title: "Integración de Trabajo", description: "Desarrollo técnico ágil manteniendo la convención de capas y estándares del estudio." },
      { stepNumber: "PASO 03", title: "Rondas de Ajuste", description: "Revisiones intermedias y correcciones rápidas según el feedback del equipo de proyecto." },
      { stepNumber: "PASO 04", title: "Entrega de Archivos Fuente", description: "Envío del paquete final ordenado con modelos editables y exports en alta calidad." }
    ]
  }
];
