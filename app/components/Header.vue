<template>
  <nav class="main-container flex items-center gap-8 h-16">
    <NuxtLink to="/" class="no-underline text-black font-extralight">
      Beranda
    </NuxtLink>
    <NuxtLink to="/#katalog" class="no-underline text-black font-extralight" @click="scrollToSection('katalog')">
      Katalog
    </NuxtLink>
    <div class="grow"></div>
    <NuxtLink :to="`https://wa.me/6281999980596`" class="button button-primary">
      <Icon name="fa7-solid:paper-plane" />
      Kontak
    </NuxtLink>
  </nav>
</template>