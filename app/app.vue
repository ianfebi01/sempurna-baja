<template>
  <div class="flex flex-col relative min-h-screen">
    <div class="sticky top-0 left-0 z-40 print:hidden bg-white shadow-sm">
      <Header/>
    </div>
    <NuxtPage class="grow"/>
    <Footer/>
  </div>
</template>
<script lang="ts" setup>
const config = useRuntimeConfig()
const siteName = config.public.siteName
const title = siteName || "Sempurna Baja – Baja Ringan & Galvalum | Gratis Ongkir"
const description = "Toko & jasa pasang baja ringan, galvalum, channal, reng, plafon di Wonosari. Gratis ongkir Gunungkidul. Survey & estimasi gratis. WA +62 831-4451-2987."
useHead( {
  htmlAttrs: {
    lang: "id",
  },
  title,
  meta: [
    {
      name    : "description",
      content : description,
    },
  ],
link: [
    // Modern browsers (PNG)
    { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16.png" },
    { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
    { rel: "icon", type: "image/png", sizes: "192x192", href: "/favicon-192.png" },

    // iOS & Android
    { rel: "apple-touch-icon", sizes: "180x180", href: "/favicon-180.png" },

    // Classic .ico fallback (important for Googlebot)
    { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
    { rel: "shortcut icon", type: "image/x-icon", href: "/favicon.ico" },
  ],
} )
</script>