<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Produk" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <AdminProductsAddModal />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>

    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta( {
  layout: "admin",
} )
</script>
