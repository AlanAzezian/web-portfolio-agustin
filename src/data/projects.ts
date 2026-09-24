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
    imageUrl: "https://mir-s3-cdn-cf.behance.net/projects/max_808/3e2842248952259.Y3JvcCwyMDYzLDE2MTMsMTgzLDIyOQ.png",
    link: "https://www.behance.net/agustinfabrizio",
    client: "A4 Red Ferrari",
    year: "2024"
  },
  {
    id: "2",
    title: "Centro de Trasbordo | Taller A77",
    category: "Académico",
    imageUrl: "https://mir-s3-cdn-cf.behance.net/projects/max_808/b9bf89240116059.Y3JvcCwxNjM4LDEyODEsMCww.jpg",
    link: "https://www.behance.net/agustinfabrizio",
    client: "Taller A77",
    year: "2023"
  },
  {
    id: "3",
    title: "L'Avenue | Kuanqa / Engasa",
    category: "Experiencia Laboral",
    imageUrl: "https://mir-s3-cdn-cf.behance.net/projects/max_808/10ff62249433673.Y3JvcCwzODY2LDMwMjQsODYsMA.jpg",
    link: "https://www.behance.net/agustinfabrizio",
    client: "Kuanqa / Engasa",
    year: "2023"
  },
  {
    id: "4",
    title: "Planos Comerciales | Miranda Bosch",
    category: "Comercial",
    imageUrl: "https://mir-s3-cdn-cf.behance.net/projects/max_808/3db5bb232167735.Y3JvcCw2MTQ4LDQ4MDksMjYxNywyMzc0.jpg",
    link: "https://www.behance.net/agustinfabrizio",
    client: "Miranda Bosch",
    year: "2023"
  },
  {
    id: "5",
    title: "Concurso Conjunto 50 Viviendas",
    category: "Concursos",
    imageUrl: "https://mir-s3-cdn-cf.behance.net/projects/max_808/54717f168971547.Y3JvcCwxMTU0LDkwMiw1NDAsNTU0.jpg",
    link: "https://www.behance.net/agustinfabrizio",
    client: "Concurso",
    year: "2024"
  },
  {
    id: "6",
    title: "Frentes para Gastón y Micaela",
    category: "Residencial",
    imageUrl: "https://mir-s3-cdn-cf.behance.net/projects/max_808/f2253b224127831.Y3JvcCwxNjE2LDEyNjQsMCww.png",
    link: "https://www.behance.net/agustinfabrizio",
    client: "Gastón y Micaela",
    year: "2022"
  },
  {
    id: "7",
    title: "BAVSA x RB Espacios",
    category: "Interiores",
    imageUrl: "https://mir-s3-cdn-cf.behance.net/projects/original/ecc1b9191758095.Y3JvcCwyMjk1LDE3OTUsODA2LDM4MA.png",
    link: "https://www.behance.net/agustinfabrizio",
    client: "BAVSA / RB Espacios",
    year: "2022"
  },
  {
    id: "8",
    title: "Acceso PNLQ",
    category: "Diseño Urbano",
    imageUrl: "https://mir-s3-cdn-cf.behance.net/projects/max_808/e60d11252633497.Y3JvcCwyMjUwLDE3NjAsMCww.png",
    link: "https://www.behance.net/agustinfabrizio",
    client: "PNLQ",
    year: "2024"
  }
];
