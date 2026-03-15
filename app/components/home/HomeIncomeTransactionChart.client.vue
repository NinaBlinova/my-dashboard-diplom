<script setup lang="ts">
import { computed, watch } from 'vue'
import {
  VisXYContainer,
  VisScatter,
  VisLine,
  VisAxis,
  VisTooltip,
  VisCrosshair
} from '@unovis/vue'

type ApiItem = {
  Year: number
  Month: number
  Income: number
  Tax: number
  Transactions: number
}

type ChartPoint = {
  x: number
  y: number
  year: number
  label: string
}

const props = defineProps<{
  title?: string
  data: ApiItem[]
}>()

const compact = new Intl.NumberFormat('ru', {
  notation: 'compact',
  maximumFractionDigits: 1
})

const groupedByYear = computed<Record<number, ApiItem[]>>(() => {
  const groups: Record<number, ApiItem[]> = {}

  for (const item of props.data ?? []) {
    if (!groups[item.Year]) {
      groups[item.Year] = []
    }
    groups[item.Year]!.push(item)
  }

  return groups
})

const series = computed<{ year: number, data: ChartPoint[] }[]>(() =>
  Object.entries(groupedByYear.value).map(([year, items]) => ({
    year: Number(year),
    data: [...items]
      .sort((a, b) => a.Transactions - b.Transactions)
      .map((d: ApiItem): ChartPoint => ({
        x: d.Transactions,
        y: d.Income,
        year: d.Year,
        label: `${d.Month}.${d.Year}`
      }))
  }))
)

const getX = (d: ChartPoint): number => d.x
// const getY = (d: ChartPoint): number => d.y

const usedColors = new Map<number, string>()

const getColor = (year: number): string => {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
  return colors[year % colors.length] ?? '#3b82f6'
}

watch(series, () => {
  usedColors.clear()
})

const formatCurrency = (v: number) =>
  v.toLocaleString('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  })

const template = (d: ChartPoint) => `
${d.label}
Transactions: ${d.x.toLocaleString()}
Income: ${formatCurrency(d.y)}
`

const containerData = computed(() =>
  series.value.flatMap(s => s.data)
)

// watchEffect(() => {
//   console.log('RAW:', props.data.length)
//
//   series.value.forEach((s) => {
//     console.log(`Year ${s.year}:`, s.data.length)
//   })
// })
</script>

<template>
  <!--  <pre>{{ series }}</pre> -->
  <UCard :ui="{ body: '!px-0 !pt-0 !pb-3' }">
    <template #header>
      <div>
        <p class="text-xs text-muted uppercase mb-1.5">
          {{ title || 'Income vs Transactions' }}
        </p>

        <div class="flex flex-wrap gap-4">
          <div
            v-for="s in series"
            :key="s.year"
            class="flex items-center gap-2 text-sm"
          >
            <span
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: getColor(s.year) }"
            />
            <span class="font-medium">
              {{ s.year }}
            </span>
          </div>
        </div>
      </div>
    </template>

    <VisXYContainer
      v-if="containerData.length"
      :data="containerData"
      class="h-80"
    >
      <template v-for="s in series" :key="s.year">
        <VisScatter
          :x="getX"
          :y="(d: ChartPoint) => d.year === s.year ? d.y : undefined"
          :color="getColor(s.year)"
          :size="8"
        />
        <VisLine
          :x="getX"
          :y="(d: ChartPoint) => d.year === s.year ? d.y : undefined"
          :color="getColor(s.year)"
          :opacity="0.5"
        />
      </template>
      <VisAxis
        type="x"
        :tick-format="(v:number) => compact.format(v)"
      />

      <VisAxis
        type="y"
        :tick-format="(v:number) => compact.format(v)"
      />
      <VisCrosshair :template="template" />
      <VisTooltip />
    </VisXYContainer>
  </UCard>
</template>
