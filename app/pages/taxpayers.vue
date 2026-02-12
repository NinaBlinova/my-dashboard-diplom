<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { upperFirst } from 'scule'
import type { Row } from '@tanstack/table-core'
import type { Taxpayer } from '~/types'

import AddModal from '~/components/taxpayers/AddModal.vue'
import DeleteModal from '~/components/taxpayers/DeleteModal.vue'

const UAvatar = resolveComponent('UAvatar')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')

const toast = useToast()
const table = useTemplateRef('table')

const columnFilters = ref([{
  id: 'INN',
  value: ''
}])
const columnVisibility = ref()
const rowSelection = ref({ 1: true })

// Получаем данные с обработкой ошибок
// const { data, status } = useFetch<Taxpayer[]>('/api/taxpayers', {
//   default: () => []
// })

const taxpayersData = ref<Taxpayer[]>([])
const totalTaxpayers = ref(0)

function getRowItems(row: Row<Taxpayer>) {
  return [
    {
      type: 'label',
      label: 'Actions'
    },
    {
      label: 'Copy taxpayer ID',
      icon: 'i-lucide-copy',
      onSelect() {
        navigator.clipboard.writeText(row.original.INN)
        toast.add({
          title: 'Copied to clipboard',
          description: 'Taxpayers ID copied to clipboard'
        })
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'View taxpayer details',
      icon: 'i-lucide-list'
    },
    {
      label: 'View taxpayer payments',
      icon: 'i-lucide-wallet'
    },
    {
      type: 'separator'
    },
    {
      label: 'Delete taxpayer',
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect() {
        toast.add({
          title: 'Taxpayer deleted',
          description: 'The taxpayer has been deleted.'
        })
      }
    }
  ]
}

const columns: TableColumn<Taxpayer>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        'modelValue': table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        'ariaLabel': 'Select all'
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        'modelValue': row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        'ariaLabel': 'Select row'
      })
  },
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-3' }, [
        h(UAvatar, {
          src: row.original.avatar?.src || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(row.original.name || 'User')}`,
          size: 'lg'
        }),
        h('div', undefined, [
          h('p', { class: 'font-medium text-highlighted' }, row.original.name),
          h('p', { class: '' }, `@${row.original.name}`)
        ])
      ])
    }
  },
  {
    accessorKey: 'INN',
    header: 'ИНН',
    cell: ({ row }) => h('span', { class: 'font-mono' }, row.original.INN)
  },
  {
    accessorKey: 'registration_district',
    header: 'registration_district',
    cell: ({ row }) => row.original.registration_district
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end'
            },
            items: getRowItems(row)
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto'
            })
        )
      )
    }
  }
]

const INN = computed({
  get: (): string => {
    return (table.value?.tableApi?.getColumn('INN')?.getFilterValue() as string) || ''
  },
  set: (value: string) => {
    table.value?.tableApi?.getColumn('INN')?.setFilterValue(value || undefined)
  }
})

const pagination = reactive({
  pageIndex: 0,
  pageSize: 10
})

const INNFilter = ref('')
// const pageIndex = ref(0)
// const pageSize = ref(10)

async function fetchTaxpayers() {
  const query = new URLSearchParams({
    page: (pagination.pageIndex + 1).toString(),
    pageSize: pagination.pageSize.toString(),
    inn: INNFilter.value || ''
  })

  try {
    const res = await $fetch<{ data: Taxpayer[], total: number }>(`/api/taxpayers?${query.toString()}`)
    taxpayersData.value = res.data
    totalTaxpayers.value = res.total
  } catch (err) {
    console.error('Ошибка при получении налогоплательщиков:', err)
    taxpayersData.value = []
    totalTaxpayers.value = 0
  }
}

watch([() => pagination.pageIndex, () => pagination.pageSize, INNFilter], fetchTaxpayers, { immediate: true })
</script>

<template>
  <UDashboardPanel id="taxpayers">
    <template #header>
      <UDashboardNavbar title="Taxpayer">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <AddModal />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-wrap items-center justify-between gap-1.5">
        <UInput
          v-model="INN"
          class="max-w-sm"
          icon="i-lucide-search"
          placeholder="Filter INN..."
        />

        <div class="flex flex-wrap items-center gap-1.5">
          <DeleteModal :count="table?.tableApi?.getFilteredSelectedRowModel().rows.length">
            <UButton
              v-if="table?.tableApi?.getFilteredSelectedRowModel().rows.length"
              label="Delete"
              color="error"
              variant="subtle"
              icon="i-lucide-trash"
            >
              <template #trailing>
                <UKbd>
                  {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length }}
                </UKbd>
              </template>
            </UButton>
          </DeleteModal>
          <UDropdownMenu
            :items="
              table?.tableApi
                ?.getAllColumns()
                .filter((column: any) => column.getCanHide())
                .map((column: any) => ({
                  label: upperFirst(column.id),
                  type: 'checkbox' as const,
                  checked: column.getIsVisible(),
                  onUpdateChecked(checked: boolean) {
                    table?.tableApi?.getColumn(column.id)?.toggleVisibility(checked)
                  },
                  onSelect(e?: Event) {
                    e?.preventDefault()
                  }
                }))
            "
            :content="{ align: 'end' }"
          >
            <UButton
              label="Display"
              color="neutral"
              variant="outline"
              trailing-icon="i-lucide-settings-2"
            />
          </UDropdownMenu>
        </div>
      </div>

      <UTable
        ref="table"
        v-model:column-filters="columnFilters"
        v-model:column-visibility="columnVisibility"
        v-model:row-selection="rowSelection"
        :pagination="pagination"
        :manual-pagination="true"
        :page-count="Math.ceil(totalTaxpayers / pagination.pageSize)"
        class="shrink-0"
        :data="taxpayersData"
        :columns="columns"
        :ui="{
          base: 'table-fixed border-separate border-spacing-0',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
          td: 'border-b border-default',
          separator: 'h-0'
        }"
      />

      <div class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto">
        <div class="text-sm text-muted">
          {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
          {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
        </div>

        <div class="flex items-center gap-1.5">
          <UPagination
            :page="pagination.pageIndex + 1"
            :items-per-page="pagination.pageSize"
            :total="totalTaxpayers"
            @update:page="(p: number) => pagination.pageIndex = p - 1"
            @update:items-per-page="(size: number) => pagination.pageSize = size"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
