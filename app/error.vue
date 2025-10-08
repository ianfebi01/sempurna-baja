<script setup lang="ts">
import type { NuxtError } from "#app"

defineProps( {
  error: Object as () => NuxtError,
} )
</script>

<template>
  <div class="flex flex-col relative min-h-screen">
    <div class="sticky top-0 left-0 z-40 print:hidden bg-white shadow-sm">
      <Header />
    </div>
    <div class="grow flex items-center justify-center relative">
      <div class="absolute inset-x-0 bottom-0 text-gray-100 z-[0]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="currentColor"
            fill-opacity="1"
            d="M0,64L120,58.7C240,53,480,43,720,48C960,53,1200,75,1320,85.3L1440,96L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z" />
        </svg>
      </div>
      <div class="main-container relative z-[1]">
        <div class="flex items-center justify-center flex-col gap-8">
          <h1 class="font-black uppercase text-9xl mt-0">{{ error?.statusCode }}</h1>
          <NuxtLink to="/" class="button button-primary">Kembali ke Beranda</NuxtLink>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>