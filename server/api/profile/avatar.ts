import type { UpdateProfileResponse } from '~/types'

export default defineEventHandler(async (event): Promise<UpdateProfileResponse> => {
  const config = useRuntimeConfig()
  const parts = await readMultipartFormData(event)
  const backend = config.public.backendUrl
  const formData = new FormData()

  for (const part of parts || []) {
    if (!part.name) continue

    if (part.filename) {
      formData.append(
        part.name,
        new Blob([part.data]),
        part.filename
      )
    } else {
      formData.append(
        part.name,
        part.data.toString()
      )
    }
  }

  return await $fetch(`${backend}/api/settings/avatar`, {
    method: 'PATCH',
    body: formData
  })
})
