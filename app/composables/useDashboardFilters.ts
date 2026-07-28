import { createSharedComposable } from '@vueuse/core'
import { watch } from 'vue'
import type { DashboardFilters } from '~/types'

const _useDashboardFilters = () => {
  const filters = useState<DashboardFilters>('dashboard-filters', () => ({
    taxType: undefined,
    mode: 'general',
    scope: 'all',
    inn: undefined,
    startYear: undefined,
    endYear: undefined
  }))

  watch(() => filters.value.scope, (value) => {
    if (value === 'alone') {
      filters.value.taxType = undefined
    }
  })

  return { filters }
}

export const useDashboardFilters = createSharedComposable(_useDashboardFilters)
