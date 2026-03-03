import type { ModelItem, ModelsItems } from '~/types'

export const useModels = () => {
  const { data, refresh } = useFetch<ModelsItems>('/api/models')
  const activeModel = useState<{ ModelName: string, ModelVersion: string } | null>('activeModel', () => null)
  const loadActiveModel = async () => {
    const response = await $fetch<{ success: boolean, active_model: ModelItem }>(
      '/api/models',
      { query: { active: 'true' } }
    )
    activeModel.value = response.active_model
  }
  const setActiveModel = async (model: { ModelName: string, ModelVersion: string }) => {
    await $fetch('/api/models', {
      method: 'POST',
      body: model
    })

    activeModel.value = model
  }

  const fetchModelInfo = async (model: {
    ModelName: string
    ModelVersion: string
  }) => {
    const response = await $fetch<ModelsItems>('/api/models', {
      query: model
    })

    return response.data
  }

  return {
    models: computed(() => data.value?.data ?? []),
    activeModel,
    setActiveModel,
    refresh,
    fetchModelInfo,
    loadActiveModel
  }
}
