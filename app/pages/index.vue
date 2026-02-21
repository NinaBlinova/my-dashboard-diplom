<script setup lang="ts">
import { sub } from 'date-fns'
import type { DropdownMenuItem } from '@nuxt/ui'
import type { MonthlyResponse, Period, Range } from '~/types'
import Filters from '~/components/home/Filters.vue'

const { isNotificationsSlideoverOpen } = useDashboard()

const items = [[{
  label: 'New mail',
  icon: 'i-lucide-send',
  to: '/inbox'
}, {
  label: 'New customer',
  icon: 'i-lucide-user-plus',
  to: '/taxpayers'
}]] satisfies DropdownMenuItem[][]

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

// const { data: response_general } = await useFetch<MonthlyResponse>('/api/dashboard', {
//   query: computed(() => ({
//     type: 'monthly-general',
//     scope: filters.value.scope,
//     taxType: filters.value.taxType,
//     inn: filters.value.inn,
//     startYear: filters.value.startYear,
//     endYear: filters.value.endYear
//   }))
// })
//
// const monthlyDataGeneral = computed(() => response_general.value?.data ?? [])
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Home" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UTooltip text="Notifications" :shortcuts="['N']">
            <UButton
              color="neutral"
              variant="ghost"
              square
              @click="isNotificationsSlideoverOpen = true"
            >
              <UChip color="error" inset>
                <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
              </UChip>
            </UButton>
          </UTooltip>

          <UDropdownMenu :items="items">
            <UButton icon="i-lucide-plus" size="md" class="rounded-full" />
          </UDropdownMenu>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <!-- NOTE: The `-ms-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
          <HomeDateRangePicker v-model="range" class="-ms-1" />

          <Filters v-model="period" :range="range" />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
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
      <!--      <div class="grid grid-cols-1 md:grid-cols-3 gap-4"> -->
      <!--        <HomeChart -->
      <!--          title="Income" -->
      <!--          metric="Income" -->
      <!--          :data="monthlyDataGeneral" -->
      <!--        /> -->
      <!--        <HomeChart -->
      <!--          title="Tax" -->
      <!--          metric="Tax" -->
      <!--          :data="monthlyDataGeneral" -->
      <!--        /> -->
      <!--        <HomeChart -->
      <!--          title="Transactions" -->
      <!--          metric="Transactions" -->
      <!--          :data="monthlyDataGeneral" -->
      <!--        /> -->
      <!--      </div> -->
      <!--      <HomeSales :period="period" :range="range" /> -->
    </template>
  </UDashboardPanel>
</template>
