<script setup lang="ts">
import { sub } from 'date-fns'
import type { Period, Range } from '~/types'
import Filters from '~/components/home/Filters.vue'
import MetricsGrid from '~/components/common/MetricsGrid.vue'

const range = shallowRef<Range>({
  start: sub(new Date(), { days: 14 }),
  end: new Date()
})
const period = ref<Period>('daily')
const { user } = useLogin()
const { filters } = useDashboardFilters()
const { t } = useI18n()

const monthlyDataMedian = useMonthlyData('monthly-median')
const monthlyDataGeneral = useMonthlyData('monthly-general')

const isAlone = computed(() => filters.value.scope === 'alone')
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
      <UDashboardNavbar :title="t('home.title')" :ui="{ right: 'gap-3' }">
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
            :label="t('home.generateReport')"
            icon="i-lucide-file-text"
            @click="handleGenerateReport"
          />
        </template>
      </UDashboardToolbar>
    </template>

    <template v-if="isAlone" #body>
      <HomeStats :period="period" :range="range" />
      <MetricsGrid :data="monthlyDataMedian" />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <HomeIncomeTransactionChart
          :title="t('home.charts.incomeVsTransactions')"
          :data="monthlyDataMedian"
        />
      </div>
    </template>

    <template v-else #body>
      <HomeStats :period="period" :range="range" />
      <MetricsGrid :data="monthlyDataMedian" />
      <MetricsGrid :data="monthlyDataGeneral" />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <HomeIncomeTransactionChart
          :title="t('home.charts.incomeVsTransactionsMedian')"
          :data="monthlyDataMedian"
        />
        <HomeIncomeTransactionChart
          :title="t('home.charts.incomeVsTransactionsGeneral')"
          :data="monthlyDataGeneral"
        />
      </div>
    </template>
  </UDashboardPanel>
</template>
