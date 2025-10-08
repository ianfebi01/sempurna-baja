<template>
  <section ref="containerRef" class="bg-gray-100">
    <div class="main-container p-20">
      <div class="max-w-2xl mx-auto mb-12">
        <h2 class="h1 mt-0 text-center">Jasa Pemasangan Baja Ringan, Atap, & Plafon</h2>
      </div>
      <div class="flex flex-col md:flex-row gap-8 md:gap-0">
        <div class="md:basis-1/2 flex items-center md:pr-8">
          <div class="max-w-xl">
            <p>Kami menyediakan pemasangan atap galvalum, rangka baja ringan, plafon, dan genteng pasir untuk rumah,
              ruko,
              gudang, kos, bengkel, hingga proyek komersial. Kami utamakan kerapian, ketepatan waktu, dan keamanan.</p>
          </div>
        </div>
        <div ref="text2Ref" class="md:basis-1/2 md:pl-8 flex flex-col justify-center  opacity-0 translate-y-8">
          <h3 class="text-xl font-bold">Proses Kerja (4 langkah):</h3>
          <ul class="space-y-2 text-lg text-gray-800 list-decimal list-outside">
            <li class="m-0">
              <b>Survey & Estimasi Gratis</b> &ndash; Tim kami cek lokasi & ukur kebutuhan material.
            </li>
            <li>
              <b>Rekomendasi Spesifikasi</b> &ndash; Pilih ketebalan & merek sesuai anggaran.
            </li>
            <li>
              <b>Pengerjaan Rapi & Cepat</b> &ndash; Dikerjakan oleh tukang berpengalaman.
            </li>
            <li>
              <b>Serah Terima</b> &ndash; Cek hasil pemasangan.
            </li>
          </ul>
        </div>
      </div>
      <NuxtLink :to="`https://wa.me/6283144512987`" class="button button-primary mx-auto mt-12">
        <Icon name="fa7-solid:paper-plane" />
        Pesan sekarang
      </NuxtLink>
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