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
        title: 'Налогоплательщики',
        value: data.value.taxpayers,
        variation: 0,
        icon: 'i-heroicons-users'
      },
      {
        title: 'Доходы',
        value: data.value.income,
        variation: data.value.variation.TotalIncomeGrowth ?? 0,
        icon: 'i-heroicons-banknotes'
      },
      {
        title: 'Налоги',
        value: data.value.tax,
        variation: data.value.variation.TotalTaxGrowth ?? 0,
        icon: 'i-heroicons-receipt-percent'
      },
      {
        title: 'Транзакции',
        value: data.value.transactions,
        variation: data.value.variation.TotalTransactionsGrowth ?? 0,
        icon: 'i-heroicons-arrows-right-left'
      }
    ]
  })

  return { stats, pending, refresh }
}
