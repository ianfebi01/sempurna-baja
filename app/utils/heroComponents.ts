import type { Component } from "vue"

// There's a limitation with dynamic imports in Rollup that prevents using variables in the import path.
// https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
// This is why we hard code the component paths here twice per component rather than making a nice function that keeps it DRY.
export const heroComponents = ( resolve: boolean = true ): Record<string, string|Promise<Component>> => ( {
    "mainHero": !resolve ? "./app/components/heroes/Main.vue" : import( "@/components/heroes/Main.vue" ),
    "simpleHero": !resolve ? "./app/components/heroes/Simple.vue" : import( "@/components/heroes/Simple.vue" ),
    "videoHero": !resolve ? "./app/components/heroes/Video.vue" : import( "@/components/heroes/Video.vue" ),
} )
