<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Produk" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            label="Tambah Produk"
            icon="i-lucide-plus"
            color="neutral"
            to="/admin/add-product" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-wrap items-center justify-between gap-1.5">
        <UInput
          :model-value="(table?.tableApi?.getColumn('name')?.getFilterValue() as string)"
          class="max-w-sm"
          icon="i-lucide-search"
          placeholder="Filter produk..."
          @update:model-value="table?.tableApi?.getColumn('name')?.setFilterValue($event)" />

        <div class="flex flex-wrap items-center gap-1.5">
          <CustomersDeleteModal :count="table?.tableApi?.getFilteredSelectedRowModel().rows.length">
            <UButton
              v-if="table?.tableApi?.getFilteredSelectedRowModel().rows.length"
              label="Delete"
              color="error"
              variant="subtle"
              icon="i-lucide-trash">
              <template #trailing>
                <UKbd>
                  {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length }}
                </UKbd>
              </template>
            </UButton>
          </CustomersDeleteModal>

          <USelect
            v-model="statusFilter"
            :items="[
              { label: 'All', value: 'all' },
              { label: 'Subscribed', value: 'subscribed' },
              { label: 'Unsubscribed', value: 'unsubscribed' },
              { label: 'Bounced', value: 'bounced' }
            ]"
            :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
            placeholder="Filter status"
            class="min-w-28" />
          <UDropdownMenu
            :items="table?.tableApi
              ?.getAllColumns()
              .filter((column: any) => column.getCanHide())
              .map((column: any) => ({
                label: upperFirst(column.id),
                type: 'checkbox' as const,
                checked: column.getIsVisible(),
                onUpdateChecked(checked: boolean) {
                  table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
                },
                onSelect(e?: Event) {
                  e?.preventDefault()
                }
              }))
            "
            :content="{ align: 'end' }">
            <UButton
              label="Display"
              color="neutral"
              variant="outline"
              trailing-icon="i-lucide-settings-2" />
          </UDropdownMenu>
        </div>
      </div>

      <UTable
        ref="table"
        v-model:column-filters="columnFilters"
        v-model:column-visibility="columnVisibility"
        v-model:row-selection="rowSelection"
        v-model:pagination="pagination"
        :pagination-options="{
          getPaginationRowModel: getPaginationRowModel()
        }"
        class="shrink-0"
        :data="data"
        :columns="columns"
        :loading="status === 'pending'"
        :ui="{
          base: 'table-fixed border-separate border-spacing-0',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
          td: 'border-b border-default',
          separator: 'h-0'
        }" />

      <div class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto">
        <div class="text-sm text-muted">
          {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
          {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
        </div>

        <div class="flex items-center gap-1.5">
          <UPagination
            :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="table?.tableApi?.getFilteredRowModel().rows.length"
            @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)" />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { upperFirst } from "scule"
import { getPaginationRowModel } from "@tanstack/table-core"
import type { Product } from "#shared/types/product"

definePageMeta( {
  layout     : "admin",
  middleware : "auth",
} )
const router = useRouter()
const UAvatar = resolveComponent( "UAvatar" )
const UButton = resolveComponent( "UButton" )
const UTooltip = resolveComponent( "UTooltip" )
const UDropdownMenu = resolveComponent( "UDropdownMenu" )
const UCheckbox = resolveComponent( "UCheckbox" )

const table = useTemplateRef( "table" )

const columnFilters = ref( [{
  id    : "name",
  value : "",
}] )
const columnVisibility = ref()
const rowSelection = ref()

const { data, status } = await useFetch<Product[]>( "/api/products", {
  lazy: true,
} )


const columns: TableColumn<Product>[] = [
  // Select column
  {
    id     : "select",
    header : ( { table } ) =>
      h( UCheckbox, {
        "modelValue": table.getIsSomePageRowsSelected()
          ? "indeterminate"
          : table.getIsAllPageRowsSelected(),
        "onUpdate:modelValue": ( value: boolean | "indeterminate" ) =>
          table.toggleAllPageRowsSelected( !!value ),
        "ariaLabel": "Select all",
      } ),
    cell: ( { row } ) =>
      h( UCheckbox, {
        "modelValue"          : row.getIsSelected(),
        "onUpdate:modelValue" : ( value: boolean | "indeterminate" ) =>
          row.toggleSelected( !!value ),
        "ariaLabel": "Select row",
      } ),
  },

  // ID column
  {
    accessorKey : "id",
    header      : "ID",
  },

  // Product name + image column
  {
    accessorKey : "name",
    header      : ( { column } ) => {
      const isSorted = column.getIsSorted()

      return h( UButton, {
        color   : "neutral",
        variant : "ghost",
        label   : "Produk",
        icon    : isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class   : "-mx-2.5",
        onClick : () => column.toggleSorting( isSorted === "asc" ),
      } )
    },
    cell: ( { row } ) => {
      const product = row.original
      return h( "div", { class: "flex items-center gap-3" }, [
        h( UAvatar, {
          src  : product.image,
          size : "lg",
        } ),
        h( "div", undefined, [
          h( "p", { class: "font-medium text-highlighted" }, product.name ),
          h( "p", { class: "text-sm text-muted" }, product.brand ),
        ] ),
      ] )
    },
  },

  // Slug
  {
    accessorKey : "slug",
    header      : "Slug",
  },

  // Category
  {
    accessorKey : "category",
    header      : "Kategori",
  },

  // Price
  {
    accessorKey : "price",
    header      : "Harga",
    cell        : ( { row } ) => `Rp ${row.original.price.toLocaleString()} /${row.original.unit}`,
  },

  // Description
  {
    accessorKey : "description",
    header      : "Deskripsi",
    cell        : ( { row } ) => {
      const desc = row.original.description
      return h(

        UTooltip,
        {
          side  : "top",
          align : "start",
          class : "max-w-xs whitespace-pre-line text-sm",
          ui    : {
            base    : "h-full",
            content : "max-w-xs h-auto",
          },
        },
        {
          default: () =>
            h(
              "p",
              { class: "text-sm text-muted line-clamp-2 cursor-help" },
              desc,
            ),
          content: () =>
            h(
              "div",
              { class: "max-w-xs whitespace-pre-line break-words text-sm" },
              desc,
            ),
        },

      )
    },
  },

  // Actions
  {
    id     : "actions",
    header : "",
    cell   : ( { row } ) =>
      h(
        "div",
        { class: "text-right" },
        h(
          UDropdownMenu,
          {
            content : { align: "end" },
            items   : [
              {
                label    : "Lihat", icon     : "i-lucide-eye", onSelect : () => {
                  const route = router.resolve( {
                    name   : "products-slug",
                    params : { slug: row.original.slug },
                  } )
                  window.open( route.href, "_blank" )
                },
              },
              { label: "Edit", icon: "i-lucide-pencil", onSelect: () => console.log( "Edit", row.original ) },
              { label: "Delete", icon: "i-lucide-trash", onSelect: () => console.log( "Delete", row.original ) },
            ],
          },
          () =>
            h( UButton, {
              icon    : "i-lucide-ellipsis-vertical",
              color   : "neutral",
              variant : "ghost",
              class   : "ml-auto",
            } ),
        ),
      ),
  },
]

const statusFilter = ref( "all" )

watch( () => statusFilter.value, ( newVal ) => {
  if ( !table?.value?.tableApi ) return

  const statusColumn = table.value.tableApi.getColumn( "status" )
  if ( !statusColumn ) return

  if ( newVal === "all" ) {
    statusColumn.setFilterValue( undefined )
  } else {
    statusColumn.setFilterValue( newVal )
  }
} )

const pagination = ref( {
  pageIndex : 0,
  pageSize  : 10,
} )
</script>
