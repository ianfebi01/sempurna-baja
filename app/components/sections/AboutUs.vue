<template>
  <section ref="containerRef">
    <div class="main-container p-20">
      <h2 class="h1 mt-0 text-center mb-12">{{ sectionData.title }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="(item, index) in sectionData.items"
          :key="index"
          :ref="el => itemsRef[index] = (el as HTMLDivElement)"
          class="opacity-0 translate-y-8 h-full">
          <div
            class="bg-gradient-to-t from-gray-100 to-white hover:shadow-2xl transition-default p-8 text-center rounded-xl h-full">
            <div class="overflow-hidden p-6">
              <img
                :src="item.image"
                :alt="item.title"
                class="w-full h-full object-contain object-center" />
            </div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { AboutUsSection } from "~~/shared/types/page"

defineProps<{
  sectionData: AboutUsSection
}>()

const containerRef = ref<HTMLElement | null>( null )
const itemsRef = ref<HTMLDivElement[]>( [] )
let ctx: gsap.Context | null = null

onMounted( async () => {
    if ( !import.meta.client ) return

    // Lazy import GSAP & plugins only in browser
    const gsap = ( await import( "gsap" ) ).default
    const { ScrollTrigger } = await import( "gsap/ScrollTrigger" )

    gsap.registerPlugin( ScrollTrigger )

    if ( !containerRef.value ) return
    
    ctx = gsap.context( () => {
        const tl = gsap.timeline( {
            scrollTrigger: {
                trigger       : containerRef.value,
                start         : "top 75%",
                toggleActions : "play none none none",
            },
        } )

        if ( itemsRef.value?.length ) {
            tl.to( itemsRef.value, {
                ease     : "power2.out",
                y        : 0, // GSAP shorthand instead of translateY
                duration : 1,
                opacity  : 1,
                delay    : 0.2,
                stagger  : 0.2,
            } )
        }
    }, ( containerRef.value as HTMLElement ) )
} )

onBeforeUnmount( () => {
    if ( ctx ) ctx.revert()
} )
</script>
