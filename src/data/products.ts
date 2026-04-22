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
    shortDescription:
      "Keskin yüzey oranı ve güçlü kasa formu ile modern mimariye premium giriş etkisi kazandırır.",
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
    shortDescription:
      "Yalın çizgilerle güvenlik katmanını birleştiren, mimari cephelerle uyumlu model.",
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
    shortDescription:
      "Dikey cam yarığı ile girişte prestij etkisini artıran güçlü kasa mimarisi.",
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
    shortDescription:
      "Kasa ve kanatta alüminyum karakteriyle uzun ömürlü dış ortam dayanımı sunar.",
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
    shortDescription:
      "Şehir projelerinde rafine görünüm ve yüksek güvenlik dengesini öne çıkarır.",
    specs: ["96 mm panel", "Çift conta", "Gizli menteşe"],
    materials: ["Alüminyum kanat", "Termal panel", "Inox kol"],
    usageAreas: ["Apartman", "Residence", "Ticari giriş"],
    image: "/images/doors/door-midnight.svg"
  },
  {
    slug: "k1058",
    code: "K1058",
    collection: "Alüminyum Kasa ve Kanat Seri",
    collectionSlug: "aluminyum-kasa-ve-kanat-seri",
    title: "K1058 Dış İklim Modeli",
    shortDescription:
      "Dış ortam koşullarında stabilite ve güvenlik beklentisi yüksek girişler için tasarlanır.",
    specs: ["98 mm panel", "Dış iklim dayanımı", "Yüksek güvenlik kilidi"],
    materials: ["Alüminyum kasa", "Alüminyum kanat", "Kompozit destek"],
    usageAreas: ["Dış iklim", "Villa", "Sahil"],
    image: "/images/doors/door-graphite.svg"
  },
  {
    slug: "k1101",
    code: "K1101",
    collection: "Termo Wood Seri",
    collectionSlug: "termo-wood-seri",
    title: "K1101 Termo Wood Signature",
    shortDescription:
      "Ahşap dokulu yüzeyle sıcak karşılama sunarken çelik güvenlik omurgasını korur.",
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
    shortDescription:
      "Termal performans ve doğal malzeme etkisini üst segment mimariyle buluşturur.",
    specs: ["102 mm panel", "Ses bariyeri", "4 noktalı kilit"],
    materials: ["Termo wood", "Kompozit çekirdek", "Premium tutamak"],
    usageAreas: ["Villa", "Dağ evi", "Lüks konut"],
    image: "/images/doors/door-wood.svg"
  },
  {
    slug: "k1108",
    code: "K1108",
    collection: "Termo Wood Seri",
    collectionSlug: "termo-wood-seri",
    title: "K1108 Sıcak Yüzey Modeli",
    shortDescription:
      "Ahşap karakteri, çelik güvenlik katmanı ve yalıtım odağını tek modelde toplar.",
    specs: ["100 mm panel", "Yalıtım odaklı yapı", "Premium kol seçeneği"],
    materials: ["Termo wood yüzey", "Çelik gövde", "Mat metal aksesuar"],
    usageAreas: ["Villa", "Müstakil konut", "Yazlık"],
    image: "/images/doors/door-wood.svg"
  },
  {
    slug: "k1201",
    code: "K1201",
    collection: "Doğal Taş Seri",
    collectionSlug: "dogal-tas-seri",
    title: "K1201 Stone Signature",
    shortDescription:
      "Doğal taş dokusunu modern güvenlik standartlarıyla birleştiren prestijli model.",
    specs: ["95 mm panel", "Taş efekt katman", "Takviyeli kilit"],
    materials: ["Taş efekt yüzey", "Çelik taşıyıcı", "Titanyum kol"],
    usageAreas: ["Villa", "Prestij proje", "Showroom"],
    image: "/images/doors/door-stone.svg"
  },
  {
    slug: "k1204",
    code: "K1204",
    collection: "Doğal Taş Seri",
    collectionSlug: "dogal-tas-seri",
    title: "K1204 Cephe Uyumlu Taş Model",
    shortDescription:
      "Modern cephelerde doğal taş etkisini güçlü ve güvenli bir giriş objesine dönüştürür.",
    specs: ["96 mm panel", "Taş dokulu yüzey", "Çok noktalı kilit"],
    materials: ["Taş efekt panel", "Çelik gövde", "Satin kol"],
    usageAreas: ["Villa", "Mimari proje", "Prestij giriş"],
    image: "/images/doors/door-stone.svg"
  },
  {
    slug: "k1208",
    code: "K1208",
    collection: "Doğal Taş Seri",
    collectionSlug: "dogal-tas-seri",
    title: "K1208 Prestij Taş Seri",
    shortDescription:
      "Doğal dokulu yüzey ve minimal detaylarla premium giriş algısını güçlendirir.",
    specs: ["98 mm panel", "Güçlü yüzey kaplama", "Yalıtımlı gövde"],
    materials: ["Taş efekt yüzey", "Çelik taşıyıcı", "Premium aksesuar"],
    usageAreas: ["Villa", "Residence", "Prestij proje"],
    image: "/images/doors/door-stone.svg"
  },
  {
    slug: "k1401",
    code: "K1401",
    collection: "Kompozit Seri",
    collectionSlug: "kompozit-seri",
    title: "K1401 Climate Guard",
    shortDescription:
      "Zorlu iklim koşullarında dayanım için geliştirilen kompozit altyapılı premium giriş çözümü.",
    specs: ["104 mm panel", "Su itici katman", "Çok noktalı kilit"],
    materials: ["Kompozit panel", "Çelik altyapı", "Satin kol"],
    usageAreas: ["Dış iklim", "Sahil", "Apartman"],
    image: "/images/doors/door-midnight.svg"
  },
  {
    slug: "k1405",
    code: "K1405",
    collection: "Kompozit Seri",
    collectionSlug: "kompozit-seri",
    title: "K1405 Sahil Dayanım Modeli",
    shortDescription:
      "Nem, güneş ve dış koşullara karşı daha dayanıklı yüzey beklentisi olan alanlar için geliştirilir.",
    specs: ["104 mm panel", "Kompozit yüzey", "Dış iklim direnci"],
    materials: ["Kompozit panel", "Çelik altyapı", "Mat kol"],
    usageAreas: ["Sahil", "Villa", "Dış iklim"],
    image: "/images/doors/door-graphite.svg"
  },
  {
    slug: "k1408",
    code: "K1408",
    collection: "Kompozit Seri",
    collectionSlug: "kompozit-seri",
    title: "K1408 Uzun Ömürlü Kompozit",
    shortDescription:
      "Düşük bakım ihtiyacı ve güçlü yüzey stabilitesiyle yoğun kullanım alanlarına uyum sağlar.",
    specs: ["102 mm panel", "Yüzey stabilitesi", "Çok noktalı kilit"],
    materials: ["Kompozit yüzey", "Çelik gövde", "Satin aksesuar"],
    usageAreas: ["Apartman", "Proje", "Dış iklim"],
    image: "/images/doors/door-midnight.svg"
  },
  {
    slug: "l1001",
    code: "L1001",
    collection: "Laminoks Seri",
    collectionSlug: "laminoks-seri",
    title: "L1001 Laminoks Signature",
    shortDescription:
      "Modern metalik detay algısıyla premium konut girişlerinde güçlü ve zamansız bir duruş sunar.",
    specs: ["96 mm panel", "Laminoks yüzey", "Premium kilit sistemi"],
    materials: ["Laminoks yüzey", "Çelik taşıyıcı", "Inox kol"],
    usageAreas: ["Villa", "Residence", "Premium konut"],
    image: "/images/doors/door-graphite.svg"
  },
  {
    slug: "l1004",
    code: "L1004",
    collection: "Laminoks Seri",
    collectionSlug: "laminoks-seri",
    title: "L1004 Modern Laminoks",
    shortDescription:
      "Sade çizgili metalik yüzey diliyle çağdaş mimari girişlere uyum sağlar.",
    specs: ["95 mm panel", "Metalik yüzey", "Gizli menteşe opsiyonu"],
    materials: ["Laminoks panel", "Çelik gövde", "Satin kol"],
    usageAreas: ["Villa", "Apartman", "Residence"],
    image: "/images/doors/door-metal.svg"
  },
  {
    slug: "l1010",
    code: "L1010",
    collection: "Laminoks Seri",
    collectionSlug: "laminoks-seri",
    title: "L1010 Prestij Laminoks",
    shortDescription:
      "Üst segment girişlerde güvenlik ve prestij etkisini dengeli şekilde öne çıkarır.",
    specs: ["98 mm panel", "Premium yüzey", "Akıllı kilit uyumu"],
    materials: ["Laminoks yüzey", "Çelik omurga", "Premium aksesuar"],
    usageAreas: ["Premium konut", "Residence", "Prestij proje"],
    image: "/images/doors/door-graphite.svg"
  }
];