import type { Taxpayer } from '~/types'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const inn = query.inn as string | undefined

  if (!inn) {
    setResponseStatus(event, 400)
    return { message: 'INN is required' }
  }

  try {
    return await $fetch<Taxpayer>(
      `${config.public.backendUrl}/api/taxpayers/${inn}`
    )
  } catch (error) {
    console.error('Ошибка получения налогоплательщика:', error)
  }
})
