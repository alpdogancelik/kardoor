export type Collection = {
  slug: string;
  number: string;
  title: string;
  description: string;
  modelCodes: string[];
  materials: string[];
  accentColor: string;
  image: string;
};

export const collections: Collection[] = [
  {
    slug: "aluminyum-kasa-seri",
    number: "01",
    title: "Alüminyum Kasa Seri",
    description:
      "Modern cephelerde güvenliği saklamadan minimal bir duruş sunan, yüksek dayanımlı giriş serisi.",
    modelCodes: ["K1001", "K1002", "K1004"],
    materials: ["Kasa", "Kanat", "Yüzey", "Kol", "Kilit", "Cam"],
    accentColor: "#2CE3FF",
    image: "/images/doors/door-midnight.svg"
  },
  {
    slug: "aluminyum-kasa-ve-kanat-seri",
    number: "02",
    title: "Alüminyum Kasa ve Kanat Seri",
    description:
      "Kasa ve kanatta alüminyum stabilitesi ile uzun ömürlü dış ortam dayanımını bir araya getirir.",
    modelCodes: ["K1051", "K1054", "K1058"],
    materials: ["Kasa", "Kanat", "Yüzey", "Kol", "Kilit", "Cam"],
    accentColor: "#39DDFD",
    image: "/images/doors/door-graphite.svg"
  },
  {
    slug: "termo-wood-seri",
    number: "03",
    title: "Termo Wood Seri",
    description:
      "Sıcak yüzey diliyle premium konut girişlerine karakter kazandıran, yalıtım odaklı üst segment seri.",
    modelCodes: ["K1101", "K1104", "K1108"],
    materials: ["Kasa", "Kanat", "Yüzey", "Kol", "Kilit", "Cam"],
    accentColor: "#7CEBFF",
    image: "/images/doors/door-wood.svg"
  },
  {
    slug: "dogal-tas-seri",
    number: "04",
    title: "Doğal Taş Seri",
    description:
      "Doğal taş dokusunu modern çelik kapı güvenliğiyle birleştiren prestijli giriş serisi.",
    modelCodes: ["K1201", "K1204", "K1208"],
    materials: ["Kasa", "Kanat", "Yüzey", "Kol", "Kilit", "Cam"],
    accentColor: "#57E2FF",
    image: "/images/doors/door-stone.svg"
  },
  {
    slug: "kompozit-seri",
    number: "05",
    title: "Kompozit Seri",
    description:
      "Sahil ve zorlu dış ortam koşullarında uzun ömür hedefleyen kompozit altyapılı premium çözüm.",
    modelCodes: ["K1401", "K1405", "K1408"],
    materials: ["Kasa", "Kanat", "Yüzey", "Kol", "Kilit", "Cam"],
    accentColor: "#36DEFF",
    image: "/images/doors/door-midnight.svg"
  },
  {
    slug: "laminoks-seri",
    number: "06",
    title: "Laminoks Seri",
    description:
      "Premium konutlarda hem modern hem zamansız bir giriş dili arayanlar için üst segment seri.",
    modelCodes: ["L1001", "L1004", "L1010"],
    materials: ["Kasa", "Kanat", "Yüzey", "Kol", "Kilit", "Cam"],
    accentColor: "#30D5F4",
    image: "/images/doors/door-graphite.svg"
  }
];
