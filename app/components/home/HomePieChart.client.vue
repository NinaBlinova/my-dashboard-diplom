<script setup lang="ts">
import { computed } from 'vue'
import { VisSingleContainer, VisDonut, VisTooltip } from '@unovis/vue'

type PieItem = {
  name: string
  value: number
}

const props = defineProps<{
  intervalLabel: string
  income: number
  tax: number
  transactions: number
  color: string
}>()

const chartData = computed<PieItem[]>(() => [
  { name: 'Income', value: props.income },
  { name: 'Tax', value: props.tax }
])

const total = computed(() => props.income - props.tax)

const incomePercent = computed(() =>
  total.value ? ((total.value / props.income) * 100).toFixed(1) : '0'
)

const formatCurrency = (value: number) =>
  value.toLocaleString('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  })

const getValue = (d: PieItem): number => d.value
const getName = (d: PieItem): string => d.name

const getColor = (d: PieItem): string =>
  d.name === 'Income' ? props.color : '#E5E7EB'

const getTooltip = (d: PieItem): string =>
  `${d.name}: ${formatCurrency(d.value)}`
</script>

<template>
  <UCard class="relative overflow-hidden transition hover:shadow-lg">
    <template #header>
      <div>
        <p class="text-sm font-semibold">
          {{ intervalLabel }}
        </p>
        <p class="text-xs text-muted">
          {{ transactions }} transactions per month
        </p>
      </div>
    </template>

    <!-- Donut -->
    <div class="relative">
      <VisSingleContainer
        :data="chartData"
        class="h-72"
      >
        <VisDonut
          :value="getValue"
          :label="getName"
          :arc-width="42"
          :color="getColor"
          :corner-radius="4"
        />
        <VisTooltip :content="getTooltip" />
      </VisSingleContainer>

      <div
        class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
      >
        <p class="text-xs text-muted">
          Total
        </p>
        <p class="text-lg font-semibold">
          {{ props.income }}
        </p>
        <p class="text-xs text-primary font-medium">
          {{ props.tax }} tax
        </p>
        <p class="text-xs text-primary font-medium">
          {{ incomePercent }}% income
        </p>
      </div>
    </div>
  </UCard>
</template>
