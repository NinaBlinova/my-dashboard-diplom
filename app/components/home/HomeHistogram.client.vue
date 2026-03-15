<script setup lang="ts">
import { computed } from 'vue'
import {
  VisXYContainer,
  VisGroupedBar,
  VisAxis
} from '@unovis/vue'

type ApiItem = {
  Year: number
  Income: number
  Tax: number
  Transactions: number
}

type ChartItem = {
  year: number
  Income: number
  Tax: number
  Transactions: number
}

const props = defineProps<{
  title?: string
  data: ApiItem[]
}>()

const COLORS = {
  Income: '#3b82f6',
  Tax: '#10b981',
  Transactions: '#f59e0b'
} as const

const chartData = computed<ChartItem[]>(() => {
  if (!props.data?.length) return []

  return [...props.data]
    .sort((a, b) => a.Year - b.Year)
    .map(d => ({
      year: d.Year,
      Income: d.Income,
      Tax: d.Tax,
      Transactions: d.Transactions
    }))
})

const getX = (d: ChartItem) => String(d.year)
</script>

<template>
  <UCard :ui="{ body: '!px-0 !pt-0 !pb-3' }">
    <template #header>
      <p class="text-xs text-muted uppercase">
        {{ title || 'Yearly Indicators' }}
      </p>
    </template>

    <div
      v-if="chartData.length"
      class="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4"
    >
      <!-- Income -->
      <div>
        <p class="text-sm font-medium mb-2">
          Доход
        </p>
        <VisXYContainer
          :data="chartData"
          class="h-72"
        >
          <VisGroupedBar
            :x="getX"
            :y="(d: ChartItem) => d.Income"
            :color="COLORS.Income"
          />
          <VisAxis type="x" />
          <VisAxis type="y" />
        </VisXYContainer>
      </div>

      <!-- Tax -->
      <div>
        <p class="text-sm font-medium mb-2">
          Налог
        </p>
        <VisXYContainer
          :data="chartData"
          class="h-72"
        >
          <VisGroupedBar
            :x="getX"
            :y="(d: ChartItem) => d.Tax"
            :color="COLORS.Tax"
          />
          <VisAxis type="x" />
          <VisAxis type="y" />
        </VisXYContainer>
      </div>

      <!-- Transactions -->
      <div>
        <p class="text-sm font-medium mb-2">
          Транзакции
        </p>
        <VisXYContainer
          :data="chartData"
          class="h-72"
        >
          <VisGroupedBar
            :x="getX"
            :y="(d: ChartItem) => d.Transactions"
            :color="COLORS.Transactions"
          />
          <VisAxis type="x" />
          <VisAxis type="y" />
        </VisXYContainer>
      </div>
    </div>
  </UCard>
</template>
