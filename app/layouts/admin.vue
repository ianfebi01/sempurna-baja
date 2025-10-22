<script setup lang="ts">
import "~/assets/css/admin.css"
import type { NavigationMenuItem } from "@nuxt/ui"

const open = ref( false )

const items: NavigationMenuItem[][] = [
    [
        {
            label : "Produk",
            icon  : "fa7-solid:bag-shopping",
            href  : "/admin",
        },
    ],
]
</script>

<template>
  <UApp>
    <div>
      <UDashboardGroup unit="rem">
        <UDashboardSidebar
          v-model:open="open"
          collapsible
          resizable
          :ui="{ footer: 'border-t border-default' }">
          <template #header>
            <div class="overflow-hidden aspect-square size-10">
              <img
                src="/sempurna-baja-logo.svg"
                alt="Logo"
                width="40"
                height="40"
                class="w-full h-full object-contain object-center" />
            </div>
          </template>

          <template #default="{ collapsed }">
            <UButton
              :label="collapsed ? undefined : 'Search...'"
              icon="i-lucide-search"
              color="primary"
              variant="outline"
              block
              :square="collapsed">
              <template v-if="!collapsed" #trailing>
                <div class="flex items-center gap-0.5 ms-auto">
                  <UKbd value="meta" variant="subtle" />
                  <UKbd value="K" variant="subtle" />
                </div>
              </template>
            </UButton>

            <UNavigationMenu :collapsed="collapsed" :items="items[0]" orientation="vertical" />
          </template>

          <template #footer="{ collapsed }">
            <UButton
              :avatar="{
                src: 'https://github.com/benjamincanac.png',
              }"
              :label="collapsed ? undefined : 'Benjamin'"
              color="neutral"
              variant="ghost"
              class="w-full"
              :block="collapsed" />
          </template>
        </UDashboardSidebar>
        <slot></slot>
      </UDashboardGroup>
    </div>
  </UApp>
</template>
