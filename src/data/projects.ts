export interface Project {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  link: string;
  client?: string;
  year?: string;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "Utopía Productiva | A4 Red Ferrari",
    category: "Académico",
    imageUrl: "/projects/utopia.png",
    link: "https://www.behance.net/agustinfabrizio",
    client: "A4 Red Ferrari",
    year: "2024"
  },
  {
    id: "2",
    title: "Centro de Trasbordo | Taller A77",
    category: "Académico",
    imageUrl: "/projects/transbordo.jpg",
    link: "https://www.behance.net/agustinfabrizio",
    client: "Taller A77",
    year: "2023"
  },
  {
    id: "3",
    title: "L'Avenue | Kuanqa / Engasa",
    category: "Experiencia Laboral",
    imageUrl: "/projects/lavenue.jpg",
    link: "https://www.behance.net/agustinfabrizio",
    client: "Kuanqa / Engasa",
    year: "2023"
  },
  {
    id: "4",
    title: "Planos Comerciales | Miranda Bosch",
    category: "Comercial",
    imageUrl: "/projects/miranda-bosch.jpg",
    link: "https://www.behance.net/agustinfabrizio",
    client: "Miranda Bosch",
    year: "2023"
  },
  {
    id: "5",
    title: "Concurso Conjunto 50 Viviendas",
    category: "Concursos",
    imageUrl: "/projects/50-viviendas.jpg",
    link: "https://www.behance.net/agustinfabrizio",
    client: "Concurso",
    year: "2024"
  },
  {
    id: "6",
    title: "Frentes para Gastón y Micaela",
    category: "Residencial",
    imageUrl: "/projects/frentes.png",
    link: "https://www.behance.net/agustinfabrizio",
    client: "Gastón y Micaela",
    year: "2022"
  },
  {
    id: "7",
    title: "BAVSA x RB Espacios",
    category: "Interiores",
    imageUrl: "/projects/bavsa.png",
    link: "https://www.behance.net/agustinfabrizio",
    client: "BAVSA / RB Espacios",
    year: "2022"
  },
  {
    id: "8",
    title: "Acceso PNLQ",
    category: "Diseño Urbano",
    imageUrl: "/projects/acceso-pnlq.png",
    link: "https://www.behance.net/agustinfabrizio",
    client: "PNLQ",
    year: "2024"
  }
];
