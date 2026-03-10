import type { UpdateProfileResponse } from '~/types'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const backend = config.public.backendUrl
  const body = await readBody(event)

  try {
    return await $fetch<UpdateProfileResponse>(`${backend}/api/admin/edit_user`, {
      method: 'PUT',
      body
    })
  } catch (err: unknown) {
    const e = err as {
      status?: number
      data?: { message?: string }
    }

    console.error('Backend error:', e.data ?? e)

    throw createError({
      statusCode: e.status ?? 500,
      message: e.data?.message ?? 'Failed to edit user'
    })
  }
})
