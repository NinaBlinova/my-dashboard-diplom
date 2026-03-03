<script setup lang="ts">
import type { ModelItem } from '~/types'

const props = defineProps<{ model: ModelItem [] }>()
</script>

<template>
  <UDashboardPanel
    v-for="m in props.model"
    :key="m.ModelName + m.ModelVersion"
  >
    <UDashboardNavbar :title="m.TargetName" />
    <div class="p-6 space-y-4">
      <div><strong>Version:</strong> {{ m.ModelVersion }}</div>
      <div><strong>Target:</strong> {{ m.TargetName }}</div>
      <div><strong>R²:</strong> {{ m.R2 }}</div>
      <div><strong>MAE:</strong> {{ m.MAE }}</div>
      <div><strong>RMSE:</strong> {{ m.RMSE }}</div>
      <div><strong>Created:</strong> {{ m.CreatedAt }}</div>
    </div>
  </UDashboardPanel>
</template>
