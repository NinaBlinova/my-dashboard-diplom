import { watch } from 'vue'
import type { DashboardFilters } from '~/types'

export function useDashboardFilters() {
  const filters = useState<DashboardFilters>('dashboard-filters', () => ({
    taxType: undefined,
    mode: 'general',
    scope: 'all',
    inn: undefined,
    startYear: undefined,
    endYear: undefined
  }))

  // Rule 1: if scope = alone → taxType = null and mode = general
  watch(() => filters.value.scope, (value) => {
    if (value === 'alone') {
      filters.value.taxType = undefined
    }
  })

  return { filters }
}
