<template>
  <section id="katalog" ref="componentRef">
    <div class="main-container p-20">
      <h2 class="h1 mt-0 text-center mb-12">Katalog Produk</h2>

      <!-- Loading State -->
      <div
        v-if="pending"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8 max-w-sm md:max-w-[unset] mx-auto md:mx-[unset]">
        <div v-for="n in 3" :key="n" class="w-full h-96 bg-gray-200 animate-pulse rounded-xl"></div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!uniqueCategoryProducts.length"
        class="flex flex-col items-center justify-center py-16 text-gray-500">
        <Icon name="heroicons:cube" class="w-16 h-16 mb-4 text-gray-300" />
        <p class="text-lg font-medium">Tidak ada produk</p>
        <p class="text-sm">Produk belum tersedia saat ini</p>
      </div>

      <!-- Product Grid -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8 max-w-sm md:max-w-[unset] mx-auto md:mx-[unset]">
        <div
          v-for="(item, index) in uniqueCategoryProducts"
          :ref="el => itemsRef[index] = (el as HTMLDivElement)"
          :key="item._id || index"
          class="opacity-0 translate-y-8">
          <ProductCard :product="item" />
        </div>
      </div>
      <NuxtLink
        to="/products"
        class="mx-auto mt-12 button button-primary"
        :class="{
          'button-disabled': !uniqueCategoryProducts.length
        }"
        :disabled="!uniqueCategoryProducts.length">
        Lihat Selengkapnya
      </NuxtLink>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { ApiSuccess } from "~~/shared/types"
import type { ProductResponse } from "~~/shared/types/product"

const baseUrl = useRuntimeConfig().public.baseUrl

const { data: uniqueCategoryData, pending } = await useAsyncData( "unique-category-products-home", () => $fetch<ApiSuccess<ProductResponse>>( `${baseUrl}/api/products/unique-category` ) )

const uniqueCategoryProducts = computed( () => uniqueCategoryData.value?.data?.data || [] )

/**
 * Transition
 */

const itemsRef = ref<HTMLDivElement[] | null[]>( [] )
const componentRef = ref<HTMLElement>()
let ctx: gsap.Context | null = null

const runAnimation = async () => {
  if ( !import.meta.client ) return
  if ( !uniqueCategoryProducts.value.length ) return
  if ( !componentRef.value ) return

  // Lazy import GSAP & plugins only in browser
  const gsap = ( await import( "gsap" ) ).default
  const { ScrollTrigger } = await import( "gsap/ScrollTrigger" )

  gsap.registerPlugin( ScrollTrigger )

  // Clean up previous animation context
  if ( ctx ) ctx.revert()

  // Wait for DOM to update
  await nextTick()

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
}

onMounted( () => {
  runAnimation()
} )

onBeforeUnmount( () => {
  if ( ctx ) ctx.revert()
} )

/**
 * End Transition
 */
</script>