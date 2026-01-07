<template>
  <pre>{{ data }}</pre>
  <section ref="containerRef" class="relative md:h-[calc(100vh-64px)] overflow-hidden">
    <div class="h-full main-container flex flex-col md:flex-row md:items-center gap-8 py-16 md:py-20">
      <div ref="textRef" class="flex flex-col max-w-2xl opacity-0 translate-y-8">
        <div class="flex flex-col justify-center grow">
          <h1 class="mt-0 text-2xl md:text-5xl mb-4">{{ data.title }}</h1>
          <h2 v-if="data.subtitle" ref="headingRef" class="text-xl md:text-2xl font-normal">{{ data.subtitle }}</h2>
          <div class="flex items-center gap-6 md:gap-8 mt-8 md:mt-16 flex-wrap">
            <NuxtLink v-if="data.ctaLink" :to="data.ctaLink" class="button button-primary">
              <Icon name="fa7-solid:paper-plane" />
              {{ data.ctaText || 'Chat WhatsApp' }}
            </NuxtLink>
            <NuxtLink v-if="data.secondaryCtaLink" :to="data.secondaryCtaLink" class="button button-secondary">
              <Icon name="fa7-solid:images" />
              {{ data.secondaryCtaText || 'Lihat Katalog' }}
            </NuxtLink>
          </div>
        </div>
      </div>
      <div ref="imageRef" class="overflow-hidden aspect-square rounded-2xl relative opacity-0 translate-y-8">
        <img
          :src="data.image"
          :alt="data.title"
          width="500"
          height="500"
          loading="eager"
          class="object-cover w-full h-full hover:scale-105 ease-out duration-300" />

        <div class="absolute bottom-0 z-10 text-white/90 w-full inset-x-0">
          <!-- overlay shadow bottom -->
          <div class="absolute w-full bottom-0 bg-gradient-to-t from-[#000]/80 to-transparent h-full z-0">
          </div>
          <div class="p-4 lg:p-8 relative z-[1] mt-4">
            <p class="h2 m-0">{{ data.title }}</p>
            <p v-if="data.subtitle" class="m-0">{{ data.subtitle }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { MainHeroBanner } from "~~/shared/types/page"

defineProps<{
  data: Omit<MainHeroBanner, "type">
  h1: string
}>()

const containerRef = ref<HTMLElement | null>( null )
const imageRef = ref<( HTMLElement | null )>( null )
const textRef = ref<( HTMLElement | null )>( null )
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
                start         : "top 100%",
                toggleActions : "play none none none",
            },
        } )

        if ( textRef.value ) {
            tl.to( textRef.value, {
                ease       : "power2.out",
                translateY : 0,
                duration   : 1,
                opacity    : 1,
                delay      : 0.2,
            } )
        }

        if ( imageRef.value ) {
            tl.to( imageRef.value, {
                ease       : "power2.out",
                translateY : 0,
                duration   : 1,
                opacity    : 1,
                delay      : 0.4,
            }, "<" )
        }

    }, ( containerRef.value as HTMLElement ) )


} )

onBeforeUnmount( () => {
    if ( ctx ) ctx.revert()
} )
</script>