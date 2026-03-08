export default defineEventHandler(async (event) => {
  const body = await readBody(event) // читаем POST-данные
  const config = useRuntimeConfig()
  const backend = config.public.backendUrl

  try {
    return await $fetch(`${backend}/api/auth/login`, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (err: unknown) {
    const e = err as { data?: { message?: string }, status?: number }

    throw createError({
      statusCode: e.status ?? 500,
      message: e.data?.message ?? 'Login failed'
    })
  }
})
