<template>
  <Teleport to="body">
    <TransitionRoot appear :show="modelValue" as="template">
      <Dialog as="div" class="relative z-50" @close="emit('closeModal')">
        <!-- Overlay -->
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0">
          <div class="fixed inset-0 bg-black/50"></div>
        </TransitionChild>

        <!-- Modal content -->
        <div class="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out transition-all"
            enter-from="opacity-0 scale-75 translate-y-20"
            enter-to="opacity-100 scale-100 translate-y-0"
            leave="duration-200 ease-in transition-all"
            leave-from="opacity-100 scale-100 translate-y-0"
            leave-to="opacity-0 scale-75 translate-y-20">
            <DialogPanel
              class="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-6">
              <button
                class="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition"
                @click="emit('closeModal')">
                <Icon name="fa6-solid:xmark" class="w-5 h-5" />
              </button>

              <h3 class="text-lg font-semibold mb-4 text-center">Bagikan Produk</h3>

              <!-- Share buttons -->
              <div class="flex justify-center gap-5 mb-6">
                <a
                  v-for="(item, i) in shareLinks"
                  :key="i"
                  :href="item.url"
                  target="_blank"
                  rel="noopener"
                  class="flex flex-col items-center gap-1 group no-underline">
                  <div
                    class="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-gray-200 transition">
                    <Icon :name="item.icon" class="text-2xl" />
                  </div>
                  <span class="text-xs font-medium">{{ item.label }}</span>
                </a>
              </div>

              <!-- Share link -->
              <div class="flex items-center justify-between border rounded-lg px-3 py-2 bg-gray-50">
                <input
                  type="text"
                  readonly
                  class="w-full bg-transparent outline-none text-sm"
                  :value="shareUrl" />
                <button class="text-sr-red font-medium ml-3" @click="copyLink">
                  Salin
                </button>
              </div>

              <div
                v-if="copied"
                class="flex items-center justify-end gap-2 mt-2 text-black/80 transition-opacity duration-300">
                <Icon name="fa7-solid:check" class="size-3" />
                <p class="text-xs  text-right  m-0">
                  Tautan disalin!
                </p>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>
  </Teleport>
</template>

<script setup lang="ts">
import {
    Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot,
} from "@headlessui/vue"
import { ref, computed } from "vue"

interface Props {
    modelValue: boolean
    productName: string
    productUrl: string
}
const props = defineProps<Props>()
const emit = defineEmits( ["closeModal"] )
const config = useRuntimeConfig()

const shareUrl = computed( () => props.productUrl )
const copied = ref( false )

const shareLinks = computed( () => {
    const title = props.productName
    const url = props.productUrl

    const message = `Cek produk ini di ${config.public?.siteName || "toko kami"}:
${title}

Lihat detail di sini:
${url}

Segera pesan sebelum kehabisan!`

    return [
        {
            label : "WhatsApp",
            icon  : "fa6-brands:whatsapp",
            url   : `https://wa.me/?text=${encodeURIComponent( message )}`,
        },
        {
            label : "Facebook",
            icon  : "fa6-brands:facebook",
            url   : `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent( url )}`,
        },
        {
            label : "X",
            icon  : "fa6-brands:x-twitter",
            url   : `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `${title} — ${url}`,
            )}`,
        },
        {
            label : "Email",
            icon  : "fa6-solid:envelope",
            url   : `mailto:?subject=${encodeURIComponent(
                `Rekomendasi produk: ${title}`,
            )}&body=${encodeURIComponent( message )}`,
        },
    ]
} )


const copyLink = async () => {
    try {
        await navigator.clipboard.writeText( shareUrl.value )
        copied.value = true
        setTimeout( () => ( copied.value = false ), 2000 )
    } catch ( err ) {
        console.error( "Copy failed", err )
    }
}
</script>
