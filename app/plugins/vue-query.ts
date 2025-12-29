import { VueQueryPlugin, QueryClient, hydrate, dehydrate } from "@tanstack/vue-query"

export default defineNuxtPlugin( ( nuxt ) => {
  const queryClient = new QueryClient( {
    defaultOptions: {
      queries: {
        staleTime      : 1000 * 60 * 5, // 5 minutes - data is fresh for this long
        gcTime         : 1000 * 60 * 30, // 30 minutes - cache persists this long
        refetchOnMount : false, // Don't refetch when component mounts if data is fresh
        retry          : 1,
      },
    },
  } )

  nuxt.vueApp.use( VueQueryPlugin, { queryClient } )

  // Handle SSR hydration
  if ( import.meta.server ) {
    nuxt.hooks.hook( "app:rendered", () => {
      nuxt.payload.vueQueryState = dehydrate( queryClient )
    } )
  }

  if ( import.meta.client ) {
    nuxt.hooks.hook( "app:created", () => {
      hydrate( queryClient, nuxt.payload.vueQueryState )
    } )
  }
} )
