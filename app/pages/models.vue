<script setup lang="ts">
import type { ModelItem } from '~/types'
import ModelsList from '~/components/models_view/ModelsList.vue'
import ModelDetails from '~/components/models_view/ModelDetails.vue'

const { models, fetchModelInfo } = useModels()
const selectedModel = ref<ModelItem | null>(null)
const currentModels = ref<ModelItem[]>([])

watch(selectedModel, async (newModel) => {
  if (!newModel) return

  currentModels.value = await fetchModelInfo({
    ModelName: newModel.ModelName,
    ModelVersion: newModel.ModelVersion
  })
})
</script>

<template>
  <UDashboardPanel
    :default-size="25"
    :min-size="20"
    :max-size="30"
    resizable
  >
    <UDashboardNavbar title="Модели">
      <template #trailing>
        <UBadge :label="models.length" variant="subtle" />
      </template>
    </UDashboardNavbar>

    <ModelsList
      v-model="selectedModel"
      :models="models"
    />
  </UDashboardPanel>

  <ModelDetails
    v-if="currentModels.length > 0"
    :model="currentModels"
  />

  <div
    v-else
    class="hidden lg:flex flex-1 items-center justify-center"
  >
    <UIcon name="i-lucide-box" class="size-32 text-dimmed" />
  </div>
</template>
