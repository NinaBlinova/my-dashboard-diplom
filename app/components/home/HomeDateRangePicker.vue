<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { YearsResponse } from '~/types'

const { t } = useI18n()
const { filters } = useDashboardFilters()
const availableYears = ref<number[]>([])
const selectedYear = ref<number | undefined>(undefined)
const maxYear = ref<number | undefined>(undefined)

const fetchYears = async () => {
  const config = useRuntimeConfig()

  try {
    const response = await $fetch<YearsResponse>(
      `${config.public.backendUrl}/api/dashboard/global-year-range`
    )

    const years = (response.data?.years || []).sort((a: number, b: number) => a - b)
    availableYears.value = years
    maxYear.value = response.data?.max_year

    if (years.length) {
      selectedYear.value = years.at(-1)
    }
  } catch (err) {
    console.error('FETCH ERROR:', err)
  }
}

const upperBound = computed(() => {
  if (!selectedYear.value || !maxYear.value) return undefined
  return Math.max(selectedYear.value, maxYear.value) + 1
})

onMounted(fetchYears)
watch(selectedYear, (selectedYear) => {
  filters.value.startYear = selectedYear
  filters.value.endYear = upperBound.value
})
</script>

<template>
  <div>{{ t('home.dateRange.from') }} {{ selectedYear }} {{ t('home.dateRange.to') }} {{ upperBound }}</div>
  <USelect
    v-model="selectedYear"
    :items="availableYears.map(y => ({
      label: y.toString(),
      value: y
    }))"
  />
</template>
