import type { Taxpayer } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()

    const query = getQuery(event)

    console.log('SERVER ROUTE QUERY:', query)

    const data = await $fetch<{
      data: Taxpayer[]
      total: number
      page: number
      pageSize: number
    }>(
      `${config.public.backendUrl}/api/taxpayers`,
      {
        query
      }
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
