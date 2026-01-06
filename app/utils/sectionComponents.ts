import type { Component } from "vue"

// There's a limitation with dynamic imports in Rollup that prevents using variables in the import path.
// https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
// This is why we hard code the component paths here twice per component rather than making a nice function that keeps it DRY.
export const sectionComponents = (resolve: boolean = true): Record<string, string | Promise<Component>> => ({
    "aboutUs": !resolve ? "./app/components/sections/AboutUs.vue" : import("@/components/sections/AboutUs.vue"),
    "catalog": !resolve ? "./app/components/sections/Catalog.vue" : import("@/components/sections/Catalog.vue"),
    "contactUs": !resolve ? "./app/components/sections/ContactUs.vue" : import("@/components/sections/ContactUs.vue"),
    "quote": !resolve ? "./app/components/sections/Quote.vue" : import("@/components/sections/Quote.vue"),
    "service": !resolve ? "./app/components/sections/Service.vue" : import("@/components/sections/Service.vue"),
    "testimoni": !resolve ? "./app/components/sections/Testimoni.vue" : import("@/components/sections/Testimoni.vue"),
})