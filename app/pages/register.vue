<template>
  <UAuthForm
    :schema="schema"
    title="Daftar"
    description="Buat akun"
    icon="i-lucide-user"
    :fields="fields"
    @submit="onSubmit" >
    <template #description>
      Sudah punya akun? <ULink to="/login" class="text-primary font-medium">Masuk</ULink>.
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
    const registerForm = payload.data
    await register( registerForm )
}

const { me } = useAuth()
const emit = defineEmits( ["onLogin", "onRegister", "onError"] )

async function register( registerForm: Schema ) {
    try {
        const data = await $fetch( "/api/auth/register", { method: "POST", body: registerForm } )
        if ( data.registered ) {
            me()
            emit( "onRegister", data.user )
            navigateTo( "/admin" )
            toast.add( {
                title       : "Berhasil Membuat Akun",
                icon        : "i-ph-sign-in",
                description : `${data.user} berhasil dibuat dan masuk.`,
            } )
        }
    } catch ( error: unknown ) {
        emit( "onError", error )
    }
}
</script>