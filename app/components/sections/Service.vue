<template>
  <section ref="containerRef" class="bg-gray-100">
    <div class="main-container p-20">
      <h2 class="h1 mt-0 text-center mb-12">Layanan Pemasangan</h2>
      <div class="flex flex-col md:flex-row gap-8 md:gap-0">
        <div class="md:basis-1/2 flex items-center">
          <ul ref="text1Ref" class="opacity-0 translate-y-8">
            <li>Pemasangan dinding batu alam (interior &amp; eksterior)</li>
            <li>Taman &amp; kolam batu alam</li>
            <li>Lantai &amp; jalan setapak</li>
            <li>Desain custom sesuai kebutuhan</li>
          </ul>
        </div>
        <div ref="text2Ref" class="md:basis-1/2 flex flex-col justify-center  opacity-0 translate-y-8">
          <h3 class="text-xl font-bold mb-4">Keunggulan:</h3>
          <ul class="space-y-2 text-lg text-gray-800 list-none m-0">
            <li class="flex items-center gap-2">
              <span class="text-green-600">✅</span> Tukang berpengalaman
            </li>
            <li class="flex items-center gap-2">
              <span class="text-green-600">✅</span> Finishing rapi
            </li>
            <li class="flex items-center gap-2">
              <span class="text-green-600">✅</span> Harga transparan
            </li>
            <li class="flex items-center gap-2">
              <span class="text-green-600">✅</span> Garansi pekerjaan
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const containerRef = ref<HTMLElement | null>( null )
const text1Ref = ref<( HTMLElement | null )>( null )
const text2Ref = ref<( HTMLElement | null )>( null )
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

        if ( text1Ref.value ) {
            tl.to( text1Ref.value, {
                ease       : "power2.out",
                translateY : 0,
                duration   : 1,
                opacity    : 1,
                delay      : 0.2,
            } )
        }

        if ( text2Ref.value ) {
            tl.to( text2Ref.value, {
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