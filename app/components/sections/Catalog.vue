<template>
  <section id="katalog" ref="componentRef">
    <div class="main-container p-20">
      <h2 class="h1 mt-0 text-center mb-12">Katalog Produk Batu Alam</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8 max-w-sm md:max-w-[unset] mx-auto md:mx-[unset]">
        <NuxtLink
          v-for="(item, index) in uniqueCategoryProducts"
          :key="index"
          :to="`/products/${item.slug}`"
          class="no-underline group">
          <div :ref="el => itemsRef[index] = (el as HTMLDivElement)" class="opacity-0 translate-y-8">
            <div
              class="rounded-xl bg-gradient-to-t from-gray-100 to-white hover:shadow-2xl transition-default overflow-hidden h-full">
              <!-- Image -->
              <div class="aspect-video w-full overflow-hidden">
                <img
                  :src="item.image"
                  :alt="item?.name || `sempurna baja ${index}`"
                  width="500"
                  height="500"
                  class="object-cover object-center w-full h-full transition-default hover:scale-105" />
              </div>
              <!-- Text -->
              <div class="p-4 md:p-6 flex flex-col">
                <div>
                  <h3>{{ item.name }}</h3>
                  <p class="line-clamp-3">{{ item.description }}</p>
                </div>
                <div class="flex-grow"></div>
                <div class="mt-4">
                  <p class="h4 w-fit m-0">{{ `${formatRupiah(item.price)}/${item.unit}` }}</p>
                </div>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
      <NuxtLink to="/products" class="mx-auto mt-12 button button-primary">
        Lihat Selengkapnya
      </NuxtLink>
    </div>
  </section>
</template>

<script lang="ts" setup>
import products from "@/assets/json/products.json"

toRaw( products )

/**
 * Transition
 */

const itemsRef = ref<HTMLDivElement[] | null[]>( [] )
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
        start         : "top 75%",
        toggleActions : "play none none none",
      },
    } )

    if ( itemsRef.value?.length ) {
      tl.to( itemsRef.value, {
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

const uniqueCategoryProducts = computed( () => {
  const map = new Map()
  for ( const product of products ) {
    if ( !map.has( product.category ) ) {
      map.set( product.category, product )
    }
  }
  return Array.from( map.values() ).slice( 0, 3 )
} )
</script>