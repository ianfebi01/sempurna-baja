<script setup lang="ts">
import "~/assets/css/admin.css"
import type { NavigationMenuItem } from "@nuxt/ui"
import { useAuth } from "~/compossables/useAuth"

const toast = useToast()
const router = useRouter()
const open = ref( false )
const { loggedIn, user, clear } = useAuth()

const items: NavigationMenuItem[][] = [
  [
    {
      label : "Produk",
      icon  : "fa7-solid:bag-shopping",
      href  : "/admin",
    },
  ],
]

const profileDropdownItems = [
  [
    {
      label    : "Akun",
      slot     : "account",
      disabled : true,
    },
  ],
  [
    {
      label : "Profile",
      icon  : "i-ph-user-duotone",
      click : () => router.replace( { name: "profile" } ),
    },
  ],
  [
    {
      label    : "Sign out",
      icon     : "i-ph-sign-out",
      onSelect : async () => {
        await clear()
        router.replace( { path: "/" } )
        toast.add( {
          color       : "error",
          title       : "Logged out!",
          icon        : "i-ph-sign-out",
          description : "user signed out successfully.",
        } )
      },
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
            <UDropdownMenu v-if="loggedIn" :items="profileDropdownItems" mode="hover">
              <UButton variant="link" class="p-0 cursor-pointer">
                <UAvatar :src="`https://unavatar.io/gravatar/${user.email}`" class="bg-gray-200 dark:bg-neutral-800" />
                <p v-if="!collapsed" class="truncate">{{ user.email }}</p>
              </UButton>

              <template #account>
                <div class="text-left w-full">
                  <p>
                    Signed in as
                  </p>
                  <p class="truncate font-medium">
                    {{ user.email }}
                  </p>
                </div>
              </template>
            </UDropdownMenu>
          </template>
        </UDashboardSidebar>
        <slot></slot>
      </UDashboardGroup>
    </div>
  </UApp>
</template>
