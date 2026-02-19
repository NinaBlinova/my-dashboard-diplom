import { watch } from 'vue'
import { sub } from 'date-fns'
import type { DashboardFilters, Period } from '~/types'

export function useDashboardFilters() {
  const filters = useState<DashboardFilters>('dashboard-filters', () => ({
    range: {
      start: sub(new Date(), { days: 14 }),
      end: new Date()
    },
    period: 'monthly' as Period,
    taxType: undefined,
    mode: 'general',
    scope: 'all',
    inn: undefined
  }))

  // Rule 1: if scope = alone → taxType = null and mode = general
  watch(() => filters.value.scope, (value) => {
    if (value === 'alone') {
      filters.value.taxType = undefined
    }
  })

  return { filters }
}
