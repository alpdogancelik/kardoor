export type Collection = {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  longDescription: string;
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
    shortTitle: "Alüminyum Kasa",
    description:
      "Modern cephelerde güvenliği saklamadan minimal bir duruş sunan, yüksek dayanımlı giriş serisi.",
    longDescription:
      "Alüminyum kasa yapısı, çelik kapı güvenliğini modern cephe diliyle birleştirir. Villa, apartman ve prestij konut girişlerinde temiz çizgi, yüksek dayanım ve güçlü ilk izlenim için konumlandırılır.",
    modelCodes: ["K1001", "K1002", "K1004"],
    materials: ["Kasa", "Kanat", "Yüzey", "Kol", "Kilit", "Cam"],
    accentColor: "#2CE3FF",
    image: "/images/doors/door-midnight.svg"
  },
  {
    slug: "aluminyum-kasa-ve-kanat-seri",
    number: "02",
    title: "Alüminyum Kasa ve Kanat Seri",
    shortTitle: "Kasa ve Kanat",
    description:
      "Kasa ve kanatta alüminyum stabilitesi ile uzun ömürlü dış ortam dayanımını bir araya getirir.",
    longDescription:
      "Kasa ve kanatta alüminyum karakteri, dış iklim koşullarında form bütünlüğü ve modern görünüm sağlar. Geniş girişlerde, sahil bölgelerinde ve yüksek beklentili konut projelerinde güçlü bir çözüm sunar.",
    modelCodes: ["K1051", "K1054", "K1058"],
    materials: ["Kasa", "Kanat", "Yüzey", "Kol", "Kilit", "Cam"],
    accentColor: "#39DDFD",
    image: "/images/doors/door-graphite.svg"
  },
  {
    slug: "termo-wood-seri",
    number: "03",
    title: "Termo Wood Seri",
    shortTitle: "Termo Wood",
    description:
      "Sıcak yüzey diliyle premium konut girişlerine karakter kazandıran, yalıtım odaklı üst segment seri.",
    longDescription:
      "Termo Wood Seri, doğal ve sıcak yüzey algısını çelik kapı güvenliğiyle bir araya getirir. Özellikle villa, yazlık ve müstakil konut girişlerinde mimari atmosferi güçlendirmek için tasarlanır.",
    modelCodes: ["K1101", "K1104", "K1108"],
    materials: ["Kasa", "Kanat", "Yüzey", "Kol", "Kilit", "Cam"],
    accentColor: "#7CEBFF",
    image: "/images/doors/door-wood.svg"
  },
  {
    slug: "dogal-tas-seri",
    number: "04",
    title: "Doğal Taş Seri",
    shortTitle: "Doğal Taş",
    description:
      "Doğal taş dokusunu modern çelik kapı güvenliğiyle birleştiren prestijli giriş serisi.",
    longDescription:
      "Doğal Taş Seri, kapının yüzeyini mimari cepheyle bütünleştirir. Güçlü güvenlik altyapısını, taş dokusunun prestijli ve kalıcı görünümüyle tamamlar.",
    modelCodes: ["K1201", "K1204", "K1208"],
    materials: ["Kasa", "Kanat", "Yüzey", "Kol", "Kilit", "Cam"],
    accentColor: "#57E2FF",
    image: "/images/doors/door-stone.svg"
  },
  {
    slug: "kompozit-seri",
    number: "05",
    title: "Kompozit Seri",
    shortTitle: "Kompozit",
    description:
      "Sahil ve zorlu dış ortam koşullarında uzun ömür hedefleyen kompozit altyapılı premium çözüm.",
    longDescription:
      "Kompozit Seri, dış iklim etkilerine karşı dayanım hedefleyen yapısıyla sahil, açık cephe ve yüksek nemli bölgeler için güçlü bir alternatiftir. Yüzey stabilitesi ve düşük bakım ihtiyacıyla öne çıkar.",
    modelCodes: ["K1401", "K1405", "K1408"],
    materials: ["Kasa", "Kanat", "Yüzey", "Kol", "Kilit", "Cam"],
    accentColor: "#36DEFF",
    image: "/images/doors/door-midnight.svg"
  },
  {
    slug: "laminoks-seri",
    number: "06",
    title: "Laminoks Seri",
    shortTitle: "Laminoks",
    description:
      "Premium konutlarda hem modern hem zamansız bir giriş dili arayanlar için üst segment seri.",
    longDescription:
      "Laminoks Seri, metalik detay algısı ve zamansız yüzey diliyle prestijli konut girişleri için tasarlanır. Güvenlik omurgasını modern ve güçlü bir görünümle destekler.",
    modelCodes: ["L1001", "L1004", "L1010"],
    materials: ["Kasa", "Kanat", "Yüzey", "Kol", "Kilit", "Cam"],
    accentColor: "#30D5F4",
    image: "/images/doors/door-graphite.svg"
  }
];