// Helper to resolve site URL for production/preview/dev
function resolveSiteUrl () {
  const env = process.env.VERCEL_ENV
  const custom = process.env.NUXT_SITE_URL
  const previewHost = process.env.VERCEL_URL
  const dev = process.env.NUXT_DEV_URL
  const isVercel = !!process.env.VERCEL

  // Production: use custom domain
  if ( env === "production" ) return custom

  // Preview: prefer Vercel preview URL, fallback to custom if provided
  if ( env === "preview" ) return previewHost ? `https://${previewHost}` : ( custom || "http://localhost:3000" )

  // Vercel dev (env may be undefined): prefer preview host if available
  if ( isVercel && previewHost ) return `https://${previewHost}`

  // Local dev: use custom/dev override or localhost
  return custom || dev || "http://localhost:3000"
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig( {
  compatibilityDate : "2025-07-15",
  devtools          : { enabled: true },
  ssr               : true,
  runtimeConfig     : {
    public: {
      siteName : process.env.NUXT_SITE_NAME,
      siteUrl  : resolveSiteUrl(),
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
    url       : resolveSiteUrl(),
    indexable : process.env.NODE_ENV === "production",
  },
  nitro: {
    preset    : process.env.VERCEL ? "vercel" : "static",
    prerender : {
      routes: [
        "/",
      ],
      failOnError: true,
    },
  },
  hooks: {
    "nitro:config": async ( nitroConfig ) => {
      if ( nitroConfig.dev ) return
      try {
        const { getProductRoutes } = await import( "./server/prerender/products" )
        const productRoutes = await getProductRoutes()

        nitroConfig.prerender = nitroConfig.prerender || { routes: [] }
        nitroConfig.prerender.routes = nitroConfig.prerender.routes || []
        for ( const r of productRoutes ) nitroConfig.prerender.routes.push( r )

        console.info( `[prerender] Added ${productRoutes.length} product routes.` )
      } catch ( err ) {
        console.warn( "[prerender] Failed adding product routes:", err )
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
  ],
  ui: {
    colorMode: false,
  },
} )
