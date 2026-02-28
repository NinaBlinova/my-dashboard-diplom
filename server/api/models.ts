import type { ModelItem, ModelsItems } from '~/types'

export default defineEventHandler(async (event): Promise<ModelsItems> => {
  const config = useRuntimeConfig()
  const backend = config.public.backendUrl
  const query = getQuery(event)
  const modelName = query.ModelName as string | undefined
  const modelVersion = query.ModelVersion as string | undefined
  if (modelName && modelVersion) {
    const response = await $fetch<{ success: boolean, data: ModelItem[] }>(
      `${backend}/api/models/info`,
      {
        method: 'GET',
        query: { ModelName: modelName, ModelVersion: modelVersion }
      }
    )
    return { data: response.data }
  }
  return await $fetch<ModelsItems>(`${backend}/api/models/`)
})
