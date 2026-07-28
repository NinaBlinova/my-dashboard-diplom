import type { MonthlyResponse } from '~/types'

export function useMonthlyData(type: 'monthly-median' | 'monthly-general') {
  const { filters } = useDashboardFilters()

  const { data } = useFetch<MonthlyResponse>('/api/dashboard/dashboard', {
    query: computed(() => ({
      type,
      scope: filters.value.scope,
      taxType: filters.value.taxType,
      inn: filters.value.inn,
      startYear: filters.value.startYear,
      endYear: filters.value.endYear
    }))
  })

  return computed(() => data.value?.data ?? [])
}
