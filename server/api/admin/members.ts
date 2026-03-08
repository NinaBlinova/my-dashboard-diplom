import type { User } from '~/types'

export default defineEventHandler(async (): Promise<User[]> => {
  const config = useRuntimeConfig()
  const backend = config.public.backendUrl

  try {
    return await $fetch(`${backend}/api/admin/members`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (err: unknown) {
    const e = err as { data?: { message?: string }, status?: number }

    throw createError({
      statusCode: e.status ?? 500,
      message: e.data?.message ?? 'Failed to fetch members'
    })
  }
})
