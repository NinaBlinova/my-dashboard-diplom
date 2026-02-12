import type { Taxpayer } from '~/types'

export default defineEventHandler(async () => {
  try {
    const config = useRuntimeConfig()

    // запрос к Flask backend
    const data = await $fetch<Taxpayer[]>(
      `${config.public.backendUrl}/api/taxpayers`
    )

    return data
  } catch (error) {
    console.error('Ошибка получения налогоплательщиков:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch taxpayers'
    })
  }
})
