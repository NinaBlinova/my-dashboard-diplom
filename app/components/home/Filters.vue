<template>
  <div class="flex flex-wrap gap-4 items-center bg-ui-surface p-4 rounded-lg shadow-sm">
    <USelect
      v-model="filters.taxType"
      :items="taxTypes"
      :label="t('home.filters.taxType')"
      :placeholder="t('home.filters.taxTypePlaceholder')"
      class="min-w-[180px]"
      :disabled="filters.scope === 'alone'"
    />

    <USwitch v-model="scope" :label="t('home.filters.scopeSwitch')" />
    <UInput
      v-if="filters.scope === 'alone'"
      v-model="filters.inn"
      :label="t('home.filters.inn')"
      :placeholder="t('home.filters.innPlaceholder')"
      class="min-w-[220px]"
    />
  </div>
</template>

<script setup lang="ts">
import { useDashboardFilters } from '~/composables/useDashboardFilters'

const { t } = useI18n()
const { filters } = useDashboardFilters()

const taxTypes = computed(() => [
  { label: t('home.filters.taxTypes.selfEmployed'), value: 'SZ' },
  { label: t('home.filters.taxTypes.ip6'), value: 'IP6' },
  { label: t('home.filters.taxTypes.ip15'), value: 'IP15' },
  { label: t('home.filters.taxTypes.ipOsno'), value: 'IPOS' },
  { label: t('home.filters.taxTypes.ipPatent'), value: 'IPP' }
])

const scope = computed<boolean>({
  get: () => filters.value.scope === 'alone',
  set: (val: boolean) => {
    filters.value.scope = val ? 'alone' : 'all'
  }
})
</script>
