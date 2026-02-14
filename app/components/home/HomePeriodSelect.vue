<template>
  <div class="flex flex-wrap gap-4 items-center bg-ui-surface p-4 rounded-lg shadow-sm">
    <!-- Tax Type -->
    <USelect
      v-model="filters.taxType"
      :items="taxTypes"
      label="Tax Type"
      placeholder="Select tax type"
      class="min-w-[180px]"
      :disabled="filters.scope === 'alone'"
    />

    <USwitch v-model="modeBool" label="General / Average" />
    <USwitch v-model="scopeBool" label="All / Alone" />
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

const modeBool = computed({
  get: () => filters.mode === 'average',
  set: (val: boolean) => filters.mode = val ? 'average' : 'general'
})

const scopeBool = computed({
  get: () => filters.scope === 'alone',
  set: (val: boolean) => filters.scope = val ? 'alone' : 'all'
})
</script>
