import type { ModelItem, ModelsItems } from '~/types'

export default defineEventHandler(async (event): Promise<ModelsItems> => {
  const config = useRuntimeConfig()
  const backend = config.public.backendUrl
  const query = getQuery(event)
  const method = event.method

  const modelName = query.ModelName as string | undefined
  const modelVersion = query.ModelVersion as string | undefined
  const active = query.active as string | undefined

  if (method === 'GET' && active === 'true') {
    return await $fetch(`${backend}/api/models/active`)
  }

  if (method === 'GET' && modelName && modelVersion) {
    const response = await $fetch<{ success: boolean, data: ModelItem[] }>(
      `${backend}/api/models/info`,
      {
        method: 'GET',
        query: { ModelName: modelName, ModelVersion: modelVersion }
      }
    )

    return { data: response.data }
  }

  if (method === 'GET') {
    return await $fetch<ModelsItems>(`${backend}/api/models/`)
  }

  if (method === 'POST') {
    const body = await readBody(event)

    return await $fetch(`${backend}/api/models/set_active`, {
      method: 'POST',
      body
    })
  }

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
