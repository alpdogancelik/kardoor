/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        showroom: {
          950: "#05080f",
          900: "#09121d",
          850: "#0f1b2b",
          800: "#132337",
          300: "#95b6c9"
        },
        accent: {
          400: "#2ce3ff",
          500: "#12b7db"
        }
      },
      boxShadow: {
        glow: "0 0 35px rgba(44, 227, 255, 0.2)",
        card: "0 14px 45px rgba(2, 8, 17, 0.4)"
      },
      fontFamily: {
        heading: ["Bebas Neue", "sans-serif"],
        body: ["Space Grotesk", "sans-serif"]
      },
      backgroundImage: {
        noise: "radial-gradient(circle at 20% 10%, rgba(44, 227, 255, 0.12), transparent 45%), radial-gradient(circle at 80% 0%, rgba(255, 255, 255, 0.08), transparent 40%)"
      }
    }
  },
  plugins: []
};
