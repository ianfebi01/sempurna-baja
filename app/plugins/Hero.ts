import { defineAsyncComponent } from "vue"
import { heroComponents } from "@/utils/heroComponents"

export default defineNuxtPlugin( () => {
  const resolveHeroComponent = ( id: string ) => {
    console.log( "resolveHeroComponent", id )
    const components = heroComponents()
    const component = components[id]

    if ( !component ) {
      console.warn( `Hero component with id "${id}" not found.` )

      return null
    }

    if ( typeof component === "string" ) {
      console.warn( `Hero component with id "${id}" is a string, cannot resolve dynamically.` )

      return null
    }

    // Use defineAsyncComponent to handle the promise
    return defineAsyncComponent( () => component )
  }

  return {
    provide: {
      hero: resolveHeroComponent,
    },
  }
} )
