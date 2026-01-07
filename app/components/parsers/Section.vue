<template>
  <section v-for="(section, index) in sections" :key="index">
    <div>
      <component :is="$section(section.type)" :section-data="section" />
    </div>
  </section>
</template>

<script lang="ts">

interface Section {
  type: string;
}

export default {
  props: {
    sections: {
      type     : Array as PropType<Array<Section>>,
      required : true,
    },
  },
}
</script>
