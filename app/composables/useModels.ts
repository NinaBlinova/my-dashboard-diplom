import type { ModelsItems } from '~/types'

export const useModels = () => {
  const { data, refresh } = useFetch<ModelsItems>('/api/models')
  const activeModel = useState<{ ModelName: string, ModelVersion: string } | null>('activeModel', () => null)

  const setActiveModel = async (model: { ModelName: string, ModelVersion: string }) => {
    await $fetch('/api/models/set_active', {
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

    return response.data // ← возвращаем ВЕСЬ массив
  }

  return {
    models: computed(() => data.value?.data ?? []),
    activeModel,
    setActiveModel,
    refresh,
    fetchModelInfo
  }
}
