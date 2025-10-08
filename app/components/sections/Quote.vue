<template>
  <section ref="containerRef" class="bg-gray-100">
    <div class="main-container p-20">
      <div class=" max-w-2xl mx-auto">
        <blockquote
          ref="textRef"
          cite="https://www.example.com/artikel"
          class="text-3xl text-center opacity-0 scale-75">
          <Icon name="fa7-solid:quote-left" />
          Kami percaya, setiap proyek — besar atau kecil — layak mendapatkan hasil terbaik dari material dan pemasangan yang sempurna.
          <Icon name="fa7-solid:quote-right" />
        </blockquote>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const containerRef = ref<HTMLElement | null>( null )
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
                ease     : "bounce.out",
                scale    : 1,
                duration : 1,
                opacity  : 1,
                delay    : 0.2,
            } )
        }

    }, ( containerRef.value as HTMLElement ) )

} )
onBeforeUnmount( () => {
    if ( ctx ) ctx.revert()
} )
</script>