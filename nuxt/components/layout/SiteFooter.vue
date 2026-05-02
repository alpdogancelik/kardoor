<script setup lang="ts">
import { computed, reactive } from "vue";

const { isDay } = useShowroomAmbience();

const footerClasses = computed(() => ({
  "kardoor-footer--day": isDay.value
}));

const menuLinks = [
  { label: "Ana Sayfa", to: "/" },
  { label: "Hakkımızda", to: "/hakkimizda" },
  { label: "Ürünler", to: "/urunler" },
  { label: "Kaynaklar", to: "/kaynaklar" },
  { label: "İletişim", to: "/iletisim" }
];

const quickLinks = [
  { label: "Teklif Al", to: "/iletisim" },
  { label: "Kapıları Keşfet", to: "/urunler" },
  { label: "Katalog", to: "/katalog" },
  { label: "Üretim", to: "/uretim" }
];

const buyerTypes = ["Bayi", "Proje", "Son Kullanıcı"];

const contactCards = [
  {
    title: "Telefon",
    description: "Satış ve teklif talepleri için doğrudan iletişim.",
    contactLines: ["+90 552 325", "35 49"],
    href: "tel:+905523253549",
    schedule: [
      { day: "WhatsApp", hour: "Aktif" },
      { day: "Teklif", hour: "Hızlı dönüş" }
    ]
  },
  {
    title: "E-posta",
    description: "Katalog, ürün bilgisi ve proje dosyaları için yazın.",
    contactLines: ["info@kardoor", "celikkapi.com.tr"],
    href: "mailto:info@kardoorcelikkapi.com.tr",
    schedule: [
      { day: "Katalog", hour: "Talep ile" },
      { day: "Dosya", hour: "Paylaşılır" }
    ]
  },
  {
    title: "Adres",
    description: "Turgut Özal Cad. Zafer Mah. No:96, Kaynaklar / Buca / İzmir",
    contactLines: ["Kaynaklar / Buca", "İzmir"],
    href: "https://maps.google.com/?q=Turgut%20%C3%96zal%20Cad.%20Zafer%20Mah.%20No%3A96%20Kaynaklar%20Buca%20%C4%B0zmir",
    schedule: [
      { day: "Konum", hour: "İzmir" },
      { day: "Randevu", hour: "Uygun" }
    ]
  }
];

const workingHours = [
  { day: "Pazartesi", hour: "08:00 - 18:30" },
  { day: "Salı", hour: "08:00 - 18:30" },
  { day: "Çarşamba", hour: "08:00 - 18:30" },
  { day: "Perşembe", hour: "08:00 - 18:30" },
  { day: "Cuma", hour: "08:00 - 18:30" },
  { day: "Cumartesi", hour: "08:00 - 18:30" },
  { day: "Pazar", hour: "08:00 - 18:30" }
];

const quote = reactive({
  buyerType: "Bayi",
  name: "",
  phone: "",
  message: ""
});

const submitQuote = () => {
  const text = [
    "Merhaba Kardoor, teklif almak istiyorum.",
    "",
    `Müşteri profili: ${quote.buyerType}`,
    `Ad Soyad: ${quote.name || "-"}`,
    `Telefon: ${quote.phone || "-"}`,
    `Mesaj: ${quote.message || "-"}`
  ].join("\n");

  window.open(`https://wa.me/905523253549?text=${encodeURIComponent(text)}`, "_blank");
};
</script>

<template>
  <footer class="kardoor-footer" :class="footerClasses">
    <div class="kardoor-footer__inner">
      <section class="kardoor-footer__quote" aria-labelledby="footer-quote-title">
        <div class="kardoor-footer__social" aria-label="Sosyal medya bağlantıları">
          <a href="#" aria-label="Facebook">FB</a>
          <a href="#" aria-label="X">X</a>
          <a href="#" aria-label="Instagram">IG</a>
          <a href="#" aria-label="LinkedIn">IN</a>
        </div>

        <div class="kardoor-footer__quote-panel">
          <h2 id="footer-quote-title">
            Premium Çelik Kapı<br />
            Çözümleri. <em>Teklif alın.</em>
          </h2>

          <form class="footer-quote-form" @submit.prevent="submitQuote">
            <fieldset>
              <legend>Müşteri profilinizi seçin:</legend>

              <div class="footer-quote-form__choices">
                <label v-for="type in buyerTypes" :key="type">
                  <input
                    v-model="quote.buyerType"
                    type="radio"
                    name="buyer-type"
                    :value="type"
                  />
                  <span>{{ type }}</span>
                </label>
              </div>
            </fieldset>

            <div class="footer-quote-form__row">
              <input
                v-model="quote.name"
                type="text"
                name="name"
                placeholder="Ad Soyad"
                aria-label="Ad Soyad"
              />

              <input
                v-model="quote.phone"
                type="tel"
                name="phone"
                placeholder="Telefon numarası"
                aria-label="Telefon numarası"
              />
            </div>

            <div class="footer-quote-form__send">
              <input
                v-model="quote.message"
                type="text"
                name="message"
                placeholder="Mesajınız"
                aria-label="Mesajınız"
              />

              <button type="submit" aria-label="Teklif talebi gönder">
                <span>›</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      <section class="kardoor-footer__directory" aria-label="Footer menüsü">
        <div class="footer-link-group">
          <p>Menü</p>

          <NuxtLink v-for="item in menuLinks" :key="item.label" :to="item.to">
            {{ item.label }}
          </NuxtLink>
        </div>

        <div class="footer-link-group">
          <p>Hızlı Erişim</p>

          <NuxtLink v-for="item in quickLinks" :key="item.label" :to="item.to">
            {{ item.label }}
          </NuxtLink>
        </div>

        <div class="footer-contact-area">
          <p>İletişim Bilgileri</p>

          <div class="footer-contact-grid">
            <article v-for="card in contactCards" :key="card.title">
              <h3>{{ card.title }}</h3>

              <p>{{ card.description }}</p>

              <a
                :href="card.href"
                :target="card.href.startsWith('http') ? '_blank' : undefined"
                :rel="card.href.startsWith('http') ? 'noopener' : undefined"
                class="footer-contact-grid__main"
              >
                <span v-for="line in card.contactLines" :key="line">
                  {{ line }}
                </span>
              </a>

              <dl>
                <div v-for="row in card.schedule" :key="row.day">
                  <dt>{{ row.day }}</dt>
                  <dd>{{ row.hour }}</dd>
                </div>
              </dl>
            </article>
          </div>
        </div>
      </section>

      <section class="kardoor-footer__hours" aria-label="Çalışma saatleri">
        <div>
          <p>Çalışma Saatleri</p>

          <dl>
            <div v-for="item in workingHours" :key="item.day">
              <dt>{{ item.day }}</dt>
              <dd>{{ item.hour }}</dd>
            </div>
          </dl>
        </div>

        <span>Mesai sonrası randevu ile hizmet</span>
      </section>

      <div class="kardoor-footer__bottom">
        <p>
          Tüm hakları saklıdır © 2026<br />
          <strong>Ege Kardoor</strong>
        </p>

        <nav aria-label="Yasal bağlantılar">
          <a href="#">Gizlilik Politikası</a>
          <a href="#">Erişilebilirlik</a>
          <a href="#">Kullanım Koşulları</a>
        </nav>

        <p class="kardoor-footer__credit">Üç Üç Sıfır©</p>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.kardoor-footer {
  --footer-bg: #24262d;
  --footer-bg-deep: #1f2128;
  --footer-text: #f4f2ef;
  --footer-muted: rgba(244, 242, 239, 0.48);
  --footer-line: rgba(244, 242, 239, 0.14);
  --footer-pill: rgba(255, 255, 255, 0.035);
  --footer-field-placeholder: rgba(244, 242, 239, 0.38);
  --footer-field-focus: rgba(244, 242, 239, 0.42);
  --footer-body-text: rgba(244, 242, 239, 0.9);
  --footer-button-bg: #f4f2ef;
  --footer-button-text: #101116;
  --footer-button-bg-hover: #ffffff;
  --footer-social-bg: rgba(255, 255, 255, 0.04);
  --footer-social-bg-hover: rgba(255, 255, 255, 0.08);

  position: relative;
  overflow: hidden;
  color: var(--footer-text);
  background:
    radial-gradient(circle at 72% 18%, rgba(255, 255, 255, 0.045), transparent 31%),
    linear-gradient(180deg, var(--footer-bg) 0%, var(--footer-bg-deep) 100%);
  transition:
    background 0.35s ease,
    color 0.35s ease;

  * {
    box-sizing: border-box;
  }
}

.kardoor-footer__inner {
  width: min(100%, 1840px);
  margin: 0 auto;
  padding: 0 clamp(28px, 2.8vw, 50px) 30px;
}

.kardoor-footer__quote {
  position: relative;
  z-index: 1;
  min-height: clamp(680px, 86svh, 860px);
  display: grid;
  grid-template-columns: minmax(360px, 0.72fr) minmax(620px, 1fr);
  align-items: center;
  gap: clamp(54px, 7vw, 130px);
  padding: clamp(72px, 8vw, 120px) 0 clamp(70px, 7vw, 110px);
}

.kardoor-footer__social {
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
  align-self: center;

  a {
    width: clamp(96px, 6.5vw, 124px);
    height: clamp(96px, 6.5vw, 124px);
    display: grid;
    place-items: center;
    border-radius: 999px;
    color: var(--footer-text);
    background: var(--footer-social-bg);
    text-decoration: none;
    text-transform: uppercase;
    font-size: 22px;
    font-weight: 900;
    letter-spacing: -0.015em;
    transition:
      transform 0.35s ease,
      background 0.35s ease;

    &:hover {
      transform: translateY(-5px);
      background: var(--footer-social-bg-hover);
    }
  }
}

.kardoor-footer__quote-panel {
  width: 100%;
  max-width: 1000px;
  justify-self: end;

  h2 {
    max-width: 1000px;
    margin: 0 0 clamp(48px, 5vw, 76px);
    font-family:
      "PP Editorial New",
      "Instrument Serif",
      "Cormorant Garamond",
      "Times New Roman",
      serif;
    font-size: clamp(4.8rem, 7vw, 8.7rem);
    font-weight: 500;
    line-height: 0.86;
    letter-spacing: -0.058em;
    color: var(--footer-text);

    em {
      font-style: italic;
      font-weight: 400;
      white-space: nowrap;
    }
  }
}

.footer-quote-form {
  width: 100%;

  fieldset {
    margin: 0 0 38px;
    padding: 0;
    border: 0;
  }

  legend {
    margin: 0 0 22px;
    color: var(--footer-muted);
    font-size: 16px;
    font-weight: 800;
    letter-spacing: -0.015em;
  }
}

.footer-quote-form__choices {
  display: flex;
  flex-wrap: wrap;
  gap: 22px 46px;

  label {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    color: var(--footer-text);
    font-size: 21px;
    font-weight: 850;
    letter-spacing: -0.015em;
    cursor: pointer;
  }

  input {
    position: relative;
    width: 32px;
    height: 32px;
    flex: 0 0 32px;
    appearance: none;
    border-radius: 999px;
    border: 1px solid var(--footer-line);
    background: transparent;
    cursor: pointer;

    &::after {
      content: "";
      position: absolute;
      inset: 8px;
      border-radius: inherit;
      background: var(--footer-text);
      opacity: 0;
      transition: opacity 0.25s ease;
    }

    &:checked::after {
      opacity: 1;
    }
  }
}

.footer-quote-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.footer-quote-form__send {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 92px;
  gap: 14px;
  margin-top: 14px;
}

.footer-quote-form input[type="text"],
.footer-quote-form input[type="tel"] {
  width: 100%;
  height: clamp(68px, 4.7vw, 82px);
  border: 1px solid var(--footer-line);
  border-radius: 999px;
  padding: 0 clamp(28px, 3vw, 48px);
  color: var(--footer-text);
  background: transparent;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.015em;
  outline: none;
  transition:
    border-color 0.25s ease,
    background 0.25s ease;

  &::placeholder {
    color: var(--footer-field-placeholder);
  }

  &:focus {
    border-color: var(--footer-field-focus);
    background: var(--footer-pill);
  }
}

.footer-quote-form button {
  width: 92px;
  height: 92px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 999px;
  color: var(--footer-button-text);
  background: var(--footer-button-bg);
  cursor: pointer;
  transition:
    transform 0.35s ease,
    background 0.35s ease;

  span {
    display: block;
    transform: translateY(-3px);
    font-size: 52px;
    font-weight: 300;
    line-height: 1;
  }

  &:hover {
    transform: translateX(5px);
    background: var(--footer-button-bg-hover);
  }
}

.kardoor-footer__directory {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 250px 330px minmax(0, 1fr);
  gap: clamp(44px, 5vw, 86px);
  align-items: start;
  padding: clamp(86px, 9vw, 140px) 0 clamp(78px, 7.5vw, 120px);
}

.footer-link-group {
  min-width: 0;

  p {
    margin: 0 0 52px;
    color: var(--footer-muted);
    font-size: 17px;
    font-weight: 900;
    letter-spacing: -0.012em;
  }

  a {
    display: block;
    width: fit-content;
    color: var(--footer-text);
    text-decoration: none;
    font-size: clamp(2rem, 2.1vw, 2.75rem);
    font-weight: 900;
    line-height: 1.18;
    letter-spacing: -0.024em;
    transition:
      color 0.25s ease,
      transform 0.25s ease;

    & + a {
      margin-top: 17px;
    }

    &:hover {
      color: #40dff5;
      transform: translateX(4px);
    }
  }
}

.footer-contact-area {
  min-width: 0;

  > p {
    margin: 0 0 52px;
    color: var(--footer-muted);
    font-size: 17px;
    font-weight: 900;
    letter-spacing: -0.012em;
  }
}

.footer-contact-grid {
  display: grid;
  grid-template-columns: minmax(180px, 0.9fr) minmax(220px, 1.12fr) minmax(230px, 1.18fr);

  article {
    min-width: 0;
    min-height: 248px;
    padding: 0 clamp(22px, 2vw, 36px);
    border-left: 1px solid var(--footer-line);
  }

  h3 {
    width: fit-content;
    margin: 0 0 24px;
    color: var(--footer-text);
    font-size: clamp(2rem, 2.15vw, 2.85rem);
    font-weight: 900;
    line-height: 0.95;
    letter-spacing: -0.028em;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 6px;
  }

  article > p {
    max-width: 310px;
    min-height: 72px;
    margin: 0 0 28px;
    color: var(--footer-body-text);
    font-size: 16px;
    font-weight: 760;
    line-height: 1.13;
    letter-spacing: -0.01em;
  }
}

.footer-contact-grid__main {
  display: block;
  max-width: 100%;
  margin: 0 0 28px;
  color: var(--footer-text);
  text-decoration: none;
  font-size: clamp(1.25rem, 1.38vw, 1.62rem);
  font-weight: 900;
  line-height: 1.04;
  letter-spacing: -0.018em;

  span {
    display: block;
  }

  &:hover {
    color: #40dff5;
  }
}

.footer-contact-grid dl {
  display: grid;
  gap: 8px;
  margin: 0;

  div {
    display: grid;
    grid-template-columns: minmax(74px, 0.72fr) minmax(0, 1fr);
    gap: 14px;
    align-items: baseline;
  }

  dt,
  dd {
    margin: 0;
    font-size: 15px;
    font-weight: 850;
    line-height: 1.08;
    letter-spacing: -0.012em;
  }

  dt {
    color: var(--footer-muted);
  }

  dd {
    color: var(--footer-text);
  }
}

.kardoor-footer__hours {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 30px;
  align-items: end;
  margin-bottom: 54px;
  padding: 40px 0;
  border-top: 1px solid var(--footer-line);
  border-bottom: 1px solid var(--footer-line);

  p {
    margin: 0 0 28px;
    color: var(--footer-muted);
    font-size: 17px;
    font-weight: 900;
    letter-spacing: -0.012em;
  }

  dl {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 20px;
    margin: 0;
  }

  dt,
  dd {
    margin: 0;
    font-size: 14px;
    font-weight: 850;
    line-height: 1.1;
    letter-spacing: -0.012em;
  }

  dt {
    color: var(--footer-muted);
  }

  dd {
    margin-top: 6px;
    color: var(--footer-text);
  }

  > span {
    display: inline-flex;
    min-height: 48px;
    align-items: center;
    justify-content: center;
    padding: 0 28px;
    border-radius: 999px;
    color: var(--footer-button-text);
    background: var(--footer-button-bg);
    font-size: 13px;
    font-weight: 950;
    letter-spacing: -0.012em;
    white-space: nowrap;
  }
}

.kardoor-footer--day {
  --footer-bg: #f9f6ef;
  --footer-bg-deep: #ebe4d8;
  --footer-text: #10151d;
  --footer-muted: rgba(16, 21, 29, 0.5);
  --footer-line: rgba(16, 21, 29, 0.14);
  --footer-pill: rgba(255, 255, 255, 0.72);
  --footer-field-placeholder: rgba(16, 21, 29, 0.38);
  --footer-field-focus: rgba(16, 21, 29, 0.34);
  --footer-body-text: rgba(16, 21, 29, 0.78);
  --footer-button-bg: #10151d;
  --footer-button-text: #f6f2ea;
  --footer-button-bg-hover: #273040;
  --footer-social-bg: rgba(255, 255, 255, 0.58);
  --footer-social-bg-hover: rgba(255, 255, 255, 0.82);

  background:
    radial-gradient(circle at 72% 18%, rgba(44, 227, 255, 0.09), transparent 32%),
    linear-gradient(180deg, var(--footer-bg) 0%, var(--footer-bg-deep) 100%);
}

.kardoor-footer__bottom {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: end;
  gap: 28px;
  color: var(--footer-text);

  p {
    margin: 0;
    color: var(--footer-muted);
    font-size: 14px;
    font-weight: 850;
    line-height: 1.08;
    letter-spacing: -0.012em;

    strong {
      color: var(--footer-text);
    }
  }

  nav {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 14px;
  }

  a {
    color: var(--footer-text);
    text-decoration: none;
    font-size: 14px;
    font-weight: 850;
    letter-spacing: -0.012em;

    &:hover {
      color: #40dff5;
    }
  }
}

.kardoor-footer__credit {
  justify-self: end;
  color: var(--footer-text) !important;
}

@media (max-width: 1380px) {
  .kardoor-footer__directory {
    grid-template-columns: 220px 270px minmax(0, 1fr);
    gap: 54px;
  }

  .footer-contact-grid {
    grid-template-columns: minmax(170px, 0.92fr) minmax(210px, 1.1fr) minmax(220px, 1.18fr);

    article {
      padding: 0 24px;
    }
  }
}

@media (max-width: 1280px) {
  .kardoor-footer__quote {
    grid-template-columns: 1fr;
    gap: 64px;
    min-height: auto;
  }

  .kardoor-footer__social {
    order: 2;
  }

  .kardoor-footer__quote-panel {
    justify-self: start;
  }

  .kardoor-footer__directory {
    grid-template-columns: 1fr 1fr;
  }

  .footer-contact-area {
    grid-column: 1 / -1;
  }
}

@media (max-width: 980px) {
  .kardoor-footer__inner {
    padding: 0 22px 26px;
  }

  .kardoor-footer__quote {
    padding: 92px 0 86px;
  }

  .kardoor-footer__quote-panel h2 {
    margin-bottom: 56px;
    font-size: clamp(3.7rem, 15vw, 6.4rem);

    em {
      white-space: normal;
    }
  }

  .footer-quote-form__choices {
    gap: 18px 24px;
  }

  .footer-quote-form__row,
  .footer-quote-form__send {
    grid-template-columns: 1fr;
  }

  .footer-quote-form button {
    width: 100%;
    height: 78px;

    span {
      font-size: 46px;
    }
  }

  .kardoor-footer__social {
    gap: 12px;

    a {
      width: 76px;
      height: 76px;
      font-size: 18px;
    }
  }

  .kardoor-footer__directory {
    grid-template-columns: 1fr;
    gap: 58px;
    padding: 82px 0;
  }

  .footer-link-group p,
  .footer-contact-area > p {
    margin-bottom: 30px;
  }

  .footer-contact-grid {
    grid-template-columns: 1fr;
    gap: 34px;

    article {
      min-height: 0;
      padding: 0 0 0 22px;
    }

    article > p {
      min-height: 0;
    }
  }

  .kardoor-footer__hours {
    grid-template-columns: 1fr;
    align-items: start;

    dl {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    > span {
      width: fit-content;
    }
  }

  .kardoor-footer__bottom {
    grid-template-columns: 1fr;
    align-items: start;

    nav {
      justify-content: flex-start;
    }
  }

  .kardoor-footer__credit {
    justify-self: start;
  }
}
</style>
