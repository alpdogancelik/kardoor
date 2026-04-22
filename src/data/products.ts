export type Product = {
  slug: string;
  name: string;
  collection: string;
  description: string;
  image: string;
  gallery: string[];
  specs: {
    panelThickness: string;
    lockSystem: string;
    insulation: string;
    hinge: string;
    coating: string;
  };
  surfaces: string[];
  usageAreas: string[];
};

export const products: Product[] = [
  {
    slug: "laminoks-1001",
    name: "Laminoks 1001",
    collection: "Laminoks",
    description:
      "Ahşap dokusunu modern çelik güvenliğiyle birleştiren, villa girişleri için geliştirilmiş premium model.",
    image:
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1400&q=80"
    ],
    specs: {
      panelThickness: "95 mm",
      lockSystem: "3 noktalı merkezi kilit + akıllı silindir",
      insulation: "Yuksek yogunluklu poliuretan dolgu",
      hinge: "3D ayarlanabilir gizli menteşe",
      coating: "UV dayanimli laminoks kaplama"
    },
    surfaces: ["Antrasit Mat", "Koyu Ceviz", "Bronz Metalik"],
    usageAreas: ["Villa girisleri", "Müstakil konutlar", "Premium site girisleri"]
  },
  {
    slug: "alm-1001",
    name: "ALM 1001",
    collection: "Aluminyum Seri",
    description:
      "Keskin hatlara sahip minimal tasarim, dis cephe mimarisiyle uyumlu aluminyum detaylarla tamamlandi.",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1604014237744-f9f4972f3326?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1400&q=80"
    ],
    specs: {
      panelThickness: "90 mm",
      lockSystem: "Celik guclendirmeli multipoint kilit",
      insulation: "Termal kopru destekli cift yalitim",
      hinge: "Tasiyici rulmanli premium menteşe",
      coating: "Elektrostatik toz boya"
    },
    surfaces: ["Titanyum Gri", "Siyah Saten", "Champagne"],
    usageAreas: ["Residence girisleri", "Modern konut projeleri", "Ofis girisleri"]
  },
  {
    slug: "alm-1002",
    name: "ALM 1002",
    collection: "Aluminyum Seri",
    description:
      "Dikey cam detayli, prestij projeleri icin guvenlik ve estetik dengesini one cikaran ust segment model.",
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1604014237744-f9f4972f3326?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1400&q=80"
    ],
    specs: {
      panelThickness: "92 mm",
      lockSystem: "4 nokta emniyet kilit sistemi",
      insulation: "Cift katmanli isi + ses bariyeri",
      hinge: "Gizli pivot sistem",
      coating: "Nano seramik yuzey koruma"
    },
    surfaces: ["Gece Siyahi", "Metalik Antrasit", "Acilik Alu"],
    usageAreas: ["Villa kapilari", "Ikiz villa projeleri", "Mimari vitrin cephesi"]
  },
  {
    slug: "komp-3001",
    name: "KOMP 3001",
    collection: "Kompozit Seri",
    description:
      "Yuksek dayanimli kompozit panel ile iklim kosullarina direncli, uzun omurlu giris kapisi cozumudur.",
    image:
      "https://images.unsplash.com/photo-1600047509782-20d39509f26d?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600047509782-20d39509f26d?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1613977257592-487ecd136cc3?auto=format&fit=crop&w=1400&q=80"
    ],
    specs: {
      panelThickness: "100 mm",
      lockSystem: "Takviyeli merkezi kilit + gece mandali",
      insulation: "Kompozit cekirdek + elastomer fitil",
      hinge: "Yuksek tasima kapasiteli 3 eksen menteşe",
      coating: "Su itici kompozit yuzey"
    },
    surfaces: ["Grafit", "Duman Mesesi", "Stone Grey"],
    usageAreas: ["Sahil bolgesi konutlari", "Sert iklim kosullari", "Yuksek kullanimli girisler"]
  },
  {
    slug: "mtl-1001",
    name: "MTL 1001",
    collection: "Proje Kapilari",
    description:
      "Toplu konut ve ticari projeler icin standartlastirilmis guvenlik, hizli uretim ve kurulum avantaji.",
    image:
      "https://images.unsplash.com/photo-1600566752227-8f3b5f7f2f4d?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600566752227-8f3b5f7f2f4d?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80"
    ],
    specs: {
      panelThickness: "88 mm",
      lockSystem: "EN normlarina uyumlu merkezi sistem",
      insulation: "Tas yunu + kompozit dolgu",
      hinge: "Endustriyel guclendirmeli menteşe",
      coating: "Cizilmeye dayanikli endustriyel boya"
    },
    surfaces: ["Acik Gri", "Mat Siyah", "Beyaz"],
    usageAreas: ["Toplu konut", "Kamu projeleri", "Ticari bina girisleri"]
  }
];
