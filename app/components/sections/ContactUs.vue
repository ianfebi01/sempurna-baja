<template>
  <section ref="containerRef" class="bg-gray-100">
    <div class="main-container p-20">
      <h2 class="h1 mt-0 text-center mb-12">Hubungi Kami</h2>
      <div class="flex flex-col-reverse md:flex-row gap-8 md:gap-0">
        <div class="md:basis-1/2 flex items-center">
          <ul ref="textRef" class="list-none m-0 opacity-0 translate-y-8">
            <li class="flex items-center gap-4">
              <Icon name="fa7-solid:location-dot" /> Alamat: Semanu, Gunungkidul, Yogyakarta
            </li>
            <li class="flex items-center gap-4">
              <Icon name="fa7-solid:phone" />Telepon/WA: <b>081999980596</b>
            </li>
            <li class="flex items-center gap-4">
              <Icon name="fa7-solid:envelope" /> Email: <a
                href="mailto:ardynugroho3502@gmail.com">Ardynugroho3502@gmail.com</a>
            </li>
          </ul>
        </div>
        <div class="md:basis-1/2 flex flex-col justify-center">
          <div
            ref="imageRef"
            class="overflow-hidden aspect-square rounded-2xl max-md:max-w-80 relative p-8 mx-auto opacity-0 translate-y-8">
            <img
              src="@/assets/images/calling-88.svg"
              alt="Calling"
              width="500"
              height="500"
              loading="eager"
              class="object-contain w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const containerRef = ref<HTMLElement | null>( null )
const imageRef = ref<HTMLElement | null>( null )
const textRef = ref<HTMLElement | null>( null )

let ctx: gsap.Context | null = null

onMounted( async () => {
    if ( !import.meta.client ) return

    // Lazy import GSAP & plugins only in browser
    const gsap = ( await import( "gsap" ) ).default
    const { ScrollTrigger } = await import( "gsap/ScrollTrigger" )
    const { TextPlugin } = await import( "gsap/TextPlugin" )

    gsap.registerPlugin( ScrollTrigger, TextPlugin )

    if ( !containerRef.value ) return

    ctx = gsap.context( () => {
        const tl = gsap.timeline( {
            scrollTrigger: {
                trigger       : containerRef.value,
                start         : "top 75%",
                toggleActions : "play none none none",
            },
        } )

        if ( imageRef.value ) {
            tl.to( imageRef.value, {
                ease       : "power2.out",
                translateY : 0,
                duration   : 1,
                opacity    : 1,
                delay      : 0.2,
            } )
        }

        if ( textRef.value ) {
            tl.to( textRef.value, {
                ease       : "power2.out",
                translateY : 0,
                duration   : 1,
                opacity    : 1,
                delay      : 0.4,
            }, "<" )
        }
    }, containerRef.value )
} )

onBeforeUnmount( () => {
    ctx?.revert()
} )
</script>
