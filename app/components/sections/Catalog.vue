<template>
  <section id="katalog" ref="componentRef">
    <div class="main-container p-20">
      <h2 class="h1 mt-0 text-center mb-12">Katalog Produk Batu Alam</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="(item, index) in catalogs.slice(0, 3)"
          :key="index"
          :ref="el => itemsRef[index] = (el as HTMLDivElement)"
          class="aspect-square w-full overflow-hidden rounded-xl opacity-0 translate-y-8 cursor-pointer"
          @click="onClickImage(item)">
          <img
            :src="item"
            :alt="`batu alam ${index}`"
            width="500"
            height="500"
            class="object-cover object-center w-full h-full transition-default hover:scale-105" />
        </div>
      </div>
      <Disclosure v-slot="{ open }" as="div">
        <dl>
          <dd>
            <Transition
              enter-from-class="transform max-h-0 opacity-0"
              enter-to-class="transform opacity-100 duration-500 ease-in-out"
              leave-from-class="transform opacity-100"
              leave-to-class="transform max-h-0 opacity-0 duration-500 ease-in-out">
              <DisclosurePanel as="div" class="flex overflow-y-hidden">
                <div
                  class="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8"
                  @vue:mounted="isOpen = true"
                  @vue:beforeUnmount="isOpen = false">
                  <div
                    v-for="(item, index) in catalogs.slice(3, catalogs.length)"
                    :key="index"
                    class="aspect-square w-full overflow-hidden rounded-xl cursor-pointer"
                    @click="onClickImage(item)">
                    <img
                      :src="item"
                      :alt="`batu alam ${index}`"
                      width="500"
                      height="500"
                      class="object-cover object-center w-full h-full transition-default hover:scale-105" />
                  </div>
                </div>
              </DisclosurePanel>
            </Transition>
          </dd>
          <dt>
            <DisclosureButton
              class="mx-auto mt-12"
              :class="{
                'button button-primary': !open,
                'button button-secondary': open,
              }"
              @click="open ? scrollToTop() : null">
              {{ open ? "Lebih Sedikit" : "Lihat Selengkapnya" }}
            </DisclosureButton>
          </dt>
        </dl>
      </Disclosure>
    </div>
    <PreviewImage v-model="isOpenPreview" :selected-image="selectedImage" @close-modal="isOpenPreview = false" />
  </section>
</template>

<script lang="ts" setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue"
/**
 * Transition
 */

const itemsRef = ref<HTMLDivElement[] | null[]>( [] )
const componentRef = ref<HTMLElement>()
let ctx: gsap.Context | null = null


onMounted( async () => {
        if ( !import.meta.client ) return

    // Lazy import GSAP & plugins only in browser
    const gsap = ( await import( "gsap" ) ).default
    const { ScrollTrigger } = await import( "gsap/ScrollTrigger" )

    gsap.registerPlugin( ScrollTrigger )

    if ( !componentRef.value ) return
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
} )


onBeforeUnmount( () => {
    if ( ctx ) ctx.revert()
} )

/**
 * End Transition
 */

const selectedImage = ref<string>( "" )
const isOpenPreview = ref<boolean>( false )
const isOpen = ref<boolean>( false )

const onClickImage = ( val: string ) => {
    isOpenPreview.value = true
    selectedImage.value = val
}
const catalogs = Array.from( { length: 47 }, ( _, i ) =>
    `/images/batu-alam/batu-alam-${i + 1}.webp`,
)

function scrollToTop() {
    nextTick( () => {
        const element = componentRef.value

        if ( element ) {
            element.scrollIntoView( {
                behavior : "smooth",
                block    : "start",
            } )
        }
    } )
}
</script>