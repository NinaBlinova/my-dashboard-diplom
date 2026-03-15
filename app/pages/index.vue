<script setup lang="ts">
import { sub } from 'date-fns'
import type { MonthlyResponse, Period, Range } from '~/types'
import Filters from '~/components/home/Filters.vue'

const range = shallowRef<Range>({
  start: sub(new Date(), { days: 14 }),
  end: new Date()
})
const period = ref<Period>('daily')
const { user } = useLogin()
const { filters } = useDashboardFilters()

const { data: response_median } = await useFetch<MonthlyResponse>('/api/dashboard/dashboard', {
  query: computed(() => ({
    type: 'monthly-median',
    scope: filters.value.scope,
    taxType: filters.value.taxType,
    inn: filters.value.inn,
    startYear: filters.value.startYear,
    endYear: filters.value.endYear
  }))
})
const monthlyDataMedian = computed(() => response_median.value?.data ?? [])

const { data: response_general } = await useFetch<MonthlyResponse>('/api/dashboard/dashboard', {
  query: computed(() => ({
    type: 'monthly-general',
    scope: filters.value.scope,
    taxType: filters.value.taxType,
    inn: filters.value.inn,
    startYear: filters.value.startYear,
    endYear: filters.value.endYear
  }))
})

const monthlyDataGeneral = computed(() => response_general.value?.data ?? [])
// watchEffect(() => {
//   console.log('MONTHLY MEDIAN:', monthlyDataMedian.value)
// })
const isAlone = computed(() => filters.value.scope === 'alone')

// const displayCharts = reactive({
//   incomeMedian: true,
//   taxMedian: true,
//   transactionsMedian: true,
//   incomeGeneral: true,
//   taxGeneral: true,
//   transactionsGeneral: true,
//   incomeVsTransactionsMedian: true,
//   incomeVsTransactionsGeneral: true
// })

const { generateReport } = useReport()

async function handleGenerateReport() {
  await generateReport({
    medianData: monthlyDataMedian.value,
    generalData: monthlyDataGeneral.value,
    filters: filters.value,
    period: period.value,
    range: range.value,
    user: user.value
      ? { Id: user.value.Id, Username: user.value.Username, FullName: user.value.FullName }
      : undefined
  })
}
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Главная" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <HomeDateRangePicker v-model="range" class="-ms-1" />
          <Filters v-model="period" :range="range" />
        </template>
        <template #right>
          <UButton
            label="Отчет"
            icon="i-lucide-file-text"
            @click="handleGenerateReport"
          />
        </template>
      </UDashboardToolbar>
    </template>

    <template v-if="isAlone" #body>
      <HomeStats :period="period" :range="range" />
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <HomeChart title="Доходы" metric="Income" :data="monthlyDataMedian" />
        <HomeChart title="Налоги" metric="Tax" :data="monthlyDataMedian" />
        <HomeChart title="Транзакции" metric="Transactions" :data="monthlyDataMedian" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <HomeIncomeTransactionChart
          title="Доходы = F(Транзакции)"
          :data="monthlyDataMedian"
        />
      </div>
    </template>

    <template v-else #body>
      <HomeStats :period="period" :range="range" />
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <HomeChart
          title="Доходы"
          metric="Income"
          :data="monthlyDataMedian"
        />
        <HomeChart
          title="Налоги"
          metric="Tax"
          :data="monthlyDataMedian"
        />
        <HomeChart
          title="Транзакции"
          metric="Transactions"
          :data="monthlyDataMedian"
        />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <HomeChart
          title="Доходы"
          metric="Income"
          :data="monthlyDataGeneral"
        />
        <HomeChart
          title="Налоги"
          metric="Tax"
          :data="monthlyDataGeneral"
        />
        <HomeChart
          title="Транзакции"
          metric="Transactions"
          :data="monthlyDataGeneral"
        />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <HomeIncomeTransactionChart
          title="Доходы = F(Транзакции) (Средние значения)"
          :data="monthlyDataMedian"
        />
        <HomeIncomeTransactionChart
          title="Доходы = F(Транзакции) (Суммированные значения)"
          :data="monthlyDataGeneral"
        />
      </div>
    </template>
  </UDashboardPanel>
</template>
