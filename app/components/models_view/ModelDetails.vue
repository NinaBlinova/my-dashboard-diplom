<script setup lang="ts">
import type { ModelItem } from '~/types'

defineProps<{ model: ModelItem[] }>()

const { t } = useI18n()

const formatDate = (date: string) =>
  new Date(date).toLocaleString()

const formatValue = (value: unknown) => {
  if (typeof value === 'number') {
    return value.toFixed(4)
  }
  return value
}

const fields: { label: string, key: keyof ModelItem }[] = [
  { label: 'models.fields.version', key: 'ModelVersion' },
  { label: 'models.fields.r2', key: 'R2' },
  { label: 'models.fields.mae', key: 'MAE' },
  { label: 'models.fields.rmse', key: 'RMSE' }
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
        <strong>{{ t(f.label) }}:</strong> {{ formatValue(m[f.key]) }}
      </div>

      <div>
        <strong>{{ t('models.createdAt') }}:</strong> {{ formatDate(m.CreatedAt) }}
      </div>
    </div>
  </UDashboardPanel>
</template>
