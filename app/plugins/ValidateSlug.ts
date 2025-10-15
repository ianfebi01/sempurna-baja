import { defineNuxtPlugin } from "nuxt/app"

export default defineNuxtPlugin( () => ( {
    provide: {
        validateSlug: ( val: string | string[] ): boolean => ( typeof val === "string" && val !== "undefined" && /^[؀-ۿ|a-z|0-9|-]+$/.test( val ) ),
    },
} ) )
