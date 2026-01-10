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

const config = useRuntimeConfig().public
const baseUrl = config.baseUrl

const create404 = ( slug: string ) =>
    createError( {
        statusCode    : 404,
        statusMessage : `Page Not Found: ${slug}`,
        fatal         : true,
    } )

const query = qs.stringify( { published: false } )
const { data } = await useAsyncData( "home-page", () => $fetch<ApiSuccess<Page>>( `${baseUrl}/api/pages/homepage?${query}` ) )

const page = computed( () => data.value?.data )

if ( !page.value ) {
    console.error( "page not found" )
    throw create404( "" )
}

// SEO Meta
const seoTitle = "Sempurna Baja – Baja Ringan & Galvalum"
const seoDescription = "Toko & jasa pasang baja ringan, galvalum, channal, reng, plafon di Wonosari. Survey & estimasi gratis. WA +62 831-4451-2987."
const seoImage = `${config.siteUrl}/images/sempurna-baja-5.webp`
const seoKeywords = [
    "baja ringan wonosari",
    "galvalum gunungkidul",
    "jasa pasang atap wonosari",
    "channal c75",
    "reng baja ringan",
    "genteng pasir",
    "plafon wonosari",
    "toko baja ringan",
].join( ", " )

useSeoMeta( {
    title              : seoTitle,
    description        : seoDescription,
    keywords           : seoKeywords,
    ogTitle            : seoTitle,
    ogDescription      : seoDescription,
    ogImage            : seoImage,
    ogUrl              : `${config.siteUrl}/`,
    ogType             : "website",
    twitterTitle       : seoTitle,
    twitterDescription : seoDescription,
    twitterImage       : seoImage,
    twitterCard        : "summary_large_image",
    robots             : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
} )

useHead( {
    htmlAttrs : { lang: "id" },
    link      : [{ rel: "canonical", href: `${config.siteUrl}/` }],
    script    : [
        {
            type      : "application/ld+json",
            innerHTML : JSON.stringify( {
                "@context"    : "https://schema.org",
                "@type"       : "LocalBusiness",
                "name"        : "Sempurna Baja",
                "description" : "Toko & jasa pemasangan baja ringan, galvalum, channal, reng, plafon, dan genteng pasir di Wonosari, Gunungkidul.",
                "image"       : seoImage,
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
                        "image"       : `${config.siteUrl}${p.image}`,
                        "description" : p.description,
                        "brand"       : p.brand,
                        "category"    : p.category,
                        "offers"      : {
                            "@type"         : "Offer",
                            "price"         : p.price.toString(),
                            "priceCurrency" : "IDR",
                            "availability"  : "https://schema.org/InStock",
                            "url"           : `${config.siteUrl}/products/${p.slug}`,
                        },
                    } ) ),
                },
            } ),
        },
    ],
} )


</script>