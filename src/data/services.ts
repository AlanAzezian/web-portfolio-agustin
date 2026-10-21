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
  orderNumber: string; // "01", "02"
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
        title: "Modelado Blanco (Clay Render)",
        description:
          "Definición de volumetría, proporciones arquitectónicas y validación de encuadres de cámara con el cliente.",
      },
      {
        stepNumber: "PASO 03",
        title: "Materialidad & Iluminación",
        description:
          "Aplicación de texturas físicas realistas, vegetación, equipamiento y estudio lumínico natural y artificial.",
      },
      {
        stepNumber: "PASO 04",
        title: "Render Final & Post-producción",
        description:
          "Ajuste de detalles, ambientación fina, color grading y entrega final en alta resolución.",
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
          "Revisión de documentación base CAD/croquis y definición de estándares LOD y criterios del estudio.",
      },
      {
        stepNumber: "PASO 02",
        title: "Construcción del Modelo",
        description:
          "Modelado paramétrico de elementos arquitectónicos, estructura, niveles y envolventes.",
      },
      {
        stepNumber: "PASO 03",
        title: "Coordinación & Ajustes",
        description:
          "Verificación volumétrica, detección de interferencias espaciales y revisión de cotas.",
      },
      {
        stepNumber: "PASO 04",
        title: "Extracción de Entregables",
        description:
          "Generación de vistas técnicas, cortes axonométricos, planillas y documentación exportable.",
      },
    ],
  },
];
