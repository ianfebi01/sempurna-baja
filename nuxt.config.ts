// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig( {
  compatibilityDate : "2025-07-15",
  devtools          : { enabled: true },
  runtimeConfig     : {
    public: {
      siteName: process.env.NUXT_SITE_NAME,
      siteUrl:
        process.env.VERCEL_ENV === "production"
          ? process.env.NUXT_SITE_URL // your custom domain, e.g. https://mysite.com
          : process.env.VERCEL_ENV === "preview"
            ? `https://${process.env.VERCEL_URL}` // Vercel preview deployments
            : process.env.NUXT_SITE_URL || "http://localhost:3000", // local or vercel dev,
    },
  },
  modules: [
    "@nuxt/eslint",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/sitemap",
    "@nuxtjs/robots",
    "@nuxt/icon",
    "@nuxt/image",
  ],
  eslint: {
    checker: true,
  },
  tailwindcss: {
    exposeConfig: true,
  },
  css     : ["@/assets/css/main.css"],
  postcss : {
    plugins: {
      "postcss-import"      : {},
      "tailwindcss/nesting" : {},
      tailwindcss           : {},
      autoprefixer          : {},
    },
  },
  site: {
    url:
      process.env.VERCEL_ENV === "production"
        ? process.env.NUXT_SITE_URL // your custom domain, e.g. https://mysite.com
        : process.env.VERCEL_ENV === "preview"
          ? `https://${process.env.VERCEL_URL}` // Vercel preview deployments
          : process.env.NUXT_SITE_URL || "http://localhost:3000", // local or vercel dev,
    indexable: process.env.NODE_ENV === "production",
  },
  router: {
    options: {
      scrollBehaviorType: "smooth",
    },
  },
  plugins: [
    "~/plugins/ValidateSlug.ts",
  ],
} )
