<script setup lang="ts">
import * as z from "zod"
import type { FormSubmitEvent } from "@nuxt/ui"

const schema = z.object( {
  image       : z.string().url( "Invalid image URL" ).or( z.string().startsWith( "/" ) ).optional(),
  name        : z.string().min( 2, "Name too short" ),
  slug        : z.string().min( 2, "Slug too short" ),
  description : z.string().min( 10, "Description too short" ),
  category    : z.string().min( 2, "Category too short" ),
  price       : z.number().min( 1000, "Minimal price is 1000" ),
  unit        : z.string().min( 1, "Unit required" ),
  brand       : z.string().min( 2, "Brand too short" ),
} )

const open = ref( false )

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>( {
  image       : "",
  name        : "",
  slug        : "",
  description : "",
  category    : "",
  price       : undefined,
  unit        : "",
  brand       : "",
} )

const toast = useToast()
async function onSubmit( event: FormSubmitEvent<Schema> ) {
  toast.add( { title: "Sukses", description: `Sukses menambahkan produk ${event.data.name}`, color: "success" } )
  open.value = false
}
</script>

<template>
  <UModal v-model:open="open" title="Tambah Produk" description="Tambahkan produk ke database">
    <UButton label="Tambah Produk" icon="i-lucide-plus" color="neutral" />

    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit">
        <UFormField label="Gambar (URL)" name="image">
          <UInput v-model="state.image" placeholder="/images/sempurna-baja-5.webp" class="w-full" />
        </UFormField>

        <UFormField label="Nama Produk" name="name">
          <UInput v-model="state.name" placeholder="Galvalum 0.30" class="w-full" />
        </UFormField>

        <UFormField label="Slug" name="slug">
          <UInput v-model="state.slug" placeholder="galvalum-030-zenium" class="w-full" />
        </UFormField>

        <UFormField label="Deskripsi" name="description">
          <UTextarea
            v-model="state.description"
            placeholder="Lapisan aluminium dan zinc yang melindungi dari karat..."
            class="w-full" />
        </UFormField>

        <UFormField label="Kategori" name="category">
          <UInput v-model="state.category" placeholder="Galvalum" class="w-full" />
        </UFormField>

        <UFormField label="Harga (Rp)" name="price">
          <UInput
            v-model="state.price"
            type="number"
            placeholder="40000"
            class="w-full" />
        </UFormField>

        <UFormField label="Satuan" name="unit">
          <UInput v-model="state.unit" placeholder="m" class="w-full" />
        </UFormField>

        <UFormField label="Brand" name="brand">
          <UInput v-model="state.brand" placeholder="Zenium" class="w-full" />
        </UFormField>
        <div class="flex justify-end gap-2">
          <UButton
            label="Batal"
            color="primary"
            variant="subtle"
            @click="open = false" />
          <UButton
            label="Buat Produk"
            color="neutral"
            variant="solid"
            type="submit" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
