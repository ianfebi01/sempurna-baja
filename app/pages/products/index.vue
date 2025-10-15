<template>
  <section id="katalog" ref="componentRef">
    <div class="main-container p-20">
      <h1 class="mt-0 mb-12">Produk dari Sempurna Baja</h1>

      <!-- FILTER BAR -->
      <div class="flex flex-wrap gap-4 mb-12">
        <!-- Search -->
        <input
          v-model="filters.q"
          type="text"
          placeholder="Cari produk..."
          class="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-64 h-10 focus:ring-1 focus:ring-black focus:outline-none transition-colors duration-300 ease-in-out hover:bg-gray-50" />

        <!-- Category Filter -->
        <Menu as="div" class="relative inline-block text-left w-full sm:w-64">
          <div>
            <MenuButton
              class="inline-flex w-full justify-between items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 text-left h-10 focus:ring-1 focus:ring-black focus:outline-none transition-colors duration-300 ease-in-out">
              <span class="line-clamp-1">{{ selectedCategoryLabel }}</span>
              <Icon name="fa7-solid:chevron-down" class="size-4" />
            </MenuButton>
          </div>

          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0">
            <MenuItems
              class="absolute left-0 mt-2 w-full origin-top-left bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              <div class="max-h-[40vh] overflow-y-auto divide-y divide-gray-100">
                <MenuItem>
                  <button
                    type="button"
                    class="block w-full text-left px-4 py-3 text-sm hover:font-bold transition-default"
                    :class="{ 'font-bold': filters.category.length === 0 }"
                    @click="filters.category = []">
                    Semua Kategori
                  </button>
                </MenuItem>
                <MenuItem v-for="(cat, i) in categories" :key="i">
                  <button
                    type="button"
                    class="w-full text-left px-4 py-3 text-sm hover:font-bold flex justify-between items-center transition-default"
                    :class="{ 'font-bold': filters.category.includes(cat) }"
                    @click="toggleCategory(cat)">
                    <span>{{ cat }}</span>
                    <CheckIcon v-if="filters.category.includes(cat)" class="size-4" />
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>

        <!-- Brand Filter -->
        <Menu as="div" class="relative inline-block text-left w-full sm:w-64">
          <div>
            <MenuButton
              class="inline-flex w-full justify-between items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-left font-medium hover:bg-gray-50 h-10 focus:ring-1 focus:ring-black focus:outline-none transition-colors duration-300 ease-in-out">
              <span class="line-clamp-1">{{ selectedBrandLabel }}</span>
              <Icon name="fa7-solid:chevron-down" class="size-4" />
            </MenuButton>
          </div>

          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0">
            <MenuItems
              class="absolute left-0 mt-2 w-full origin-top-left bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              <div class="max-h-[40vh] overflow-y-auto divide-y divide-gray-100">
                <MenuItem>
                  <button
                    type="button"
                    class="block w-full text-left px-4 py-3 text-sm hover:font-bold transition-default"
                    :class="{ 'font-bold': filters.brand.length === 0 }"
                    @click="filters.brand = []">
                    Semua Brand
                  </button>
                </MenuItem>
                <MenuItem v-for="(brand, i) in brands" :key="i">
                  <button
                    type="button"
                    class="w-full text-left px-4 py-3 text-sm hover:font-bold flex justify-between items-center transition-default"
                    :class="{ 'font-bold': filters.brand.includes(brand) }"
                    @click="toggleBrand(brand)">
                    <span>{{ brand }}</span>
                    <CheckIcon v-if="filters.brand.includes(brand)" class="size-4" />
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
        
        <button class="button button-primary h-10" @click="resetFilter">Reset Filter</button>
      </div>

      <!-- PRODUCT GRID -->
      <div
        ref="itemRef"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8 max-w-sm md:max-w-[unset] mx-auto md:mx-[unset] opacity-0 translate-y-8">
        <div v-for="(item) in filteredProducts" :key="item.id">
          <ProductCard :product="item" />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue"
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue"
import products from "@/assets/json/products.json"

const filters = reactive( {
    q        : "",
    category : [] as string[],
    brand    : [] as string[],
} )

const categories = [...new Set( products.map( p => p.category ) )]
const brands = [...new Set( products.map( p => p.brand ) )]

// --- Toggle helpers (reactive-safe)
const toggleCategory = ( cat: string ) => {
    const i = filters.category.indexOf( cat )
    if ( i > -1 ) filters.category.splice( i, 1 )
    else filters.category.push( cat )
}

const toggleBrand = ( brand: string ) => {
    const i = filters.brand.indexOf( brand )
    if ( i > -1 ) filters.brand.splice( i, 1 )
    else filters.brand.push( brand )
}

// ✅ Reactive-safe internal reset
const resetFilter = () => {
    filters.brand.splice( 0 )
    filters.category.splice( 0 )
    filters.q = ""
}

const selectedCategoryLabel = computed( () =>
    filters.category.length === 0
        ? "Semua Kategori"
        : filters.category.join( ", " ),
)

const selectedBrandLabel = computed( () =>
    filters.brand.length === 0 ? "Semua Brand" : filters.brand.join( ", " ),
)

const filteredProducts = computed( () => {
    return products.filter( ( p ) => {
        const q = filters.q.toLowerCase()
        const matchQ =
            !q ||
            p.name.toLowerCase().includes( q ) ||
            p.description?.toLowerCase().includes( q )
        const matchCat =
            filters.category.length === 0 || filters.category.includes( p.category )
        const matchBrand =
            filters.brand.length === 0 || filters.brand.includes( p.brand )
        return matchQ && matchCat && matchBrand
    } )
} )

/**
 * Transition
 */

const itemRef = ref<HTMLDivElement>()
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
                start         : "top 100%",
                toggleActions : "play none none none",
            },
        } )

        if ( itemRef.value ) {
            tl.to( itemRef.value, {
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
</script>
