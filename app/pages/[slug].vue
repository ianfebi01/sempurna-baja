<template>
  <div>
    <ParsersHero v-if="page?.banner" :hero="page?.banner" :h1="page?.banner.title" />
    <ParsersSection v-if="page?.sections?.length" :sections="page?.sections" />
  </div>
</template>

<script setup lang="ts">
import type { ApiSuccess } from "~~/shared/types"


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

const { data } = await useAsyncData( `page-${slug}`, () => $fetch<ApiSuccess<Page>>( `${baseUrl}/api/pages/slug/${slug}`, {
    params: { published: false },
} ) )

const page = computed( () => data.value?.data )

if ( !page.value ) {
    console.error( "page not found", slug )
    throw create404( slug ? String( slug ) : "" )
}
</script>