<script setup lang="ts">
import { sub } from 'date-fns'
import type { MonthlyResponse, Period, Range } from '~/types'
import Filters from '~/components/home/Filters.vue'

const range = shallowRef<Range>({
  start: sub(new Date(), { days: 14 }),
  end: new Date()
})
const period = ref<Period>('daily')

const { filters } = useDashboardFilters()

const { data: response_median } = await useFetch<MonthlyResponse>('/api/dashboard', {
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

const { data: response_general } = await useFetch<MonthlyResponse>('/api/dashboard', {
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
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Home" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <!-- NOTE: The `-ms-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
          <HomeDateRangePicker v-model="range" class="-ms-1" />
          <Filters v-model="period" :range="range" />
          <!--          <UDropdownMenu -->
          <!--            :items="[ -->
          <!--              { label: 'Income (Median)', type: 'checkbox', checked: displayCharts.incomeMedian, onUpdateChecked: val => displayCharts.incomeMedian = val }, -->
          <!--              { label: 'Tax (Median)', type: 'checkbox', checked: displayCharts.taxMedian, onUpdateChecked: val => displayCharts.taxMedian = val }, -->
          <!--              { label: 'Transactions (Median)', type: 'checkbox', checked: displayCharts.transactionsMedian, onUpdateChecked: val => displayCharts.transactionsMedian = val }, -->
          <!--              { label: 'Income (General)', type: 'checkbox', checked: displayCharts.incomeGeneral, onUpdateChecked: val => displayCharts.incomeGeneral = val }, -->
          <!--              { label: 'Tax (General)', type: 'checkbox', checked: displayCharts.taxGeneral, onUpdateChecked: val => displayCharts.taxGeneral = val }, -->
          <!--              { label: 'Transactions (General)', type: 'checkbox', checked: displayCharts.transactionsGeneral, onUpdateChecked: val => displayCharts.transactionsGeneral = val }, -->
          <!--              { label: 'Income vs Transactions (Median)', type: 'checkbox', checked: displayCharts.incomeVsTransactionsMedian, onUpdateChecked: val => displayCharts.incomeVsTransactionsMedian = val }, -->
          <!--              { label: 'Income vs Transactions (General)', type: 'checkbox', checked: displayCharts.incomeVsTransactionsGeneral, onUpdateChecked: val => displayCharts.incomeVsTransactionsGeneral = val } -->
          <!--            ]" -->
          <!--            :content="{ align: 'end' }" -->
          <!--          > -->
          <!--            <UButton -->
          <!--              label="Display" -->
          <!--              color="neutral" -->
          <!--              variant="outline" -->
          <!--              trailing-icon="i-lucide-settings-2" -->
          <!--            /> -->
          <!--          </UDropdownMenu> -->
        </template>
      </UDashboardToolbar>
    </template>

    <!-- 🔹 ALONE -->
    <template v-if="isAlone" #body>
      <HomeStats :period="period" :range="range" />
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <HomeChart title="Income" metric="Income" :data="monthlyDataMedian" />
        <HomeChart title="Tax" metric="Tax" :data="monthlyDataMedian" />
        <HomeChart title="Transactions" metric="Transactions" :data="monthlyDataMedian" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <HomeIncomeTransactionChart
          title="Income = F(Transactions)"
          :data="monthlyDataMedian"
        />
      </div>
    </template>

    <template v-else #body>
      <HomeStats :period="period" :range="range" />
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <HomeChart
          title="Income"
          metric="Income"
          :data="monthlyDataMedian"
        />
        <HomeChart
          title="Tax"
          metric="Tax"
          :data="monthlyDataMedian"
        />
        <HomeChart
          title="Transactions"
          metric="Transactions"
          :data="monthlyDataMedian"
        />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <HomeChart
          title="Income"
          metric="Income"
          :data="monthlyDataGeneral"
        />
        <HomeChart
          title="Tax"
          metric="Tax"
          :data="monthlyDataGeneral"
        />
        <HomeChart
          title="Transactions"
          metric="Transactions"
          :data="monthlyDataGeneral"
        />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <HomeIncomeTransactionChart
          title="Income = F(Transactions) (Median)"
          :data="monthlyDataMedian"
        />
        <HomeIncomeTransactionChart
          title="Income = F(Transactions) (General)"
          :data="monthlyDataGeneral"
        />
      </div>
    </template>
  </UDashboardPanel>
</template>
