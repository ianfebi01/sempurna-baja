// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig( {
  compatibilityDate : "2025-07-15",
  devtools          : { enabled: true },
  runtimeConfig     : {
    public: {
      prod     : process.env.VERCEL_ENV === "production",
      siteName : process.env.NUXT_SITE_NAME,
      siteUrl:
        process.env.VERCEL_ENV === "production"
          ? process.env.NUXT_SITE_URL // your custom domain, e.g. https://mysite.com
          : process.env.VERCEL_ENV === "preview"
            ? `https://${process.env.VERCEL_URL}` // Vercel preview deployments
            : process.env.NUXT_SITE_URL || "http://localhost:3000", // local or vercel dev,
      baseUrl: process.env.NUXT_BASE_URL,
    },
  },
  ssr     : process.env.NODE_ENV === "production" ? true : false,
  modules : [
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
  nitro: {
    prerender: {
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

      // Fetch products from the API server for prerendering
      const baseUrl = process.env.NUXT_BASE_URL
      if ( !baseUrl ) {
        console.warn( "[prerender] NUXT_BASE_URL is not set, skipping dynamic product routes" )
        return
      }

      // Fetch products for prerendering
      try {
        const response = await fetch( `${baseUrl}/api/products?pageSize=1000` )
        const result = await response.json() as { data: { data: Array<{ slug: string }> } }
        const products = result?.data?.data || []

        products.forEach( ( item ) => nitroConfig?.prerender?.routes?.push( `/products/${item.slug}` ) )
        console.log( `[prerender] Added ${products.length} product routes` )
      } catch ( error ) {
        console.error( "[prerender] Failed to fetch products:", error )
      }

      // Fetch pages/slugs for prerendering
      try {
        const response = await fetch( `${baseUrl}/api/pages?pageSize=1000&published=true&homePage=false` )
        const result = await response.json() as { data: { data: Array<{ slug: string }> } }
        const pages = result?.data?.data || []

        pages.forEach( ( item ) => nitroConfig?.prerender?.routes?.push( `/${item.slug}` ) )
        console.log( `[prerender] Added ${pages.length} page routes` )
      } catch ( error ) {
        console.error( "[prerender] Failed to fetch pages:", error )
      }
    },
  },
  router: {
    options: {
      scrollBehaviorType: "smooth",
    },
  },
  plugins: [
    "~/plugins/ValidateSlug.ts",
    "~/plugins/Section.ts",
    "~/plugins/Hero.ts",
  ],
} )
