<template>
  <div class="landing-page">
    <div class="sticky top-0 left-0 z-40 print:hidden bg-white shadow-sm">
      <Header />
    </div>
    <div class="grow">
      <slot></slot>
    </div>
    <Footer />
  </div>
</template>
<script lang="ts" setup>
import "~/assets/css/main.css"
</script>