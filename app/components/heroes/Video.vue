<template>
  <section ref="containerRef" class="relative h-[60vh] md:h-[80vh] overflow-hidden">
    <!-- Video Background -->
    <div class="absolute inset-0 z-0">
      <video
        ref="videoRef"
        :src="props.videoUrl"
        autoplay
        muted
        loop
        playsinline
        class="object-cover w-full h-full">
      </video>
      <div class="absolute inset-0 bg-black/40"></div>
    </div>

    <div class="main-container relative z-10 h-full flex items-center justify-center">
      <div ref="textRef" class="max-w-3xl mx-auto text-center opacity-0 translate-y-8">
        <h1 class="text-3xl md:text-5xl font-bold mb-4 text-white">
          {{ props.title }}
        </h1>
        <p
          v-if="props.subtitle"
          class="text-lg md:text-xl text-white/80">
          {{ props.subtitle }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { VideoHeroBanner } from "~~/shared/types/page"

const props = defineProps<Omit<VideoHeroBanner, "type">>()

const containerRef = ref<HTMLElement | null>( null )
const textRef = ref<HTMLElement | null>( null )
const videoRef = ref<HTMLVideoElement | null>( null )
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
