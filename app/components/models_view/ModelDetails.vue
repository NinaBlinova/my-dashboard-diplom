<script setup lang="ts">
import type { ModelItem } from '~/types'

defineProps<{ model: ModelItem[] }>()

const formatDate = (date: string) =>
  new Date(date).toLocaleString()

const formatValue = (value: unknown) => {
  if (typeof value === 'number') {
    return value.toFixed(4)
  }
  return value
}

const fields: { label: string, key: keyof ModelItem }[] = [
  { label: 'Версия', key: 'ModelVersion' },
  { label: 'R²', key: 'R2' },
  { label: 'MAE', key: 'MAE' },
  { label: 'RMSE', key: 'RMSE' }
]
</script>

<template>
  <UDashboardPanel
    v-for="m in model"
    :key="`${m.ModelName}-${m.ModelVersion}`"
  >
    <UDashboardNavbar :title="m.TargetName" />
    <div class="p-6 space-y-4">
      <div v-for="f in fields" :key="f.key">
        <strong>{{ f.label }}:</strong> {{ formatValue(m[f.key]) }}
      </div>

      <div>
        <strong>Создано:</strong> {{ formatDate(m.CreatedAt) }}
      </div>
    </div>
  </UDashboardPanel>
</template>
