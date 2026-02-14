import { reactive, watch } from 'vue'
import { sub } from 'date-fns'
import type { DashboardFilters, Period } from '~/types'

export function useDashboardFilters() {
  const filters = reactive<DashboardFilters>({
    range: {
      start: sub(new Date(), { days: 14 }),
      end: new Date()
    },
    period: 'monthly' as Period,
    taxType: undefined,
    mode: 'general',
    scope: 'all'
  })

  // Правило 1: если выбран тип налога → считаем по всем налогоплательщикам all
  watch(() => filters.taxType, (value) => {
    if (value) {
      filters.scope = 'all'
    }
  })

  // Правило 2: если scope = alone → taxType = null и mode = general
  watch(() => filters.scope, (value) => {
    if (value === 'alone') {
      filters.taxType = undefined
      filters.mode = 'general'
    }
  })

  return { filters }
}
