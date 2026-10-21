export interface Subservice {
  id: string;
  title: string;
}

export interface MethodStep {
  stepNumber: string; // "PASO 01", "PASO 02", etc.
  title: string;
  description: string;
}

export interface DeliverableItem {
  title: string;
  detail: string;
}

export interface ServiceItem {
  id: string;
  orderNumber: string; // "01", "02", etc.
  title: string;
  description: string;
  extendedDescription: string;
  subservices: Subservice[];
  deliverables: DeliverableItem[];
  technicalSpecs: string[];
  methodologyTitle: string;
  methodologySteps: MethodStep[];
}

export const servicesData: ServiceItem[] = [
  {
    id: "visualizacion-arquitectonica",
    orderNumber: "01",
    title: "Visualización Arquitectónica & Renders",
    description:
      "Creación de imágenes fotorrealistas de alta calidad que comunican la esencia, materialidad y atmósfera de cada proyecto arquitectónico.",
    extendedDescription:
      "Desarrollamos piezas gráficas de alto rigor técnico y sensibilidad estética para estudios de arquitectura, desarrolladoras inmobiliarias y concursos. Cada escena se construye estudiando el comportamiento real de la luz natural y artificial, las propiedades físicas de los materiales (PBR) y la composición fotográfica para transmitir la espacialidad antes de su construcción.",
    subservices: [
      { id: "renders-exteriores", title: "Renders Exteriores e Inserción Urbana" },
      { id: "renders-interiores", title: "Renders Interiores y Atmósferas de Iluminación" },
      { id: "recorridos-3d", title: "Animaciones y Recorridos 3D" },
      { id: "fotomontajes", title: "Fotomontajes y Renders de Anteproyecto" },
    ],
    deliverables: [
      {
        title: "Imágenes Estáticas en Alta Resolución (4K / 8K)",
        detail:
          "Archivos TIFF/PNG de 16 bits listos para impresión editorial, paneles de concurso y difusión digital.",
      },
      {
        title: "Estudios de Iluminación Diurna y Nocturna",
        detail:
          "Variantes atmosféricas con control preciso de asoleamiento real según geolocalización y hora del día.",
      },
      {
        title: "Canales de Postproducción (Render Elements)",
        detail:
          "Pases técnicos (Cryptomatte, Reflection, Z-Depth, LightMix) para flexibilidad total en retoque final.",
      },
      {
        title: "Recorridos Virtuales & Animación",
        detail:
          "Secuencias de video en 60 fps y panorámicas 360° interactivas para presentaciones con clientes.",
      },
    ],
    technicalSpecs: [
      "3ds Max + Corona Renderer / V-Ray",
      "Flujo de color ACEScg de rango dinámico completo",
      "Texturizado PBR 4K/8K y vegetación de alta densidad",
      "Postproducción editorial en Adobe Photoshop & Camera Raw",
    ],
    methodologyTitle: "METODOLOGÍA DE VISUALIZACIÓN",
    methodologySteps: [
      {
        stepNumber: "PASO 01",
        title: "Briefing & Conceptualización",
        description:
          "Análisis profundo de los requerimientos, planos base, referencias atmosféricas y el entorno del proyecto.",
      },
      {
        stepNumber: "PASO 02",
        title: "Modelado Blanco",
        description:
          "Definición de volumetría, proporciones arquitectónicas y validación de encuadres de cámara.",
      },
      {
        stepNumber: "PASO 03",
        title: "Materialidad & Iluminación",
        description:
          "Aplicación de texturas realistas y estudio lumínico natural y artificial.",
      },
      {
        stepNumber: "PASO 04",
        title: "Render Final & Post-producción",
        description:
          "Ajuste de detalles, ambientación fina, color grading y entrega en alta resolución.",
      },
    ],
  },
  {
    id: "modelado-3d-bim",
    orderNumber: "02",
    title: "Modelado 3D BIM",
    description:
      "Estudio detallado de volumetrías, análisis de asoleamiento y documentación técnica integral utilizando metodologías BIM.",
    extendedDescription:
      "Implementamos modelos tridimensionales paramétricos e inteligentes que centralizan toda la información geométrica y constructiva de la obra. Ideal para estudios que buscan optimizar tiempos de documentación ejecutiva, coordinar disciplinas, auditar interferencias espaciales y extraer cómputos métricos precisos desde una única fuente de verdad.",
    subservices: [
      { id: "modelado-revit-archicad", title: "Modelado Paramétrico en Revit y Archicad" },
      { id: "documentacion-ejecutiva", title: "Extracción de Planimetría y Documentación" },
      { id: "coordinacion-volumetrica", title: "Detección de Interferencias y Estudios de Masa" },
    ],
    deliverables: [
      {
        title: "Modelo Nativo BIM (RVT / PLN / IFC)",
        detail:
          "Archivo paramétrico estructurado bajo estándares LOD 200 a LOD 350 con familias y plantillas organizadas.",
      },
      {
        title: "Legajo de Planimetría Ejecutiva 2D",
        detail:
          "Plantas, cortes, vistas y detalles constructivos extraídos directamente del modelo y exportados a DWG/PDF.",
      },
      {
        title: "Axonometrías Explotadas & Cortes Fugados",
        detail:
          "Esquemas técnicos tridimensionales de alta legibilidad para memorias descriptivas y presentaciones.",
      },
      {
        title: "Planillas de Cómputo y Superficies",
        detail:
          "Tablas automatizadas de carpinterías, muros, locales y áreas actualizables en tiempo real.",
      },
    ],
    technicalSpecs: [
      "Autodesk Revit / Graphisoft Archicad / Rhinoceros",
      "Interoperabilidad abierta mediante estándar IFC",
      "Estandarización de capas, niveles de detalle (LOD) y filtros gráficos",
      "Coordinación geométrica entre arquitectura, estructura e instalaciones",
    ],
    methodologyTitle: "METODOLOGÍA DE MODELADO BIM",
    methodologySteps: [
      {
        stepNumber: "PASO 01",
        title: "Recepción de Planimetría",
        description:
          "Revisión de documentación base CAD/croquis y definición de estándares LOD requeridos.",
      },
      {
        stepNumber: "PASO 02",
        title: "Construcción del Modelo",
        description:
          "Modelado paramétrico de elementos arquitectónicos, niveles y envolventes.",
      },
      {
        stepNumber: "PASO 03",
        title: "Coordinación & Ajustes",
        description:
          "Verificación volumétrica, detección de interferencias espaciales y cotas.",
      },
      {
        stepNumber: "PASO 04",
        title: "Extracción de Entregables",
        description:
          "Generación de vistas técnicas, cortes axonométricos y documentación exportable.",
      },
    ],
  },
  {
    id: "desarrollo-anteproyecto",
    orderNumber: "03",
    title: "Desarrollo de Anteproyecto",
    description:
      "Diseño conceptual desde cero, exploración de alternativas de distribución espacial y planimetría inicial.",
    extendedDescription:
      "Abordamos las primeras etapas proyectuales transformando el programa de necesidades y las condicionantes del sitio en propuestas arquitectónicas claras, habitables y factibles. Exploramos variantes morfológicas, asoleamiento y relaciones funcionales para consolidar una toma de partido sólida.",
    subservices: [
      { id: "croquis-distribucion", title: "Plantas de Distribución y Zonificación" },
      { id: "estudio-normativo", title: "Estudio de Códigos Urbanísticos y Morfología" },
      { id: "maqueta-volumetrica", title: "Esquemas Conceptuales 3D de Propuesta" },
    ],
    deliverables: [
      {
        title: "Carpeta de Plantas, Cortes y Vistas de Anteproyecto",
        detail:
          "Documentación gráfica escalada y acotada para evaluación funcional y espacial.",
      },
      {
        title: "Esquemas Volumétricos & Diagramas Programáticos",
        detail:
          "Axonometrías conceptuales que explican la implantación, circulaciones y etapas de crecimiento.",
      },
      {
        title: "Análisis de Factibilidad & Indicadores Urbanísticos",
        detail:
          "Verificación de superficies, retiros, alturas máximas y aprovechamiento del lote.",
      },
      {
        title: "Vistas Conceptuales de Atmósfera y Materialidad",
        detail:
          "Previsualizaciones tridimensionales de estudio para validar proporciones e intenciones de diseño.",
      },
    ],
    technicalSpecs: [
      "Relevamiento dimensional y análisis solar del sitio",
      "Iteración de variantes distributivas en 2D y 3D",
      "Coordinación temprana de criterio estructural y constructivo",
      "Presentación editorial clara para toma de decisiones",
    ],
    methodologyTitle: "METODOLOGÍA DE ANTEPROYECTO",
    methodologySteps: [
      {
        stepNumber: "PASO 01",
        title: "Relevamiento & Programa",
        description:
          "Identificación de necesidades funcionales, dimensiones del lote y normativas vigentes.",
      },
      {
        stepNumber: "PASO 02",
        title: "Esquemas de Zonificación",
        description:
          "Exploración de variantes distributivas y relaciones espaciales principales.",
      },
      {
        stepNumber: "PASO 03",
        title: "Definición Morfológica",
        description:
          "Consolidación de la propuesta formal en plantas, cortes y volumetrías 3D.",
      },
      {
        stepNumber: "PASO 04",
        title: "Paquete de Presentación",
        description:
          "Compilación de memoria gráfica y esquemas listos para validación con el cliente.",
      },
    ],
  },
  {
    id: "diseno-interiores",
    orderNumber: "04",
    title: "Diseño de Interiores",
    description:
      "Definición minuciosa de materialidad, esquemas de iluminación y selección de mobiliario para espacios funcionales y estéticos.",
    extendedDescription:
      "Proyectamos la escala próxima de la arquitectura trabajando sobre la experiencia táctil, el confort lumínico y el diseño de equipamiento a medida. Cada intervención interior busca potenciar las cualidades espaciales preexistentes mediante una paleta honesta de materiales y detalles constructivos precisos.",
    subservices: [
      { id: "paleta-materiales", title: "Moodboards y Selección de Materiales" },
      { id: "diseno-mobiliario", title: "Detalle de Muebles a Medida y Carpinterías" },
      { id: "estudio-iluminacion", title: "Proyecto Lumínico y Escenas de Luz" },
    ],
    deliverables: [
      {
        title: "Moodboard & Curaduría de Materiales",
        detail:
          "Definición de revestimientos, maderas, piedras, herrerías y textiles con referencias comerciales.",
      },
      {
        title: "Planos de Layout & Equipamiento Fijo/Móvil",
        detail:
          "Planimetría detallada con dimensionamiento ergonómico y circulaciones interiores.",
      },
      {
        title: "Planos de Detalle de Mobiliario a Medida",
        detail:
          "Despieces técnicos para carpintería, herrería y marmolería listos para cotizar en taller.",
      },
      {
        title: "Esquema de Iluminación & Escenas",
        detail:
          "Planta de cielorrasos, ubicación de bocas, temperaturas de color y artefactos sugeridos.",
      },
    ],
    technicalSpecs: [
      "Modelado detallado de interiores y mobiliario",
      "Simulación lumínica de luz cálida, neutra y acentos puntuales",
      "Documentación ejecutiva para gremios y proveedores",
      "Visualización 3D previa a la ejecución en obra",
    ],
    methodologyTitle: "METODOLOGÍA DE DISEÑO INTERIOR",
    methodologySteps: [
      {
        stepNumber: "PASO 01",
        title: "Moodboard & Estilo",
        description:
          "Definición de atmósfera estética, paleta cromática y sensaciones espaciales deseadas.",
      },
      {
        stepNumber: "PASO 02",
        title: "Distribución & Equipamiento",
        description:
          "Disposición funcional del espacio y dimensionamiento ergonómico del mobiliario.",
      },
      {
        stepNumber: "PASO 03",
        title: "Selección de Materiales",
        description:
          "Curaduría técnica de revestimientos, textiles, maderas y artefactos de iluminación.",
      },
      {
        stepNumber: "PASO 04",
        title: "Especificaciones Técnicas",
        description:
          "Planos de carpinterías a medida y guía de especificaciones para compra e instalación.",
      },
    ],
  },
  {
    id: "asistencia-freelance",
    orderNumber: "05",
    title: "Asistencia Freelance a Estudios",
    description:
      "Apoyo técnico externo a estudios de arquitectura en fases de diseño, documentación visual y representación 3D.",
    extendedDescription:
      "Me integro de manera ágil al flujo de trabajo de estudios de arquitectura para absorber picos de demanda en entregas, concursos nacionales e internacionales o licitaciones. Trabajo respetando los estándares de capas, plantillas y lenguaje gráfico propio de cada oficina.",
    subservices: [
      { id: "soporte-entrega", title: "Refuerzo para Concursos y Entregas Urgentes" },
      { id: "postproduccion-planos", title: "Planimetría Comercial y Gráfica Editorial" },
      { id: "modelado-complejo", title: "Modelado Digital Asistido" },
    ],
    deliverables: [
      {
        title: "Archivos Editables Nativos Ordenados",
        detail:
          "Entrega de modelos 3D, archivos CAD/BIM y PSD con estructura de capas limpia y estandarizada.",
      },
      {
        title: "Gráfica de Concurso & Paneles Editoriales",
        detail:
          "Diagramación de láminas, esquemas axonométricos, cortes fugados y fotomontajes de impacto.",
      },
      {
        title: "Planimetría Comercial & Plantas Ilustradas",
        detail:
          "Postproducción gráfica de plantas y cortes para carpetas de venta y presentaciones institucionales.",
      },
      {
        title: "Soporte por Hitos o Bolsa de Horas",
        detail:
          "Modalidad flexible con entregas parciales auditables según el cronograma del estudio.",
      },
    ],
    technicalSpecs: [
      "Adaptación inmediata a estándares CAD/BIM del estudio",
      "Comunicación fluida y entregas iterativas por etapas",
      "Confidencialidad total sobre la documentación del proyecto",
      "Dominio transversal de Revit, Archicad, Rhino, 3ds Max y Suite Adobe",
    ],
    methodologyTitle: "METODOLOGÍA DE COLABORACIÓN FREELANCE",
    methodologySteps: [
      {
        stepNumber: "PASO 01",
        title: "Alineación de Alcance",
        description:
          "Recepción de archivos de trabajo, criterios del estudio y cronograma de hitos/entregas.",
      },
      {
        stepNumber: "PASO 02",
        title: "Integración de Trabajo",
        description:
          "Desarrollo técnico ágil manteniendo la convención de capas y estándares del estudio.",
      },
      {
        stepNumber: "PASO 03",
        title: "Rondas de Ajuste",
        description:
          "Revisiones intermedias y correcciones rápidas según el feedback del equipo de proyecto.",
      },
      {
        stepNumber: "PASO 04",
        title: "Entrega de Archivos Fuente",
        description:
          "Envío del paquete final ordenado con modelos editables y exports en alta calidad.",
      },
    ],
  },
];
