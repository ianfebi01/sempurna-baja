import type {
  DehydratedState,
  VueQueryPluginOptions,
} from "@tanstack/vue-query"
import {
  VueQueryPlugin,
  QueryClient,
  hydrate,
  dehydrate,
} from "@tanstack/vue-query"
// Nuxt 3 app aliases
import { defineNuxtPlugin, useState } from "#imports"

export default defineNuxtPlugin( ( nuxt ) => {
  const vueQueryState = useState<DehydratedState | null>( "vue-query" )

  // Modify your Vue Query global settings here
  const queryClient = new QueryClient( {
    defaultOptions: {
      queries: {
        staleTime : 5 * 60 * 1000, // 5 minutes
        gcTime    : import.meta.server ? 0 : 30 * 60 * 1000, // No GC timer on server to allow process exit
      },
    },
  } )

  const options: VueQueryPluginOptions = { queryClient }

  nuxt.vueApp.use( VueQueryPlugin, options )

  if ( import.meta.server ) {
    nuxt.hooks.hook( "app:rendered", () => {
      vueQueryState.value = dehydrate( queryClient )
      // Clear the query cache after dehydrating to allow process to exit
      queryClient.clear()
    } )
  }

  if ( import.meta.client ) {
    hydrate( queryClient, vueQueryState.value )
  }
} )
