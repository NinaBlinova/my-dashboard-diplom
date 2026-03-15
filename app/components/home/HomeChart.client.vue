<script setup lang="ts">
import { computed } from 'vue'
import { VisXYContainer, VisLine, VisAxis, VisArea, VisCrosshair, VisTooltip } from '@unovis/vue'

type ApiItem = {
  Year: number
  Month: number
  Income: number
  Tax: number
  Transactions: number
}

type ChartPoint = {
  x: number
  value: number
  year: number
  label: string
}

const props = defineProps<{
  title: string
  metric: 'Income' | 'Tax' | 'Transactions'
  data: ApiItem[]
}>()

const getX = (d: ChartPoint): number => d.x
// const getY = (d: ChartPoint): number => d.value
// const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']

const groupedByYear = computed<Record<number, ApiItem[]>>(() => {
  const groups: Record<number, ApiItem[]> = {}

  if (!Array.isArray(props.data)) return groups

  for (const item of props.data) {
    if (!groups[item.Year]) {
      groups[item.Year] = []
    }
    groups[item.Year]!.push(item)
  }

  return groups
})

const series = computed<{ year: number, data: ChartPoint[] }[]>(() =>
  Object.entries(groupedByYear.value).map(([year, items]) => {
    const typedItems = items as ApiItem[]

    return {
      year: Number(year),
      data: typedItems
        .sort((a, b) => a.Month - b.Month)
        .map((d: ApiItem): ChartPoint => ({
          x: d.Month,
          value: d[props.metric],
          year: Number(d.Year),
          label: `${d.Month}.${d.Year}`
        }))
    }
  })
)

const formatter = new Intl.NumberFormat('ru', {
  notation: 'compact'
})

// const formatter = new Intl.NumberFormat('en', {
// notation: 'compact',
//   maximumFractionDigits: 1
// })

const template = (d: ChartPoint) =>
  `${d.label}: ${formatter.format(d.value)}`

// watchEffect(() => {
//   console.log('RAW API DATA:', props.data)
//   console.log('CHART DATA:', series.value)
// })
const usedColors = new Map<number, string>()

const getColor = (year: number): string => {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
  return colors[year % colors.length] ?? '#3b82f6'
}
watch(series, () => {
  usedColors.clear()
})

const containerData = computed<ChartPoint[]>(() =>
  series.value.flatMap(s => s.data)
)
</script>

<template>
  <UCard :ui="{ body: '!px-0 !pt-0 !pb-3' }">
    <template #header>
      <div>
        <p class="text-xs text-muted uppercase mb-1.5">
          {{ title }}
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
      class="h-72"
    >
      <template v-for="s in series" :key="s.year">
        <VisLine
          :x="getX"
          :y="(d: ChartPoint) => d.year === s.year ? d.value : undefined"
          :color="getColor(s.year)"
        />

        <VisArea
          :x="getX"
          :y="(d: ChartPoint) => d.year === s.year ? d.value : undefined"
          :color="getColor(s.year)"
          :opacity="0.08"
        />
      </template>

      <VisAxis
        type="x"
        :num-ticks="6"
        :tick-format="(v:number) => months[v-1]"
      />
      <VisAxis
        type="y"
        :tick-format="(v:number) => formatter.format(v)"
      />
      <VisCrosshair :template="template" />
      <VisTooltip />
    </VisXYContainer>
  </UCard>
</template>

<style scoped>
.unovis-xy-container {
  --vis-crosshair-line-stroke-color: var(--ui-primary);
  --vis-crosshair-circle-stroke-color: var(--ui-bg);

  --vis-axis-grid-color: var(--ui-border);
  --vis-axis-tick-color: var(--ui-border);
  --vis-axis-tick-label-color: var(--ui-text-dimmed);

  --vis-tooltip-background-color: var(--ui-bg);
  --vis-tooltip-border-color: var(--ui-border);
  --vis-tooltip-text-color: var(--ui-text-highlighted);
}
</style>
