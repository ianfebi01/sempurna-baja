<template>
  <UAuthForm
    :schema="schema"
    title="Masuk"
    description="Masuk ke akun Anda"
    icon="i-lucide-user"
    :fields="fields"
    @submit="onSubmit">
    <template #description>
      Belum punya akun? <ULink to="/register" class="text-primary font-medium">Daftar</ULink>.
    </template>
  </UAuthForm>
</template>

<script setup lang="ts">
import * as z from "zod"
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui"
import { useAuth } from "~/compossables/useAuth"

definePageMeta( {
    layout     : "auth",
    middleware : "auth",
} )

const toast = useToast()

const fields: AuthFormField[] = [{
    name        : "email",
    type        : "email",
    label       : "Email",
    placeholder : "Enter your email",
    required    : true,
}, {
    name        : "password",
    label       : "Password",
    type        : "password",
    placeholder : "Enter your password",
    required    : true,
}]

const schema = z.object( {
    email    : z.email( "Invalid email" ),
    password : z.string( "Password is required" ).min( 8, "Must be at least 8 characters" ),
} )

type Schema = z.output<typeof schema>

async function onSubmit( payload: FormSubmitEvent<Schema> ) {
    const loginForm = payload.data
    await login( loginForm )
}

const { me } = useAuth()
const emit = defineEmits( ["onLogin", "onRegister", "onError"] )

async function login( loginForm: Schema ) {
    try {
        const data = await $fetch( "/api/auth/login", { method: "POST", body: loginForm } )
        if ( data.loggedIn ) {
            me()
            emit( "onLogin", data.user )
            toast.add( {
                title       : "Berhasil Masuk",
                icon        : "i-ph-sign-in",
                description : `${data.user} berhasil masuk.`,
            } )
            navigateTo( "/admin" )
        }
    } catch ( error: unknown ) {
        emit( "onError", error )
    }
}
</script>