<script setup lang="ts">
const { stats } = useDashboardStats()
const { filters } = useDashboardFilters()

function formatCurrency(value: number): string {
  return value.toLocaleString('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  })
}

function generateColorFromYear(year: number) {
  const hue = (year * 47) % 360
  return `hsl(${hue}, 70%, 55%)`
}

const { data: yearlyResponse } = await useFetch('/api/pie_chart', {
  query: computed(() => ({
    scope: filters.value.scope,
    taxType: filters.value.taxType,
    inn: filters.value.inn
  }))
})

const yearlyData = computed(() => yearlyResponse.value?.data ?? [])
watchEffect(() => {
  console.log('YEARLY DATA:', yearlyData.value)
})
const yearlyCharts = computed(() => {
  const data = yearlyData.value
  if (!data || data.length === 0) return []

  const start = Number(filters.value.startYear)
  const end = Number(filters.value.endYear)

  const filtered = data.filter(year =>
    (!start || year.Year >= start)
    && (!end || year.Year <= end)
  )

  if (filtered.length === 0) return []

  const sorted = [...filtered].sort((a, b) => a.Year - b.Year)

  return sorted.map((year) => ({
    label: String(year.Year),
    income: year.Income,
    tax: year.Tax,
    transactions: year.Transactions,
    color: generateColorFromYear(year.Year)
  }))
})
</script>

<template>
  <UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
    <UPageCard
      v-for="(stat, index) in stats"
      :key="index"
      :icon="stat.icon"
      :title="stat.title"
      to="/taxpayers"
      variant="subtle"
      :ui="{
        container: 'gap-y-1.5',
        wrapper: 'items-start',
        leading: 'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25 flex-col',
        title: 'font-normal text-muted text-xs uppercase'
      }"
      class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
    >
      <div class="flex items-center gap-2">
        <span class="text-2xl font-semibold text-highlighted">
          <!-- форматируем Tax красиво -->
          {{ stat.title === 'Tax'
            ? formatCurrency(stat.value)
            : stat.value }}
        </span>

        <UBadge
          v-if="stat.title !== 'Taxpayers'"
          :color="stat.variation > 0 ? 'success' : 'error'"
          variant="subtle"
          class="text-xs"
        >
          {{ stat.variation > 0 ? '+' : '' }}{{ stat.variation }}%
        </UBadge>
      </div>
    </UPageCard>
  </UPageGrid>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
    <HomePieChart
      v-for="item in yearlyCharts"
      :key="item.label"
      :interval-label="item.label"
      :income="item.income"
      :tax="item.tax"
      :transactions="item.transactions"
      :color="item.color"
    />
  </div>
</template>
