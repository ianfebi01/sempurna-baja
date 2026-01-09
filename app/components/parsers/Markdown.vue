<script setup lang="ts">
import parseMd from '~/utils/ParseMd'
import 'highlight.js/styles/atom-one-dark.css'

interface Props {
  content: string
  excerpt?: number
}

const props = defineProps<Props>()

/**
 * Truncates HTML string to specified length
 */
const truncate = (html: string, length: number): string => {
  if (!html || !length) return html
  const text = html.replace(/<[^>]*>/g, '')
  if (text.length <= length) return html
  return html.substring(0, length) + '...'
}

const parsedContent = computed(() => {
  if (!props.content) return ''
  
  const parsed = parseMd(props.content)
  
  if (props.excerpt) {
    return truncate(parsed, props.excerpt)
  }
  
  return parsed
})
</script>

<template>
  <div class="body-copy w-full">
    <div v-if="parsedContent" v-html="parsedContent" />
  </div>
</template>
