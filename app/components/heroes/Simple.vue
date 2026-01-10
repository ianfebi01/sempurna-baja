<template>
  <section ref="containerRef" class="relative py-16 md:py-24 overflow-hidden">
    <!-- Background Image (optional) -->
    <div
      v-if="props.backgroundImage"
      class="absolute inset-0 z-0">
      <img
        :src="props.backgroundImage"
        :alt="props.title"
        class="object-cover w-full h-full" />
      <div class="absolute inset-0 bg-black/50"></div>
    </div>

    <div class="main-container relative z-10">
      <div ref="textRef" class="max-w-3xl mx-auto text-center opacity-0 translate-y-8">
        <h1 class="text-3xl md:text-5xl font-bold mb-4" :class="props.backgroundImage ? 'text-white' : ''">
          {{ props.title }}
        </h1>
        <p
          v-if="props.subtitle"
          class="text-lg md:text-xl"
          :class="props.backgroundImage ? 'text-white/80' : 'text-gray-600'">
          {{ props.subtitle }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { SimpleHeroBanner } from "~~/shared/types/page"

const props = defineProps<Omit<SimpleHeroBanner, "type">>()

const containerRef = ref<HTMLElement | null>( null )
const textRef = ref<HTMLElement | null>( null )
let ctx: gsap.Context | null = null

onMounted( async () => {
    if ( !import.meta.client ) return

    const gsap = ( await import( "gsap" ) ).default
    const { ScrollTrigger } = await import( "gsap/ScrollTrigger" )

    gsap.registerPlugin( ScrollTrigger )

    if ( !containerRef.value ) return
    ctx = gsap.context( () => {
        if ( textRef.value ) {
            gsap.to( textRef.value, {
                scrollTrigger: {
                    trigger       : containerRef.value,
                    start         : "top 100%",
                    toggleActions : "play none none none",
                },
                ease       : "power2.out",
                translateY : 0,
                duration   : 1,
                opacity    : 1,
                delay      : 0.2,
            } )
        }
    }, containerRef.value as HTMLElement )
} )

onBeforeUnmount( () => {
    if ( ctx ) ctx.revert()
} )
</script>
