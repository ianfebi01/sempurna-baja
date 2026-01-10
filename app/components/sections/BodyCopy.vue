<script lang="ts" setup>
import type { BodyCopySection } from "~~/shared/types/page"

const props = defineProps<{
  sectionData: BodyCopySection
}>()

const containerRef = ref<HTMLElement | null>( null )

/**
 * Determine if layout should be 2 columns (when 2 items)
 */
const isTwoColumns = computed( () => props.sectionData.items.length === 2 )
</script>

<template>
  <section ref="containerRef" class="bg-gray-100">
    <div class="main-container p-20">
      <div class="max-w-2xl mx-auto mb-12">
        <h2 class="h1 mt-0 text-center">{{ sectionData.title }}</h2>
      </div>

      <!-- Dynamic grid: 1 col for 1 item, 2 cols for 2 items on lg+ -->
      <div
        class="flex flex-col gap-8"
        :class="{ 'md:flex-row md:gap-0': isTwoColumns }"
      >
        <div
          v-for="(item, index) in sectionData.items"
          :key="index"
          class="flex items-center"
          :class="{
            'md:basis-1/2 md:pr-8': isTwoColumns && index === 0,
            'md:basis-1/2 md:pl-8': isTwoColumns && index === 1,
          }"
        >
          <div :class="{ 'max-w-xl': isTwoColumns }">
            <ParsersMarkdown :content="item.content" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>