import { defineAsyncComponent } from "vue"
import { sectionComponents } from "@/utils/sectionComponents"

export default defineNuxtPlugin( () => {
  const resolveSectionComponent = ( id: string ) => {
    const components = sectionComponents()
    const component = components[id]

    if ( !component ) {
      console.warn( `Section component with id "${id}" not found.` )

      return null
    }

    if ( typeof component === "string" ) {
      console.warn( `Section component with id "${id}" is a string, cannot resolve dynamically.` )

      return null
    }

    // Use defineAsyncComponent to handle the promise
    return defineAsyncComponent( () => component )
  }

  return {
    provide: {
      section: resolveSectionComponent,
    },
  }
} )
