<template>
  <div>
    <ParsersHero v-if="page?.banner" :hero="page?.banner" :h1="page?.banner.title" />
    <ParsersSection v-if="page?.sections?.length" :sections="page?.sections" />
  </div>
</template>

<script lang="ts" setup>
import products from "@/assets/json/products.json"
import type { ApiSuccess } from "~~/shared/types"
import qs from "qs"

toRaw( products )

const route = useRoute()
const config = useRuntimeConfig().public
const baseUrl = config.baseUrl

const create404 = ( slug: string ) =>
    createError( {
        statusCode    : 404,
        statusMessage : `Page Not Found: ${slug}`,
        fatal         : true,
    } )

const query = qs.stringify( { published: false } )
const { data } = await useAsyncData( `home-page`, () => $fetch<ApiSuccess<Page>>( `${baseUrl}/api/pages/homepage?${query}` ) )

const page = computed( () => data.value?.data )

if ( !page.value ) {
    console.error( "page not found" )
    throw create404( "" )
}

const title = "Sempurna Baja – Baja Ringan & Galvalum"
const description = "Toko & jasa pasang baja ringan, galvalum, channal, reng, plafon di Wonosari. Survey & estimasi gratis. WA +62 831-4451-2987."
useHead( {
  title : title,
  meta  : [
    // Basic
    {
      name    : "description",
      content : description,
    },
    {
      name    : "keywords",
      content : [
        "baja ringan wonosari",
        "galvalum gunungkidul",
        "jasa pasang atap wonosari",
        "channal c75",
        "reng baja ringan",
        "genteng pasir",
        "plafon wonosari",
        "toko baja ringan",
      ].join( ", " ),
    },

    // Open Graph
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: `${config?.siteUrl}/images/sempurna-baja-5.webp` },
    { property: "og:url", content: `${config?.siteUrl}/` },
    { property: "og:type", content: "website" },

    // Twitter
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: `${config?.siteUrl}/images/sempurna-baja-5.webp` },
    { name: "twitter:card", content: "summary_large_image" },

    // Robots
    { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
  ],

  link: [
    { rel: "canonical", href: `${config?.siteUrl}/` },
  ],

  script: [
    {
      type      : "application/ld+json",
      innerHTML : JSON.stringify( {
        "@context"    : "https://schema.org",
        "@type"       : "LocalBusiness",
        "name"        : "Sempurna Baja",
        "description" : "Toko & jasa pemasangan baja ringan, galvalum, channal, reng, plafon, dan genteng pasir di Wonosari, Gunungkidul.",
        "image"       : `${config?.siteUrl}/images/sempurna-baja-5.webp`,
        "telephone"   : "+6283144512987",
        "address"     : {
          "@type"           : "PostalAddress",
          "streetAddress"   : "Dunggubah 2, RT.01/RW.02, Duwet",
          "addressLocality" : "Wonosari",
          "addressRegion"   : "Daerah Istimewa Yogyakarta",
          "addressCountry"  : "ID",
        },
        "areaServed"      : "Gunungkidul, Yogyakarta",
        "priceRange"      : "IDR 20000-90000",
        "hasOfferCatalog" : {
          "@type"           : "OfferCatalog",
          "name"            : "Produk Baja Ringan & Galvalum",
          "itemListElement" : toRaw( products ).map( ( p ) => ( {
            "@type"       : "Product",
            "name"        : p.name,
            "image"       : `${config?.siteUrl}${p.image}`,
            "description" : p.description,
            "brand"       : p.brand,
            "category"    : p.category,
            "offers"      : {
              "@type"         : "Offer",
              "price"         : p.price.toString(),
              "priceCurrency" : "IDR",
              "availability"  : "https://schema.org/InStock",
              "url"           : `${config?.siteUrl}/products/${p.slug}`,
            },
          } ) ),
        },
      },
      ),
    },
  ],
} )


</script>