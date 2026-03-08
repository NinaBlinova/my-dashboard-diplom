export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const backend = config.public.backendUrl
  const body = await readBody(event)

  try {
    return await $fetch(`${backend}/api/admin/activate_user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })
  } catch (err: unknown) {
    const e = err as { data?: { message?: string }, status?: number }

    throw createError({
      statusCode: e.status ?? 500,
      message: e.data?.message ?? 'Failed to activate user'
    })
  }
})
