<script setup lang="ts">
import { computed, watchEffect } from 'vue'
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

const template = (d: ChartPoint) =>
  `${d.label}: ${d.value.toLocaleString()}`

watchEffect(() => {
  console.log('RAW API DATA:', props.data)
  console.log('CHART DATA:', series.value)
})

const getCssVar = (name: string): string =>
  getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()

const themePalette = computed<string[]>(() => {
  const colors = [
    getCssVar('--ui-primary'),
    getCssVar('--ui-success'),
    getCssVar('--ui-warning'),
    getCssVar('--ui-danger'),
    getCssVar('--ui-info')
  ].filter((c): c is string => Boolean(c))

  return colors.length ? colors : ['#3b82f6'] // fallback
})

const usedColors = new Map<number, string>()

const getColor = (year: number): string => {
  if (usedColors.has(year)) {
    return usedColors.get(year)!
  }
  const palette = themePalette.value
  if (!palette.length) {
    return '#3b82f6'
  }
  const taken = new Set(usedColors.values())
  const available = palette.find(c => !taken.has(c))
  const fallback = palette[usedColors.size % palette.length]
  const color = available || fallback || '#3b82f6'
  usedColors.set(year, color)
  return color
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

      <VisAxis type="x" />
      <VisAxis type="y" />
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
