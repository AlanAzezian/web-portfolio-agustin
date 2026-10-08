export interface Project {
  id: string;
  title: string;
  coverImage: string;
  images: string[];
}

export const projects: Project[] = [
  {
    id: "centro-de-trasbordo-quilmes",
    title: "Centro de Trasbordo — Triángulo de Bernal, Quilmes",
    coverImage: "/projects/projects/centro-de-trasbordo/01-render-exterior.jpg.png",
    images: [
      // 1. RENDERS 3D PRIMERO:
      "/projects/projects/centro-de-trasbordo/01-render-exterior.jpg.png",
      "/projects/projects/centro-de-trasbordo/02-render-hall-escalera.jpg.png",
      "/projects/projects/centro-de-trasbordo/03-render-patio-vidriado.jpg.png",
      "/projects/projects/centro-de-trasbordo/04-render-cafeteria-exterior.jpg.png",
      "/projects/projects/centro-de-trasbordo/05-render-nave-darsena.jpg.png",

      // 2. PLANOS TÉCNICOS AL FINAL:
      "/projects/projects/centro-de-trasbordo/06-plano-planta-baja.jpg.png",
      "/projects/projects/centro-de-trasbordo/07-plano-planta-alta.png.png",
      "/projects/projects/centro-de-trasbordo/08-plano-vistas.jpg.png",
      "/projects/projects/centro-de-trasbordo/09-plano-secciones-cortes.jpg.png",
    ],
  },
];
