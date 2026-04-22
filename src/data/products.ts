export type Product = {
  slug: string;
  code: string;
  collection: string;
  collectionSlug: string;
  title: string;
  shortDescription: string;
  specs: string[];
  materials: string[];
  usageAreas: string[];
  image: string;
};

export const products: Product[] = [
  {
    slug: "k1001",
    code: "K1001",
    collection: "Alüminyum Kasa Seri",
    collectionSlug: "aluminyum-kasa-seri",
    title: "K1001 Premium Giriş Kapısı",
    shortDescription: "Keskin yüzey oranı ve güçlü kasa formu ile modern mimariye premium giriş etkisi kazandırır.",
    specs: ["95 mm panel", "3 noktalı kilit", "Termal yalıtım"],
    materials: ["Alüminyum kasa", "Çelik kanat", "Satin metal kol"],
    usageAreas: ["Villa", "Premium konut", "Residence"],
    image: "/images/doors/door-midnight.svg"
  },
  {
    slug: "k1002",
    code: "K1002",
    collection: "Alüminyum Kasa Seri",
    collectionSlug: "aluminyum-kasa-seri",
    title: "K1002 Minimal Seri",
    shortDescription: "Yalın çizgilerle güvenlik katmanını birleştiren, mimari cephelerle uyumlu model.",
    specs: ["92 mm panel", "Multipoint sistem", "Akustik kesim"],
    materials: ["Alüminyum profil", "Kompozit destek", "Titanyum kol"],
    usageAreas: ["Villa", "Apartman", "Proje"],
    image: "/images/doors/door-graphite.svg"
  },
  {
    slug: "k1004",
    code: "K1004",
    collection: "Alüminyum Kasa Seri",
    collectionSlug: "aluminyum-kasa-seri",
    title: "K1004 Cam Detaylı",
    shortDescription: "Dikey cam yarığı ile girişte prestij etkisini artıran güçlü kasa mimarisi.",
    specs: ["90 mm panel", "4 noktalı kilit", "Temperli cam opsiyonu"],
    materials: ["Alüminyum kasa", "Temperli cam", "Paslanmaz kol"],
    usageAreas: ["Villa", "Mimari konut", "Giriş holü"],
    image: "/images/doors/door-metal.svg"
  },
  {
    slug: "k1051",
    code: "K1051",
    collection: "Alüminyum Kasa ve Kanat Seri",
    collectionSlug: "aluminyum-kasa-ve-kanat-seri",
    title: "K1051 Çift Stabilite",
    shortDescription: "Kasa ve kanatta alüminyum karakteriyle uzun ömürlü dış ortam dayanımı sunar.",
    specs: ["98 mm panel", "Akıllı kilit uyumu", "Dış iklim direnci"],
    materials: ["Alüminyum kasa", "Alüminyum kanat", "Mat siyah kol"],
    usageAreas: ["Villa", "Sahil bölgesi", "Açık iklim"],
    image: "/images/doors/door-graphite.svg"
  },
  {
    slug: "k1054",
    code: "K1054",
    collection: "Alüminyum Kasa ve Kanat Seri",
    collectionSlug: "aluminyum-kasa-ve-kanat-seri",
    title: "K1054 Residence Giriş",
    shortDescription: "Şehir projelerinde rafine görünüm ve yüksek güvenlik dengesini öne çıkarır.",
    specs: ["96 mm panel", "Çift conta", "Gizli menteşe"],
    materials: ["Alüminyum kanat", "Termal panel", "Inox kol"],
    usageAreas: ["Apartman", "Residence", "Ticari giriş"],
    image: "/images/doors/door-midnight.svg"
  },
  {
    slug: "k1101",
    code: "K1101",
    collection: "Termo Wood Seri",
    collectionSlug: "termo-wood-seri",
    title: "K1101 Termo Wood Signature",
    shortDescription: "Ahşap dokulu yüzeyle sıcak karşılama sunarken çelik güvenlik omurgasını korur.",
    specs: ["100 mm termo panel", "3 noktalı kilit", "Yüksek ısı yalıtımı"],
    materials: ["Termo wood yüzey", "Çelik gövde", "Bronz kol"],
    usageAreas: ["Villa", "Müstakil konut", "Yazlık"],
    image: "/images/doors/door-wood.svg"
  },
  {
    slug: "k1104",
    code: "K1104",
    collection: "Termo Wood Seri",
    collectionSlug: "termo-wood-seri",
    title: "K1104 Elite Wood",
    shortDescription: "Termal performans ve doğal malzeme etkisini üst segment mimariyle buluşturur.",
    specs: ["102 mm panel", "Ses bariyeri", "4 noktali kilit"],
    materials: ["Termo wood", "Kompozit çekirdek", "Premium tutamak"],
    usageAreas: ["Villa", "Dağ evi", "Lüks konut"],
    image: "/images/doors/door-wood.svg"
  },
  {
    slug: "k1201",
    code: "K1201",
    collection: "Doğal Taş Seri",
    collectionSlug: "dogal-tas-seri",
    title: "K1201 Stone Signature",
    shortDescription: "Doğal taş dokusunu modern güvenlik standartlarıyla birleştiren prestijli model.",
    specs: ["95 mm panel", "Taş efekt katman", "Takviyeli kilit"],
    materials: ["Taş efekt yüzey", "Çelik taşıyıcı", "Titanyum kol"],
    usageAreas: ["Villa", "Prestij proje", "Showroom"],
    image: "/images/doors/door-stone.svg"
  },
  {
    slug: "k1401",
    code: "K1401",
    collection: "Kompozit Seri",
    collectionSlug: "kompozit-seri",
    title: "K1401 Climate Guard",
    shortDescription: "Zorlu iklim koşullarında dayanım için geliştirilen kompozit altyapılı premium giriş çözümü.",
    specs: ["104 mm panel", "Su itici katman", "Çok noktalı kilit"],
    materials: ["Kompozit panel", "Çelik altyapı", "Satin kol"],
    usageAreas: ["Dış iklim", "Sahil", "Apartman"],
    image: "/images/doors/door-midnight.svg"
  },
  {
    slug: "mtl-1001",
    code: "MTL 1001",
    collection: "Komple Metal Seri",
    collectionSlug: "komple-metal-seri",
    title: "MTL 1001 Project Edition",
    shortDescription: "Yüksek trafik alanları için geliştirilen tam metal karakterli proje kapısı.",
    specs: ["88 mm panel", "Endüstriyel kilit", "Darbe dayanımı"],
    materials: ["Metal kasa", "Metal kanat", "Endüstriyel kol"],
    usageAreas: ["Proje", "Kamu yapısı", "Ticari alan"],
    image: "/images/doors/door-metal.svg"
  }
];
