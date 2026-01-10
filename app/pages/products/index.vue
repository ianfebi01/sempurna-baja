<template>
  <section id="katalog" ref="componentRef">
    <div
      class="main-container py-20
    ">
      <h1 class="mt-0 mb-12">Produk dari Sempurna Baja</h1>

      <!-- FILTER BAR -->
      <div class="flex flex-wrap gap-4 mb-12">
        <!-- Search -->
        <input
          v-model="search"
          type="text"
          placeholder="Cari produk..."
          class="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-64 h-10 focus:ring-1 focus:ring-black focus:outline-none transition-colors duration-300 ease-in-out hover:bg-gray-50" />

        <!-- Category Filter -->
        <Menu as="div" class="relative inline-block text-left w-full sm:w-64">
          <MenuButton
            class="inline-flex w-full justify-between items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 text-left h-10 focus:ring-1 focus:ring-black focus:outline-none transition-colors duration-300 ease-in-out">
            <span class="line-clamp-1">{{ selectedCategoryLabel }}</span>
            <Icon v-if="!categoriesPending" name="fa7-solid:chevron-down" class="size-4" />
            <Icon v-if="categoriesPending" name="fa7-solid:circle-notch" class="size-4 animate-spin" />
          </MenuButton>
          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0">
            <MenuItems
              class="absolute left-0 mt-2 w-full origin-top-left bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              <div class="max-h-[40vh] overflow-y-auto divide-y divide-gray-100">
                <MenuItem v-for="(cat, i) in categories" :key="i" v-slot="{ active }">
                  <button
                    type="button"
                    class="w-full text-left px-4 py-3 text-sm hover:font-bold flex justify-between items-center transition-default"
                    :class="{ 'font-bold': filters.category.includes(cat.value), 'bg-gray-50': active }"
                    @click="toggleCategory(cat.value)">
                    <span>{{ cat.label }}</span>
                    <Icon v-if="filters.category.includes(cat.value)" name="fa7-solid:check" class="size-4" />
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>

        <!-- Brand Filter -->
        <Menu as="div" class="relative inline-block text-left w-full sm:w-64">
          <MenuButton
            class="inline-flex w-full justify-between items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-left font-medium hover:bg-gray-50 h-10 focus:ring-1 focus:ring-black focus:outline-none transition-colors duration-300 ease-in-out">
            <span class="line-clamp-1">{{ selectedBrandLabel }}</span>
            <Icon v-if="!brandsPending" name="fa7-solid:chevron-down" class="size-4" />
            <Icon v-if="brandsPending" name="fa7-solid:circle-notch" class="size-4 animate-spin" />
          </MenuButton>
          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0">
            <MenuItems
              class="absolute left-0 mt-2 w-full origin-top-left bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              <div class="max-h-[40vh] overflow-y-auto divide-y divide-gray-100">
                <MenuItem v-for="(brand, i) in brands" :key="i" v-slot="{ active }">
                  <button
                    type="button"
                    class="w-full text-left px-4 py-3 text-sm hover:font-bold flex justify-between items-center transition-default"
                    :class="{ 'font-bold': filters.brand.includes(brand.value), 'bg-gray-50': active }"
                    @click="toggleBrand(brand.value)">
                    <span>{{ brand.label }}</span>
                    <Icon v-if="filters.brand.includes(brand.value)" name="fa7-solid:check" class="size-4" />
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>

        <button class="button button-primary h-10" @click="resetFilter">Reset Filter</button>
      </div>

      <!-- PRODUCT GRID -->
      <div
        ref="itemRef"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8 max-w-sm md:max-w-[unset] mx-auto md:mx-[unset] opacity-0 translate-y-8">
        <template v-if="!pending">
          <div v-for="(item) in data?.data.data" :key="item._id">
            <ProductCard :product="item" />
          </div>
        </template>
        <template v-else-if="pending">
          <div v-for="n in pagination.pageSize" :key="n" class="w-full h-96 bg-gray-200 animate-pulse rounded-xl"></div>
        </template>
      </div>

      <div v-if="!pending && data?.data.data?.length" class="flex items-center justify-between gap-3 pt-4 mt-auto">
        <div class="text-sm text-muted">
          {{ pagination.pageSize * (pagination.pageIndex + 1) }} dari
          {{ data?.data?.meta?.total || 0 }} total.
        </div>

        <div class="flex items-center gap-1.5">
          <AppPagination
            :page="(pagination.pageIndex || 0) + 1"
            :items-per-page="pagination.pageSize"
            :total="data?.data?.meta?.total || 0"
            @update:page="(p: number) => pagination.pageIndex = p - 1" />
        </div>
      </div>
      <div v-if="!pending && !data?.data.data?.length" class="text-center text-muted mt-12">
        Tidak ada produk ditemukan.
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, onServerPrefetch } from "vue"
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue"
import { useQuery } from "@tanstack/vue-query"
import type { ApiSuccess } from "~~/shared/types"
import type { ProductResponse } from "~~/shared/types/product"

const config = useRuntimeConfig().public
const baseUrl = config.baseUrl

// SEO Meta
const seoTitle = "Produk Baja Ringan & Galvalum | Sempurna Baja"
const seoDescription = "Katalog lengkap produk baja ringan, galvalum, channal, reng, plafon, dan genteng pasir di Wonosari. Harga terbaik, kualitas terjamin."
const seoImage = `${config.siteUrl}/images/sempurna-baja-5.webp`

useSeoMeta( {
    title              : seoTitle,
    description        : seoDescription,
    ogTitle            : seoTitle,
    ogDescription      : seoDescription,
    ogImage            : seoImage,
    ogUrl              : `${config.siteUrl}/products`,
    ogType             : "website",
    twitterTitle       : seoTitle,
    twitterDescription : seoDescription,
    twitterImage       : seoImage,
    twitterCard        : "summary_large_image",
    robots             : "index, follow",
} )

useHead( {
    htmlAttrs : { lang: "id" },
    link      : [{ rel: "canonical", href: `${config.siteUrl}/products` }],
    script    : [
        {
            type      : "application/ld+json",
            innerHTML : JSON.stringify( {
                "@context"    : "https://schema.org",
                "@type"       : "CollectionPage",
                "name"        : "Produk Sempurna Baja",
                "description" : seoDescription,
                "url"         : `${config.siteUrl}/products`,
                "image"       : seoImage,
                "publisher"   : {
                    "@type"     : "LocalBusiness",
                    "name"      : "Sempurna Baja",
                    "telephone" : "+6283144512987",
                },
            } ),
        },
    ],
} )

const filters = reactive( {
  category : [] as string[],
  brand    : [] as string[],
} )

const search = ref( "" )

const searchDebounce = useDebounce( search, 500 )

watch( searchDebounce, () => {
  pagination.value.pageIndex = 0
} )

const pagination = ref( {
  pageIndex : 0,
  pageSize  : 9,
} )

// Products Query - using Vue Query with reactive queryKey
const { data: productsData, isPending: pending, suspense: productsSuspense } = useQuery( {
  queryKey: computed( () => [
    "products",
    {
      page     : pagination.value.pageIndex + 1,
      pageSize : pagination.value.pageSize,
      search   : searchDebounce.value,
      category : filters.category.join( "," ),
      brand    : filters.brand.join( "," ),
    },
  ] ),
  queryFn: async () => {
    const params = new URLSearchParams()
    params.append( "page", String( pagination.value.pageIndex + 1 ) )
    params.append( "pageSize", String( pagination.value.pageSize ) )
    if ( searchDebounce.value ) params.append( "search", searchDebounce.value )
    if ( filters.category.length ) params.append( "category", filters.category.join( "," ) )
    if ( filters.brand.length ) params.append( "brand", filters.brand.join( "," ) )

    return await $fetch<ApiSuccess<ProductResponse>>( `${baseUrl}/api/products?${params.toString()}` )
  },
} )

// Alias for template compatibility
const data = computed( () => productsData.value )

// Categories Query
const { data: categoriesData, isPending: categoriesPending, suspense: categoriesSuspense } = useQuery( {
  queryKey  : ["categories"],
  queryFn   : async () => await $fetch<{ data: Category[] }>( `${baseUrl}/api/categories` ),
  staleTime : Infinity,
} )

const categories = computed( () => [
  { label: "Semua Kategori", value: "all" },
  ...( Array.isArray( categoriesData.value?.data )
    ? categoriesData.value.data.map( ( category ) => ( {
      label : category.name,
      value : category._id,
    } ) )
    : [] ),
] )

// Brands Query
const { data: brandsData, isPending: brandsPending, suspense: brandsSuspense } = useQuery( {
  queryKey  : ["brands"],
  queryFn   : async () => await $fetch<{ data: Brand[] }>( `${baseUrl}/api/brands` ),
  staleTime : Infinity,
} )

const brands = computed( () => [
  { label: "Semua Brand", value: "all" },
  ...( Array.isArray( brandsData.value?.data )
    ? brandsData.value.data.map( ( brand ) => ( {
      label : brand.name,
      value : brand._id,
    } ) )
    : [] ),
] )

// SSR Prefetch - this runs on server and dehydrates to payload
onServerPrefetch( async () => {
  await Promise.all( [
    productsSuspense(),
    categoriesSuspense(),
    brandsSuspense(),
  ] )
} )

// --- Toggle helpers (reactive-safe)
const toggleCategory = ( cat: string ) => {

  if ( cat === "all" ) {
    filters.category = []
  } else {
    const i = filters.category.indexOf( cat )
    if ( i > -1 ) filters.category.splice( i, 1 )
    else filters.category.push( cat )
  }
  pagination.value.pageIndex = 0
}

const toggleBrand = ( brand: string ) => {
  if ( brand === "all" ) {
    filters.brand = []
  } else {
    const i = filters.brand.indexOf( brand )
    if ( i > -1 ) filters.brand.splice( i, 1 )
    else filters.brand.push( brand )
  }
  pagination.value.pageIndex = 0
}

// ✅ Reactive-safe internal reset
const resetFilter = () => {
  filters.brand.splice( 0 )
  filters.category.splice( 0 )
  search.value = ""
  pagination.value.pageIndex = 0
}

const selectedCategoryLabel = computed( () =>
  filters.category.length === 0
    ? "Semua Kategori"
    : categories.value
      .filter( ( c ) => filters.category.includes( c.value ) )
      .map( ( c ) => c.label )
      .join( ", " ),
)

const selectedBrandLabel = computed( () =>
  filters.brand.length === 0
    ? "Semua Brand"
    : brands.value
      .filter( ( b ) => filters.brand.includes( b.value ) )
      .map( ( b ) => b.label )
      .join( ", " ),
)


/**
 * Transition
 */

const itemRef = ref<HTMLDivElement>()
const componentRef = ref<HTMLElement>()
let ctx: gsap.Context | null = null


onMounted( async () => {
  if ( !import.meta.client ) return

  // Lazy import GSAP & plugins only in browser
  const gsap = ( await import( "gsap" ) ).default
  const { ScrollTrigger } = await import( "gsap/ScrollTrigger" )

  gsap.registerPlugin( ScrollTrigger )

  if ( !componentRef.value ) return
  ctx = gsap.context( () => {
    const tl = gsap.timeline( {
      scrollTrigger: {
        trigger       : componentRef.value,
        start         : "top 100%",
        toggleActions : "play none none none",
      },
    } )

    if ( itemRef.value ) {
      tl.to( itemRef.value, {
        ease       : "power2.out",
        translateY : 0,
        duration   : 1,
        opacity    : 1,
        delay      : 0.2,
        stagger    : 0.2,
      } )
    }

  }, ( componentRef.value as HTMLElement ) )
} )


onBeforeUnmount( () => {
  if ( ctx ) ctx.revert()
} )

/**
 * End Transition
 */
</script>