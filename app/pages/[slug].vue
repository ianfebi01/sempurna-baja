<template>
  <div>
    <ParsersHero v-if="page?.banner" :hero="page?.banner" :h1="page?.banner.title" />
    <ParsersSection v-if="page?.sections?.length" :sections="page?.sections" />
  </div>
</template>

<script setup lang="ts">
import type { ApiSuccess } from "~~/shared/types"
import qs from "qs"


const route = useRoute()
const config = useRuntimeConfig().public
const baseUrl = config.baseUrl
const { $validateSlug } = useNuxtApp()
const slug = route.params.slug

const create404 = ( slug: string ) =>
    createError( {
        statusCode    : 404,
        statusMessage : `Page Not Found: ${slug}`,
        fatal         : true,
    } )

if ( !$validateSlug( `${route.params.slug}` ) ) {
    console.error( "invalid route", route.params.slug )
    throw create404( `${route.params.slug}` )
}

const query = qs.stringify( { published: config.prod, homePage: false } )
const { data } = await useAsyncData( `page-${slug}`, () => $fetch<ApiSuccess<Page>>( `${baseUrl}/api/pages/slug/${slug}?${query}` ) )

const page = computed( () => data.value?.data )

if ( !page.value ) {
    console.error( "page not found", slug )
    throw create404( slug ? String( slug ) : "" )
}

// SEO Meta - using Page's meta fields and type-safe banner image access
const getBannerImage = ( banner: Page["banner"] | undefined ): string | undefined => {
    if ( !banner ) return undefined
    if ( banner.type === "mainHero" ) return banner.image
    if ( banner.type === "simpleHero" ) return banner.backgroundImage
    if ( banner.type === "videoHero" ) return undefined // video banners don't have static image
    return undefined
}

const seoTitle = computed( () => page.value?.metaTitle || page.value?.banner?.title || page.value?.name || "Sempurna Baja" )
const seoDescription = computed( () => page.value?.metaDescription || page.value?.banner?.subtitle || "Toko & jasa pasang baja ringan, galvalum, channal, reng, plafon di Wonosari. Survey & estimasi gratis." )
const seoImage = computed( () => getBannerImage( page.value?.banner ) || `${config.siteUrl}/images/sempurna-baja-5.webp` )

useSeoMeta( {
    title              : seoTitle,
    description        : seoDescription,
    ogTitle            : seoTitle,
    ogDescription      : seoDescription,
    ogImage            : seoImage,
    ogUrl              : `${config.siteUrl}/${slug}`,
    ogType             : "website",
    twitterTitle       : seoTitle,
    twitterDescription : seoDescription,
    twitterImage       : seoImage,
    twitterCard        : "summary_large_image",
    robots             : "index, follow",
} )

useHead( {
    htmlAttrs : { lang: "id" },
    link      : [{ rel: "canonical", href: `${config.siteUrl}/${slug}` }],
    script    : [
        {
            type      : "application/ld+json",
            innerHTML : JSON.stringify( {
                "@context"    : "https://schema.org",
                "@type"       : "WebPage",
                "name"        : seoTitle.value,
                "description" : seoDescription.value,
                "url"         : `${config.siteUrl}/${slug}`,
                "image"       : seoImage.value,
                "publisher"   : {
                    "@type" : "LocalBusiness",
                    "name"  : "Sempurna Baja",
                },
            } ),
        },
    ],
} )
</script>