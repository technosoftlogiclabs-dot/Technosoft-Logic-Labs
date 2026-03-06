export type CubeFace = "front" | "back" | "left" | "right" | "top" | "bottom";

export type TileContent = {
  title: string;
  intro: string;
  bullets: string[];
  ctas: {
    label: string;
    href: string;
  }[];
};

export type TileDefinition = {
  id: string;
  face: CubeFace;
  row: number;
  col: number;
  label: string;
  icon: string;
  themeColor: string;
  content: TileContent;
};

export const tiles: TileDefinition[] = [
  {
    id: "about",
    face: "front",
    row: 1,
    col: 1,
    label: "Despre",
    icon: "◎",
    themeColor: "#38bdf8",
    content: {
      title: "Despre Technosoft Logic Labs",
      intro:
        "Suntem un partener de inginerie software orientat spre produse digitale fiabile, construite pentru scalare și claritate operațională.",
      bullets: [
        "Livrare orientată pe produs, pregătită pentru mediul enterprise",
        "Echipe cross-funcționale: frontend, backend, cloud, QA",
        "Execuție transparentă cu rezultate măsurabile"
      ],
      ctas: [
        { label: "Contact", href: "#contact" },
        { label: "Solicită ofertă", href: "#contact" },
      ]
    }
  },
  {
    id: "services",
    face: "right",
    row: 1,
    col: 1,
    label: "Servicii",
    icon: "▦",
    themeColor: "#22d3ee",
    content: {
      title: "Servicii",
      intro: "Oferim servicii tehnice cap-coadă, de la arhitectură la suport pe termen lung.",
      bullets: [
        "Platforme software personalizate",
        "Aplicații web și portaluri",
        "Automatizare de procese și integrări",
        "Consultanță tehnică și modernizare"
      ],
      ctas: [
        { label: "Contact", href: "#contact" },
        { label: "Solicită ofertă", href: "#contact" },
      ]
    }
  },
  {
    id: "solutions",
    face: "left",
    row: 1,
    col: 1,
    label: "Soluții",
    icon: "◈",
    themeColor: "#60a5fa",
    content: {
      title: "Industrii și Soluții",
      intro: "Echipele noastre adaptează soluții software la constrângerile domeniului, cerințele de conformitate și obiectivele de creștere.",
      bullets: [
        "Management operațional și logistică",
        "Comerț B2B și portaluri pentru clienți",
        "Fluxuri de date, dashboard-uri și raportare",
        "Digitalizarea proceselor interne"
      ],
      ctas: [
        { label: "Contact", href: "#contact" },
        { label: "Solicită ofertă", href: "#contact" },
      ]
    }
  },
  {
    id: "tech-stack",
    face: "top",
    row: 1,
    col: 1,
    label: "Tehnologii",
    icon: "⌘",
    themeColor: "#34d399",
    content: {
      title: "Stack Tehnologic",
      intro: "Construim cu tehnologii fiabile și ușor de mentenanță, aliniate cu scara business-ului și profilul de risc.",
      bullets: [
        "Frontend: React, Next.js, TypeScript",
        "Backend: Node.js, .NET, Python",
        "Cloud: Azure, AWS, Docker, CI/CD",
        "Data: PostgreSQL, SQL Server, Redis"
      ],
      ctas: [
        { label: "Contact", href: "#contact" },
        { label: "Solicită ofertă", href: "#contact" },
      ]
    }
  },
  {
    id: "contact",
    face: "bottom",
    row: 1,
    col: 1,
    label: "Contact",
    icon: "✉",
    themeColor: "#f472b6",
    content: {
      title: "Contact",
      intro: "Spune-ne obiectivele tale și îți propunem un plan clar de livrare, de la idee la producție.",
      bullets: [
        "Email: technosoftlogiclabs@gmail.com",
        "LinkedIn: linkedin.com/company/technosoft-logic-labs",
        "Timp mediu de răspuns: 1 zi lucrătoare"
      ],
      ctas: [
        { label: "Contact", href: "#contact-form" },
        { label: "Solicită ofertă", href: "#contact-form" },
      ]
    }
  },
  {
    id: "portfolio",
    face: "back",
    row: 1,
    col: 1,
    label: "FAQ",
    icon: "🥉",
    themeColor: "#2dd4bf",
    content: {
      title: "🥉 Întrebări frecvente (FAQ)",
      intro: "👉 Răspunzi la fricile lor și elimini obiecțiile înainte de contact. Foarte puternic în vânzare.",
      bullets: [
        "Cât costă? Îți oferim un interval clar de preț după o discuție scurtă, în funcție de obiective și complexitate.",
        "Cât durează? Primești un termen realist și etape de livrare, ca să știi exact când vezi rezultate.",
        "Am nevoie de poze? Nu neapărat. Te ajutăm cu structură, text și direcție vizuală, inclusiv cu materiale stock dacă e nevoie.",
        "Te ocupi tu de tot? Da, putem gestiona cap-coadă: analiză, design, dezvoltare, lansare și suport."
      ],
      ctas: [
        { label: "Contact", href: "#contact" },
        { label: "Solicită ofertă", href: "#contact" },
      ]
    }
  }
];

export const tileById = new Map(tiles.map((tile) => [tile.id, tile]));

export const navToTileId: Record<string, string> = {
  home: "about",
  services: "services",
  "case-studies": "portfolio",
  contact: "contact"
};

export const faceOrientations: Record<CubeFace, [number, number, number]> = {
  front: [-0.730408, 0.614767, 0.241572],
  back: [2.411185, -0.614767, 1.385813],
  left: [1.412509, 0.65419, -2.384489],
  right: [0.268268, -0.65419, 0.757104],
  top: [0.674943, -0.229165, -0.63385],
  bottom: [-1.27395, -0.881041, 1.134615]
};
