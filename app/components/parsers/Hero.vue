<template>
  <section class="full-width">
    <component
      :is="$hero(hero.type)"
      :data="hero"
      :h1="h1"
    />
  </section>
</template>

<script lang="ts">
interface Banner {
  type: string;
}

export default {
  props: {
    h1: {
      type     : String as PropType<string>,
      required : true,
    },
    hero: {
      type     : Object as PropType<Banner>,
      required : true,
    },
  },
}
</script>
