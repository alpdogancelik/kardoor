<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import { useKardoorLocale } from "~/composables/useKardoorLocale";

const { isDay } = useShowroomAmbience();
const { locale } = useKardoorLocale();

const footerClasses = computed(() => ({
  "kardoor-footer--day": isDay.value
}));

const menuLinks = [
  { label: "Ana Sayfa", to: "/" },
  { label: "Hakkımızda", to: "/company" },
  { label: "Ürünler", to: "/doors" },
  { label: "Kaynaklar", to: "/export" },
  { label: "İletişim", to: "/contact" }
];

const quickLinks = [
  { label: "Teklif Al", to: "/request-quote" },
  { label: "Kapıları Keşfet", to: "/doors" },
  { label: "Katalog", to: "/catalog" },
  { label: "Üretim", to: "/production" }
];

const buyerTypes = ["Bayi", "Proje", "Son Kullanıcı"];

const contactCards = [
  {
    title: "Telefon",
    description: "Satış ve teklif talepleri için doğrudan iletişim.",
    contactLines: ["+90 552 325", "35 49"],
    href: "tel:+905523253549"
  },
  {
    title: "E-posta",
    description: "Katalog, ürün bilgisi ve proje dosyaları için yazın.",
    contactLines: ["info@kardoor", "celikkapi.com.tr"],
    href: "mailto:info@kardoorcelikkapi.com.tr"
  },
  {
    title: "Adres",
    description: "Turgut Özal Cad. Zafer Mah. No:96, Kaynaklar / Buca / İzmir",
    contactLines: ["Kaynaklar / Buca", "İzmir"],
    href: "https://maps.google.com/?q=Turgut%20%C3%96zal%20Cad.%20Zafer%20Mah.%20No%3A96%20Kaynaklar%20Buca%20%C4%B0zmir"
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

const footerCopy = computed(() => {
  if (locale.value === "tr") {
    return {
      socialLabel: "Sosyal medya bağlantıları",
      quoteTitle: "Premium Çelik Kapı",
      quoteLine: "Çözümleri.",
      quoteEmphasis: "Teklif alın.",
      buyerLegend: "Müşteri profilinizi seçin:",
      buyerTypes: ["Bayi", "Proje", "Son Kullanıcı"],
      placeholders: {
        name: "Ad Soyad",
        phone: "Telefon numarası",
        message: "Mesajınız"
      },
      submitLabel: "Teklif talebi gönder",
      directoryLabel: "Footer menüsü",
      menuTitle: "Menü",
      quickTitle: "Hızlı Erişim",
      contactTitle: "İletişim Bilgileri",
      hoursTitle: "Çalışma Saatleri",
      hoursLabel: "Çalışma saatleri",
      mapTitle: "Kardoor konum haritası",
      addressType: "address",
      rights: "Tüm hakları saklıdır",
      legalLabel: "Yasal bağlantılar",
      legal: ["Gizlilik Politikası", "Erişilebilirlik", "Kullanım Koşulları"],
      credit: "Üç Üç Sıfır©",
      whatsappIntro: "Merhaba Kardoor, teklif almak istiyorum.",
      whatsappBuyer: "Müşteri profili",
      whatsappName: "Ad Soyad",
      whatsappPhone: "Telefon",
      whatsappMessage: "Mesaj",
      menuLinks: [
        { label: "Ana Sayfa", to: "/" },
        { label: "Hakkımızda", to: "/company" },
        { label: "Ürünler", to: "/doors" },
        { label: "Kaynaklar", to: "/export" },
        { label: "İletişim", to: "/contact" }
      ],
      quickLinks: [
        { label: "Teklif Al", to: "/request-quote" },
        { label: "Kapıları Keşfet", to: "/doors" },
        { label: "Katalog", to: "/catalog" },
        { label: "Üretim", to: "/production" }
      ],
      contactCards: [
        {
          title: "Telefon",
          description: "Satış ve teklif talepleri için doğrudan iletişim.",
          contactLines: ["+90 552 325", "35 49"],
          href: "tel:+905523253549",
          type: "phone"
        },
        {
          title: "E-posta",
          description: "Katalog, ürün bilgisi ve proje dosyaları için yazın.",
          contactLines: ["info@kardoor", "celikkapi.com.tr"],
          href: "mailto:info@kardoorcelikkapi.com.tr",
          type: "email"
        },
        {
          title: "Adres",
          description: "Turgut Özal Cad. Zafer Mah. No:96, Kaynaklar / Buca / İzmir",
          contactLines: ["Kaynaklar / Buca", "İzmir"],
          href: "https://maps.google.com/?q=Turgut%20%C3%96zal%20Cad.%20Zafer%20Mah.%20No%3A96%20Kaynaklar%20Buca%20%C4%B0zmir",
          type: "address"
        }
      ],
      workingHours: [
        "Pazartesi",
        "Salı",
        "Çarşamba",
        "Perşembe",
        "Cuma",
        "Cumartesi",
        "Pazar"
      ].map((day) => ({ day, hour: "08:00 - 18:30" }))
    };
  }

  return {
    socialLabel: "Social media links",
    quoteTitle: "Premium Steel Door",
    quoteLine: "Solutions.",
    quoteEmphasis: "Request a quote.",
    buyerLegend: "Select your buyer profile:",
    buyerTypes: ["Dealer", "Project", "End user"],
    placeholders: {
      name: "Full name",
      phone: "Phone number",
      message: "Your message"
    },
    submitLabel: "Send quote request",
    directoryLabel: "Footer menu",
    menuTitle: "Menu",
    quickTitle: "Quick Access",
    contactTitle: "Contact Information",
    hoursTitle: "Working Hours",
    hoursLabel: "Working hours",
    mapTitle: "Kardoor location map",
    addressType: "address",
    rights: "All rights reserved",
    legalLabel: "Legal links",
    legal: ["Privacy Policy", "Accessibility", "Terms of Use"],
    credit: "Uc Uc Sifir©",
    whatsappIntro: "Hello Kardoor, I would like to request a quote.",
    whatsappBuyer: "Buyer profile",
    whatsappName: "Full name",
    whatsappPhone: "Phone",
    whatsappMessage: "Message",
    menuLinks: [
      { label: "Home", to: "/" },
      { label: "Company", to: "/company" },
      { label: "Products", to: "/doors" },
      { label: "Resources", to: "/export" },
      { label: "Contact", to: "/contact" }
    ],
    quickLinks: [
      { label: "Request Quote", to: "/request-quote" },
      { label: "Explore Doors", to: "/doors" },
      { label: "Catalogue", to: "/catalog" },
      { label: "Production", to: "/production" }
    ],
    contactCards: [
      {
        title: "Phone",
        description: "Direct contact for sales and quote requests.",
        contactLines: ["+90 552 325", "35 49"],
        href: "tel:+905523253549",
        type: "phone"
      },
      {
        title: "Email",
        description: "Write for catalog, product information and project files.",
        contactLines: ["info@kardoor", "celikkapi.com.tr"],
        href: "mailto:info@kardoorcelikkapi.com.tr",
        type: "email"
      },
      {
        title: "Address",
        description: "Turgut Ozal Cad. Zafer Mah. No:96, Kaynaklar / Buca / Izmir",
        contactLines: ["Kaynaklar / Buca", "Izmir"],
        href: "https://maps.google.com/?q=Turgut%20%C3%96zal%20Cad.%20Zafer%20Mah.%20No%3A96%20Kaynaklar%20Buca%20%C4%B0zmir",
        type: "address"
      }
    ],
    workingHours: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ].map((day) => ({ day, hour: "08:00 - 18:30" }))
  };
});

const quote = reactive({
  buyerType: "Bayi",
  name: "",
  phone: "",
  message: ""
});

watch(
  () => footerCopy.value.buyerTypes,
  (buyerTypes) => {
    quote.buyerType = buyerTypes[0] ?? "";
  },
  { immediate: true }
);

const submitQuote = () => {
  const copy = footerCopy.value;
  const text = [
    copy.whatsappIntro,
    "",
    `${copy.whatsappBuyer}: ${quote.buyerType}`,
    `${copy.whatsappName}: ${quote.name || "-"}`,
    `${copy.whatsappPhone}: ${quote.phone || "-"}`,
    `${copy.whatsappMessage}: ${quote.message || "-"}`
  ].join("\n");

  window.open(`https://wa.me/905523253549?text=${encodeURIComponent(text)}`, "_blank");
};
</script>

<template>
  <footer class="kardoor-footer" :class="footerClasses">
    <div class="kardoor-footer__inner">
      <section class="kardoor-footer__quote" aria-labelledby="footer-quote-title">
        <div class="kardoor-footer__social" :aria-label="footerCopy.socialLabel">
          <a href="#" aria-label="Facebook">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
            </svg>
          </a>
          <a href="#" aria-label="X">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.9 1.15h3.68L14.54 10.3 24 22.85h-7.41l-5.8-7.6-6.64 7.6H.47l8.6-9.86L0 1.15h7.6l5.24 6.94 6.06-6.94Zm-1.29 19.49h2.04L6.5 3.25H4.31l13.3 17.39Z" />
            </svg>
          </a>
          <a href="#" aria-label="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.3-2.8a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z" />
            </svg>
          </a>
          <a href="#" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.61 0 4.27 2.38 4.27 5.46v6.28ZM5.32 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.1 20.45H3.53V9H7.1v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0Z" />
            </svg>
          </a>
        </div>

        <div class="kardoor-footer__quote-panel">
          <h2 id="footer-quote-title">
            {{ footerCopy.quoteTitle }}<br />
            {{ footerCopy.quoteLine }} <em>{{ footerCopy.quoteEmphasis }}</em>
          </h2>

          <form class="footer-quote-form" @submit.prevent="submitQuote">
            <fieldset>
              <legend>{{ footerCopy.buyerLegend }}</legend>

              <div class="footer-quote-form__choices">
                <label v-for="type in footerCopy.buyerTypes" :key="type">
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
                :placeholder="footerCopy.placeholders.name"
                :aria-label="footerCopy.placeholders.name"
              />

              <input
                v-model="quote.phone"
                type="tel"
                name="phone"
                :placeholder="footerCopy.placeholders.phone"
                :aria-label="footerCopy.placeholders.phone"
              />
            </div>

            <div class="footer-quote-form__send">
              <input
                v-model="quote.message"
                type="text"
                name="message"
                :placeholder="footerCopy.placeholders.message"
                :aria-label="footerCopy.placeholders.message"
              />

              <button type="submit" :aria-label="footerCopy.submitLabel">
                <span>›</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      <section class="kardoor-footer__directory" :aria-label="footerCopy.directoryLabel">
        <div class="footer-link-group">
          <p>{{ footerCopy.menuTitle }}</p>

          <NuxtLink v-for="item in footerCopy.menuLinks" :key="item.label" :to="item.to">
            {{ item.label }}
          </NuxtLink>
        </div>

        <div class="footer-link-group">
          <p>{{ footerCopy.quickTitle }}</p>

          <NuxtLink v-for="item in footerCopy.quickLinks" :key="item.label" :to="item.to">
            {{ item.label }}
          </NuxtLink>
        </div>

        <div class="footer-contact-area">
          <p>{{ footerCopy.contactTitle }}</p>

          <div class="footer-contact-grid">
            <article v-for="card in footerCopy.contactCards" :key="card.title">
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

              <iframe
                v-if="card.type === footerCopy.addressType"
                class="footer-contact-grid__map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1315.4510751595906!2d27.22665818355117!3d38.35621307980868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14bbdfce121e182f%3A0x5127d09132566881!2zS2FyZG9vciDDh2VsaWsgS2FwxLEgfCDEsFpNxLBSIERJxZ4gxLBLTMSwTSBLQVBJTEFSSSB8IENBTSBLQVBJIHwgQsSwTkEgR8SwUsSwxZ4gS0FQSUxBUkk!5e0!3m2!1str!2str!4v1778027775096!5m2!1str!2str"
                :title="footerCopy.mapTitle"
                loading="lazy"
                allowfullscreen
                referrerpolicy="no-referrer-when-downgrade"
              />

            </article>
          </div>
        </div>
      </section>

      <section class="kardoor-footer__hours" :aria-label="footerCopy.hoursLabel">
        <div>
          <p>{{ footerCopy.hoursTitle }}</p>

          <dl>
            <div v-for="item in footerCopy.workingHours" :key="item.day">
              <dt>{{ item.day }}</dt>
              <dd>{{ item.hour }}</dd>
            </div>
          </dl>
        </div>

      </section>

      <div class="kardoor-footer__bottom">
        <p>
          {{ footerCopy.rights }} © 2026<br />
          <strong>Ege Kardoor</strong>
        </p>

        <nav :aria-label="footerCopy.legalLabel">
          <a v-for="item in footerCopy.legal" :key="item" href="#">{{ item }}</a>
        </nav>

        <p class="kardoor-footer__credit">{{ footerCopy.credit }}</p>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.kardoor-footer {
  --footer-bg: #14151d;
  --footer-bg-deep: #14151d;
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
  background: var(--footer-bg);
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
    color: var(--social-color, var(--footer-text));
    background:
      radial-gradient(circle at 30% 22%, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.62) 72%),
      var(--footer-social-bg);
    text-decoration: none;
    text-transform: uppercase;
    font-size: 22px;
    font-weight: 900;
    letter-spacing: -0.015em;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.86),
      0 20px 44px rgba(16, 21, 29, 0.06);
    transition:
      transform 0.35s ease,
      background 0.35s ease,
      color 0.35s ease,
      box-shadow 0.35s ease;

    &:nth-child(1) {
      --social-color: #1877f2;
    }

    &:nth-child(2) {
      --social-color: #10151d;
    }

    &:nth-child(3) {
      --social-color: #e4405f;
    }

    &:nth-child(4) {
      --social-color: #0a66c2;
    }

    svg {
      width: clamp(34px, 2.4vw, 44px);
      height: clamp(34px, 2.4vw, 44px);
      display: block;
      fill: currentColor;
    }

    &:hover {
      transform: translateY(-5px);
      color: #ffffff;
      background: var(--social-color);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.28),
        0 24px 54px color-mix(in srgb, var(--social-color), transparent 70%);
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

.footer-contact-grid__map {
  display: block;
  width: 100%;
  height: 230px;
  overflow: hidden;
  border: 1px solid var(--footer-line);
  border-radius: 18px;
  margin-top: 28px;
  background: var(--footer-pill);
}

.kardoor-footer__hours {
  position: relative;
  z-index: 1;
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
}

.kardoor-footer--day {
  --footer-bg: var(--ambience-bg, #f8f6ef);
  --footer-bg-deep: var(--ambience-bg, #f8f6ef);
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

  background: var(--footer-bg);
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
    justify-self: center;
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
    padding: 0 20px 26px;
  }

  .kardoor-footer__quote {
    padding: 98px 0 70px;
  }

  .kardoor-footer__quote-panel,
  .footer-link-group,
  .footer-contact-area,
  .kardoor-footer__hours,
  .kardoor-footer__bottom {
    text-align: center;
  }

  .kardoor-footer__quote-panel h2 {
    margin-right: auto;
    margin-left: auto;
    margin-bottom: 46px;
    font-size: clamp(2.85rem, 11.8vw, 4.8rem);
    line-height: 0.94;
    letter-spacing: -0.035em;

    em {
      white-space: normal;
    }
  }

  .footer-quote-form__choices {
    justify-content: center;
    gap: 14px 22px;

    label {
      font-size: 18px;
    }

    input {
      width: 28px;
      height: 28px;
      flex-basis: 28px;
    }
  }

  .footer-quote-form__row,
  .footer-quote-form__send {
    grid-template-columns: 1fr;
  }

  .footer-quote-form input[type="text"],
  .footer-quote-form input[type="tel"] {
    height: 68px;
    padding-inline: 24px;
    font-size: 16px;
  }

  .footer-quote-form button {
    width: 100%;
    height: 78px;

    span {
      font-size: 46px;
    }
  }

  .kardoor-footer__social {
    display: flex;
    justify-content: center;
    gap: 12px;

    a {
      width: 76px;
      height: 76px;
      font-size: 18px;

      svg {
        width: 30px;
        height: 30px;
      }
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

  .footer-link-group a {
    margin-inline: auto;
    font-size: clamp(1.8rem, 8vw, 2.55rem);
  }

  .footer-contact-grid {
    grid-template-columns: 1fr;
    gap: 30px;

    article {
      min-height: 0;
      padding: 0;
      border-left: 0;
    }

    article > p {
      min-height: 0;
      margin-right: auto;
      margin-left: auto;
    }

    h3 {
      margin-right: auto;
      margin-left: auto;
    }
  }

  .footer-contact-grid__map {
    width: min(100%, 360px);
    height: 240px;
    margin-right: auto;
    margin-left: auto;
  }

  .kardoor-footer__hours dl {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .kardoor-footer__bottom {
    grid-template-columns: 1fr;
    align-items: start;

    nav {
      justify-content: center;
    }
  }

  .kardoor-footer__credit {
    justify-self: center;
  }

  .kardoor-footer__bottom > p:first-child {
    justify-self: center;
  }
}

@media (max-width: 560px) {
  .kardoor-footer__inner {
    padding-inline: 14px;
  }

  .kardoor-footer__quote {
    padding-top: 104px;
  }

  .kardoor-footer__quote-panel h2 {
    max-width: 11ch;
    font-size: clamp(2.55rem, 10.8vw, 3.65rem);
  }

  .footer-quote-form fieldset {
    margin-bottom: 28px;
  }

  .footer-contact-grid h3 {
    font-size: clamp(1.85rem, 8.6vw, 2.35rem);
  }

  .footer-contact-grid__main {
    overflow-wrap: anywhere;
  }

  .kardoor-footer__hours dl {
    gap: 18px 24px;
  }

}
</style>
