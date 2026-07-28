<script setup lang="ts">
import type { MonthlyData } from '~/types'

const props = defineProps<{
  data: MonthlyData[]
}>()

const { t } = useI18n()

const metrics = computed(() => [
  { key: 'Income', title: t('home.charts.income') },
  { key: 'Tax', title: t('home.charts.tax') },
  { key: 'Transactions', title: t('home.charts.transactions') }
] as const)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <HomeChart
      v-for="m in metrics"
      :key="m.key"
      :title="m.title"
      :metric="m.key"
      :data="props.data"
    />
  </div>
</template>
