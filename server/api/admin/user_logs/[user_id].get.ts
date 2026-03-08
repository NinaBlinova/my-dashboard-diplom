import type { User } from '~/types'

export default defineEventHandler(async (event): Promise<User[]> => {
  const config = useRuntimeConfig()
  const backend = config.public.backendUrl

  const userId = getRouterParam(event, 'user_id')
  const query = getQuery(event)

  try {
    return await $fetch(`${backend}/api/admin/user_logs/${userId}`, {
      method: 'GET',
      query,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (err: unknown) {
    const e = err as { data?: { message?: string }, status?: number }

    throw createError({
      statusCode: e.status ?? 500,
      message: e.data?.message ?? 'Failed to fetch user logs'
    })
  }
})
