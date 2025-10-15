<template>
  <div class="relative">
    <div>
      <section v-if="product" ref="productSectionRef" class="py-20 main-container opacity-0 translate-y-8">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-1 text-base font-bold mb-4">
          <NuxtLink to="/">
            <Icon name="fa7-solid:house" />
          </NuxtLink>
          <span>/</span>
          <NuxtLink to="/products" class="no-underline">Produk</NuxtLink>
          <span>/</span>
          <NuxtLink :to="`/products/${product.slug}`" class="no-underline">
            {{ product.name }}
          </NuxtLink>
        </div>

        <!-- Product Content -->
        <div class="flex flex-col sm:flex-row">
          <div class="sm:basis-[40%]">
            <div class="aspect-square overflow-hidden rounded-xl">
              <img
                :src="product?.image"
                :alt="product?.name || 'product image'"
                class="w-full h-full object-cover hover:scale-105 transition-default"
                width="500"
                height="500" />
            </div>
          </div>
          <div class="sm:pl-8 sm:basis-[60%]">
            <h1 class="sm:mt-0">{{ product?.name }}</h1>
            <p v-if="product.brand">Merk: <b>{{ product.brand }}</b></p>
            <p v-if="product.description">
              {{ product.description }}
            </p>
          </div>
        </div>
      </section>

      <div class="bg-gray-100">
        <section ref="componentRef" class="py-20 main-container">
          <h2 class="h1 mt-0 text-center mb-12">Lihat Produk lainnya</h2>
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8 max-w-sm md:max-w-[unset] mx-auto md:mx-[unset]">
            <div
              v-for="(item, index) in uniqueCategoryProducts"
              :ref="el => itemsRef[index] = (el as HTMLDivElement)"
              :key="index"
              class="opacity-0 translate-y-8">
              <ProductCard :product="item" bg-colour="white" />
            </div>
          </div>
          <NuxtLink to="/products" class="mx-auto mt-12 button button-primary">
            Lihat Selengkapnya
          </NuxtLink>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import products from "@/assets/json/products.json"
toRaw( products )

const config = useRuntimeConfig().public
const route = useRoute()
const { $validateSlug } = useNuxtApp()

// validation
const slug: Ref<string | null> = ref( null )
const create404 = ( slug: string ) =>
    createError( {
        statusCode    : 404,
        statusMessage : `Page Not Found: ${slug}`,
        fatal         : true,
    } )

if ( !$validateSlug( `${route.params.slug}` ) ) {
    console.error( "invalid route", route.params.slug )
    throw create404( `${route.params.slug}` )
} else {
    slug.value = `${route.params.slug}`
}

const product = computed( () =>
    products.find( ( item ) => item.slug === route.params.slug ),
)
if ( !product.value ) {
    console.error( "product not found", route.params.slug )
    throw create404( `${route.params.slug}` )
}

const uniqueCategoryProducts = computed( () => {
    const map = new Map()
    for ( const product of products.filter( ( item ) => item.slug !== route.params.slug ) ) {
        if ( !map.has( product.category ) ) {
            map.set( product.category, product )
        }
    }
    return Array.from( map.values() ).slice( 0, 3 )
} )

// SEO
const title = `${product.value?.name} - ${product.value?.brand} | Sempurna Baja`
const sitename = config.siteName
const desc = product.value.description
useHead( {
    title : title || sitename || null,
    meta  : [
        { name: "og:title", content: title },
        { name: "twitter:title", content: title },
        { name: "description", content: desc || null },
        { name: "og:description", content: desc || null },
        { name: "twitter:description", content: desc || null },
        { name: "og:image", content: product.value?.image || null },
        { name: "twitter:image", content: product.value?.image || null },
        { name: "og:type", content: "article" },
        { property: "og:url", content: `${config.siteUrl}/products/${route.params.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "robots", content: "index, follow" },
    ].filter( ( tag ) => tag.content ),
    htmlAttrs : { lang: "id" },
    link      : [
        { rel: "canonical", href: `${config.siteUrl}/products/${route.params.slug}` },
    ],
} )

/**
 * Transitions
 */
const itemsRef = ref<HTMLDivElement[] | null[]>( [] )
const componentRef = ref<HTMLElement>()
const productSectionRef = ref<HTMLElement>()
let ctx: gsap.Context | null = null

onMounted( async () => {
    if ( !import.meta.client ) return

    const gsap = ( await import( "gsap" ) ).default
    const { ScrollTrigger } = await import( "gsap/ScrollTrigger" )
    gsap.registerPlugin( ScrollTrigger )

    ctx = gsap.context( () => {
        // Animate main product section
        if ( productSectionRef.value ) {
            gsap.to( productSectionRef.value, {
                scrollTrigger: {
                    trigger       : productSectionRef.value,
                    start         : "top 85%",
                    toggleActions : "play none none none",
                },
                opacity  : 1,
                y        : 0,
                duration : 1,
                ease     : "power2.out",
            } )
        }

        // Animate "Lihat Produk lainnya" grid
        if ( componentRef.value && itemsRef.value?.length ) {
            const tl = gsap.timeline( {
                scrollTrigger: {
                    trigger       : componentRef.value,
                    start         : "top 75%",
                    toggleActions : "play none none none",
                },
            } )
            tl.to( itemsRef.value, {
                ease       : "power2.out",
                translateY : 0,
                duration   : 1,
                opacity    : 1,
                delay      : 0.2,
                stagger    : 0.2,
            } )
        }
    } )
} )

onBeforeUnmount( () => {
    if ( ctx ) ctx.revert()
} )
</script>
