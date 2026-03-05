import type { UpdateProfileResponse } from '~/types'

export default defineEventHandler(async (event): Promise<UpdateProfileResponse> => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const backend = config.public.backendUrl

  try {
    return await $fetch(`${backend}/api/settings/profile`, {
      method: 'PUT',
      body,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (err: unknown) {
    const e = err as { data?: { message?: string }, status?: number }

    throw createError({
      statusCode: e.status ?? 500,
      message: e.data?.message ?? 'Update profile failed'
    })
  }
})
