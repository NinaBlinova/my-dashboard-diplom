<script setup lang="ts">
import type { ModelItem } from '~/types'
import { useModels } from '~/composables/useModels'

const { t } = useI18n()
const selectedModel = defineModel<ModelItem | null>()
const { models, activeModel, setActiveModel, loadActiveModel } = useModels()

const isActive = (m: ModelItem) => {
  return (
    activeModel.value?.ModelName === m.ModelName
    && activeModel.value?.ModelVersion === m.ModelVersion
  )
}

const activate = async (m: ModelItem) => {
  await setActiveModel({
    ModelName: m.ModelName,
    ModelVersion: m.ModelVersion
  })
}

onMounted(async () => {
  await loadActiveModel()
})
</script>

<template>
  <div class="overflow-y-auto divide-y divide-default">
    <div
      v-for="model in models"
      :key="model.ModelName + model.ModelVersion"
      class="p-4 cursor-pointer border-l-2 transition-colors"
      :class="[
        isActive(model)
          ? 'border-primary bg-primary/10'
          : 'border-transparent hover:border-primary hover:bg-primary/5'
      ]"
      @click="selectedModel = model"
    >
      <div class="font-semibold">
        {{ model.ModelName }}
      </div>
      <div class="text-sm text-muted">
        {{ t('models.versionLabel', { version: model.ModelVersion }) }}
      </div>
      <UButton
        v-if="!isActive(model)"
        :label="t('models.activate')"
        variant="ghost"
        @click="activate(model)"
      />
      <UBadge
        v-else
        :label="t('models.active')"
        color="success"
      />
    </div>
  </div>
</template>
