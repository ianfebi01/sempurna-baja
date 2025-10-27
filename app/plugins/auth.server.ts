import { useAuth } from "~/compossables/useAuth"

export default defineNuxtPlugin( {
  name: "mongoose-auth-plugin",
  async setup() {
    await useAuth().me()
  },
} )
