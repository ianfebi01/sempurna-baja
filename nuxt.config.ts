import products from "./app/assets/json/products.json"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig( {
  compatibilityDate : "2025-07-15",
  devtools          : { enabled: true },
  ssr               : true,
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
    auth: {
      mongo: {
        secret  : process.env.JWT_SECRET as string,
        exclude : [],
      },
    },
  },
  modules: [
    "@nuxt/eslint",
    "@nuxtjs/sitemap",
    "@nuxtjs/robots",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/ui",
    "nuxt-mongoose",
  ],
  eslint: {
    checker: true,
  },
  postcss: {
    plugins: {
      "@tailwindcss/postcss": {},
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
  nitro: {
    // Force Vercel serverless functions deployment (avoid static preset)
    preset    : "vercel",
    prerender : {
      // Keep static prerender for pages while still deploying API routes
      routes: [
        "/",
        "/products",
      ],
      failOnError: true,
    },
  },
  hooks: {
    "nitro:config": async ( nitroConfig ) => {
      if ( nitroConfig.dev ) {
        return
      }

      products.forEach( ( item ) => nitroConfig?.prerender?.routes?.push( `/products/${item.slug}` ) )
    },
  },
  router: {
    options: {
      scrollBehaviorType: "smooth",
    },
  },
  plugins: [
    "~/plugins/ValidateSlug.ts",
  ],
  ui: {
    colorMode: false,
  },
} )
