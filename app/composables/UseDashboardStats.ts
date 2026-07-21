export function useDashboardStats() {
  const { filters } = useDashboardFilters()

  const { data, pending, refresh } = useAsyncData(
    'dashboard-stats',
    () => $fetch('/api/dashboard/statistics', {
      query: {
        scope: filters.value.scope,
        taxType: filters.value.taxType,
        inn: filters.value.inn
      }
    }),
    {
      watch: [
        () => filters.value.scope,
        () => filters.value.taxType,
        () => filters.value.inn
      ]
    }
  )

  const stats = computed(() => {
    if (!data.value) return []
    return [
      {
        type: 'taxpayers',
        title: 'home.stats.taxpayers',
        value: data.value.taxpayers,
        variation: 0,
        icon: 'i-heroicons-users'
      },
      {
        type: 'income',
        title: 'home.stats.income',
        value: data.value.income,
        variation: data.value.variation.TotalIncomeGrowth ?? 0,
        icon: 'i-heroicons-banknotes'
      },
      {
        type: 'tax',
        title: 'home.stats.tax',
        value: data.value.tax,
        variation: data.value.variation.TotalTaxGrowth ?? 0,
        icon: 'i-heroicons-receipt-percent'
      },
      {
        type: 'transactions',
        title: 'home.stats.transactions',
        value: data.value.transactions,
        variation: data.value.variation.TotalTransactionsGrowth ?? 0,
        icon: 'i-heroicons-arrows-right-left'
      }
    ]
  })

  return { stats, pending, refresh }
}
