<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { upperFirst } from 'scule'
import type { Row } from '@tanstack/table-core'
import type { Taxpayer } from '~/types'

// import AddModal from '~/components/taxpayers/AddModal.vue'
// import DeleteModal from '~/components/taxpayers/DeleteModal.vue'

const UAvatar = resolveComponent('UAvatar')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const { t } = useI18n()
const toast = useToast()
const table = useTemplateRef('table')

const columnVisibility = ref()
const rowSelection = ref({ 1: true })

const taxpayersData = ref<Taxpayer[]>([])
const totalTaxpayers = ref(0)

function getRowItems(row: Row<Taxpayer>) {
  return [
    {
      type: 'label',
      label: t('taxpayers.rowActions.label')
    },
    {
      label: t('taxpayers.rowActions.copyInn'),
      icon: 'i-lucide-copy',
      onSelect() {
        navigator.clipboard.writeText(row.original.INN)
        toast.add({
          title: t('taxpayers.toast.copiedTitle'),
          description: t('taxpayers.toast.copiedDescription')
        })
      }
    },
    {
      type: 'separator'
    },
    {
      label: t('taxpayers.rowActions.viewDetails'),
      icon: 'i-lucide-list',
      onSelect() {
        selectedINN.value = row.original.INN
        viewModalOpen.value = true
      }
    },
    {
      type: 'separator'
    }
  ]
}

const columns = computed<TableColumn<Taxpayer>[]>(() => [
  {
    accessorKey: 'id',
    header: t('taxpayers.table.id')
  },
  {
    accessorKey: 'name',
    header: t('taxpayers.table.fullName'),
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
    header: t('taxpayers.table.inn'),
    cell: ({ row }) => h('span', { class: 'font-mono' }, row.original.INN)
  },
  {
    accessorKey: 'registration_district',
    header: t('taxpayers.table.registrationAddress'),
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
])

const INNFilter = ref('')

const pagination = reactive({
  pageIndex: 0,
  pageSize: 10
})

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

const selectedINN = ref<string | null>(null)
const viewModalOpen = ref(false)

watch([() => pagination.pageIndex, () => pagination.pageSize, INNFilter], fetchTaxpayers, { immediate: true })
const debouncedINNFilter = refDebounced(INNFilter, 300)
watch(debouncedINNFilter, () => {
  pagination.pageIndex = 0
})
</script>

<template>
  <UDashboardPanel id="taxpayers">
    <template #header>
      <UDashboardNavbar :title="t('taxpayers.title')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <!--          <AddModal /> -->
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-wrap items-center justify-between gap-1.5">
        <UInput
          v-model="INNFilter"
          class="max-w-sm"
          icon="i-lucide-search"
          :placeholder="t('taxpayers.filterPlaceholder')"
        />

        <div class="flex flex-wrap items-center gap-1.5">
          <!--          <DeleteModal :count="table?.tableApi?.getFilteredSelectedRowModel().rows.length"> -->
          <!--            ... -->
          <!--          </DeleteModal> -->
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
              :label="t('taxpayers.display')"
              color="neutral"
              variant="outline"
              trailing-icon="i-lucide-settings-2"
            />
          </UDropdownMenu>
        </div>
      </div>

      <UTable
        ref="table"
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
          {{ t('taxpayers.selection', {
            selected: table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0,
            total: table?.tableApi?.getFilteredRowModel().rows.length || 0
          }) }}
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
      <TaxpayersTaxpayerDetailsModal
        v-model:open="viewModalOpen"
        :inn="selectedINN"
      />
    </template>
  </UDashboardPanel>
</template>
