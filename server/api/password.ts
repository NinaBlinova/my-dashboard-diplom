import type { UpdateProfileResponse } from '~/types'

export default defineEventHandler(async (event): Promise<UpdateProfileResponse> => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const backend = config.public.backendUrl
  return await $fetch(`${backend}/api/settings/password`, {
    method: 'PATCH',
    body
  })
})
