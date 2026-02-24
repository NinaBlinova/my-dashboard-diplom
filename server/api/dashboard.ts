import type { GrowthResponse, MonthlyResponse } from '~/types'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const scope = query.scope as string
  const taxType = query.taxType as string | undefined
  const startYear = query.startYear as string | undefined
  const endYear = query.endYear as string | undefined
  const inn = query.inn as string | undefined

  const backend = config.public.backendUrl

  // 🔹 Alone logic
  if (scope === 'alone' && inn) {
    return await $fetch<MonthlyResponse>(
      `${backend}/api/dashboard/monthly/${inn}`,
      {
        query: {
          year: startYear
        }
      }
    )
  }

  // Monthly median
  if (query.type === 'monthly-median') {
    return await $fetch<GrowthResponse>(
      `${backend}/api/dashboard/monthly/median/${taxType ?? ''}`,
      {
        query: {
          startYear,
          endYear
        }
      }
    )
  }

  if (query.type === 'monthly-general') {
    const url = taxType
      ? `${backend}/api/dashboard/monthly/general/${taxType}`
      : `${backend}/api/dashboard/monthly/general`

    return await $fetch<MonthlyResponse>(url, {
      query: { startYear, endYear }
    })
  }

  const url = taxType
    ? `${backend}/api/dashboard/monthly/median/${taxType}`
    : `${backend}/api/dashboard/monthly/median`

  return await $fetch<MonthlyResponse>(url, {
    query: { startYear, endYear }
  })
})
