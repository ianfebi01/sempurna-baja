<template>
  <nav class="flex items-center gap-1" aria-label="Pagination">
    <!-- Previous Button -->
    <button
      type="button"
      :disabled="currentPage <= 1"
      class="inline-flex items-center justify-center size-9 rounded-lg border border-gray-300 bg-white text-sm font-medium transition-colors duration-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
      aria-label="Previous page"
      @click="goToPage(currentPage - 1)">
      <Icon name="fa7-solid:chevron-left" class="size-3" />
    </button>

    <!-- Page Numbers -->
    <template v-for="page in displayedPages" :key="page">
      <span
        v-if="page === 'ellipsis-start' || page === 'ellipsis-end'"
        class="inline-flex items-center justify-center size-9 text-gray-500">
        ...
      </span>
      <button
        v-else
        type="button"
        class="inline-flex items-center justify-center size-9 rounded-lg border text-sm font-medium transition-colors duration-200"
        :class="[
          page === currentPage
            ? 'bg-black text-white border-black'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        ]"
        :aria-current="page === currentPage ? 'page' : undefined"
        @click="goToPage(page as number)">
        {{ page }}
      </button>
    </template>

    <!-- Next Button -->
    <button
      type="button"
      :disabled="currentPage >= totalPages"
      class="inline-flex items-center justify-center size-9 rounded-lg border border-gray-300 bg-white text-sm font-medium transition-colors duration-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
      aria-label="Next page"
      @click="goToPage(currentPage + 1)">
      <Icon name="fa7-solid:chevron-right" class="size-3" />
    </button>
  </nav>
</template>

<script lang="ts" setup>
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    /** Current active page (1-indexed) */
    page?: number
    /** Number of items per page */
    itemsPerPage?: number
    /** Total number of items */
    total?: number
    /** Number of sibling pages to show on each side */
    siblingCount?: number
  }>(),
  {
    page         : 1,
    itemsPerPage : 10,
    total        : 0,
    siblingCount : 1,
  },
)

const emit = defineEmits<{
  "update:page": [page: number]
}>()

const currentPage = computed( () => props.page )

const totalPages = computed( () =>
  Math.max( 1, Math.ceil( props.total / props.itemsPerPage ) ),
)

const displayedPages = computed( () => {
  const pages: ( number | string )[] = []
  const total = totalPages.value
  const current = currentPage.value
  const siblings = props.siblingCount

  // Always show first page
  pages.push( 1 )

  // Calculate start and end of sibling range
  const siblingStart = Math.max( 2, current - siblings )
  const siblingEnd = Math.min( total - 1, current + siblings )

  // Add ellipsis after first page if needed
  if ( siblingStart > 2 ) {
    pages.push( "ellipsis-start" )
  }

  // Add sibling pages
  for ( let i = siblingStart; i <= siblingEnd; i++ ) {
    if ( i !== 1 && i !== total ) {
      pages.push( i )
    }
  }

  // Add ellipsis before last page if needed
  if ( siblingEnd < total - 1 ) {
    pages.push( "ellipsis-end" )
  }

  // Always show last page (if more than 1 page)
  if ( total > 1 ) {
    pages.push( total )
  }

  return pages
} )

const goToPage = ( page: number ) => {
  if ( page >= 1 && page <= totalPages.value ) {
    emit( "update:page", page )
  }
}
</script>
