<template>
  <div class="flex flex-wrap gap-4 items-center bg-ui-surface p-4 rounded-lg shadow-sm">
    <!-- Tax Type -->
    <USelect
      v-model="filters.taxType"
      :items="taxTypes"
      label="Тип налога"
      placeholder="Выберите тип налога"
      class="min-w-[180px]"
      :disabled="filters.scope === 'alone'"
    />

    <USwitch v-model="scope" label="Все / Конкретный (ИНН)" />
    <UInput
      v-if="filters.scope === 'alone'"
      v-model="filters.inn"
      label="ИНН"
      placeholder="Введите ИНН"
      class="min-w-[220px]"
    />
  </div>
</template>

<script setup lang="ts">
import { useDashboardFilters } from '~/composables/useDashboardFilters'

const { filters } = useDashboardFilters()

// Список налогов
const taxTypes = [
  { label: 'Самозанятый (НПД)', value: 'SZ' },
  { label: 'ИП на УСН 6%', value: 'IP6' },
  { label: 'ИП на УСН 15%', value: 'IP15' },
  { label: 'ИП на ОСНО', value: 'IPOS' },
  { label: 'ИП на патенте', value: 'IPP' }
]

const scope = computed<boolean>({
  get: () => filters.value.scope === 'alone',
  set: (val: boolean) => {
    filters.value.scope = val ? 'alone' : 'all'
  }
})
</script>
