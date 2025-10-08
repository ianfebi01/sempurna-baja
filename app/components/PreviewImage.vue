<template>
  <Teleport to="body">
    <TransitionRoot appear :show="modelValue" as="template">
      <Dialog as="div" class="relative z-50" @close="emit('closeModal')">
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

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95">
              <DialogPanel
                class="h-fit max-h-screen max-w-screen flex items-center mx-auto transform overflow-hidden align-middle shadow-xl transition-all">
                <img
                  :src="selectedImage"
                  alt="Preview image"
                  class="object-contain max-w-[calc(100vw-64px)] max-h-[calc(100vh-64px)]"
                  loading="lazy"
                  :fetchpriority="'auto'"
                  format="webp" />
                <button
                  class="absolute right-1 top-1 lg:right-2 lg:top-2 text-white size-6 lg:size-10 ring-0 outline-none hover:text-soft-grey transition-all duration-300 ease-in-out"
                  @click="emit('closeModal')">
                  <Icon name="fa7-solid:xmark" />
                </button>

              </DialogPanel>
            </TransitionChild>
          </div>
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

interface Props {
  modelValue: boolean
  selectedImage: string
}
defineProps<Props>()

const emit = defineEmits( ["closeModal"] )
</script>