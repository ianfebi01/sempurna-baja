<template>
  <section id="katalog" ref="componentRef">
    <div class="main-container p-20">
      <h2 class="h1 mt-0 text-center mb-12">Katalog Produk</h2>
      <!-- Empty State -->
      <div v-if="!uniqueCategoryProducts.length" class="flex flex-col items-center justify-center py-16 text-gray-500">
        <UIcon name="i-heroicons-cube" class="w-16 h-16 mb-4 text-gray-300" />
        <p class="text-lg font-medium">Tidak ada produk</p>
        <p class="text-sm">Produk belum tersedia saat ini</p>
      </div>

      <!-- Product Grid -->
      <div v-else
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8 max-w-sm md:max-w-[unset] mx-auto md:mx-[unset]">
        <div v-for="(item, index) in uniqueCategoryProducts" :ref="el => itemsRef[index] = (el as HTMLDivElement)"
          :key="index" class="opacity-0 translate-y-8">
          <ProductCard :product="item" />
        </div>
      </div>
      <NuxtLink to="/products" class="mx-auto mt-12 button button-primary" :class="{
        'button-disabled': !uniqueCategoryProducts.length
      }" :disabled="!uniqueCategoryProducts.length">
        Lihat Selengkapnya
      </NuxtLink>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query"
import type { ApiSuccess } from "~~/shared/types"
import type { ProductResponse } from "~~/shared/types/product"

const baseUrl = useRuntimeConfig().public.baseUrl

// Catalog Products Query - cached for homepage
const { data: uniqueCategoryData, suspense } = useQuery( {
  queryKey : ["unique-category-products-home"],
  queryFn  : async () => await $fetch<ApiSuccess<ProductResponse>>( `${baseUrl}/api/products/unique-category` ),
} )

// Wait for data during SSR
await suspense()

const uniqueCategoryProducts = computed( () => uniqueCategoryData.value?.data?.data || [] )

/**
 * Transition
 */

const itemsRef = ref<HTMLDivElement[] | null[]>([])
const componentRef = ref<HTMLElement>()
let ctx: gsap.Context | null = null


onMounted(async () => {
  if (!import.meta.client) return

  // Lazy import GSAP & plugins only in browser
  const gsap = (await import("gsap")).default
  const { ScrollTrigger } = await import("gsap/ScrollTrigger")

  gsap.registerPlugin(ScrollTrigger)

  if (!componentRef.value) return
  ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: componentRef.value,
        start: "top 75%",
        toggleActions: "play none none none",
      },
    })

    if (itemsRef.value?.length) {
      tl.to(itemsRef.value, {
        ease: "power2.out",
        translateY: 0,
        duration: 1,
        opacity: 1,
        delay: 0.2,
        stagger: 0.2,
      })
    }

  }, (componentRef.value as HTMLElement))
})


onBeforeUnmount(() => {
  if (ctx) ctx.revert()
})

/**
 * End Transition
 */
</script>