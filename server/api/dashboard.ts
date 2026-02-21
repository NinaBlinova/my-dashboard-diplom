import type { GrowthResponse, MonthlyResponse } from '~/types'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const scope = query.scope as string
  const taxType = query.taxType as string | undefined
  const startYear = query.startYear as string | undefined
  const endYear = query.endYear as string | undefined

  const backend = config.public.backendUrl

  // Monthly median
  if (query.type === 'monthly-median') {
    const response = await $fetch<GrowthResponse>(
      `${backend}/api/dashboard/monthly/median/${taxType ?? ''}`,
      {
        query: {
          startYear,
          endYear
        }
      }
    )

    return response
  }

  if (query.type === 'monthly-general') {
    const url = taxType
      ? `${backend}/api/dashboard/monthly/general/${taxType}`
      : `${backend}/api/dashboard/monthly/general`

    return await $fetch<MonthlyResponse>(url, {
      query: { startYear, endYear }
    })
  }

  // 🔹 Alone logic
  if (scope === 'alone' && query.inn) {
    const response = await $fetch<GrowthResponse>(
      `${backend}/api/dashboard/yearly/growth/${query.inn}`
    )

    const latest = response.data?.at(-1)

    return {
      taxpayers: 1,
      income: latest?.Income ?? 0,
      tax: latest?.Tax ?? 0,
      transactions: latest?.Transactions ?? 0
    }
  }

  const url = taxType
    ? `${backend}/api/dashboard/monthly/median/${taxType}`
    : `${backend}/api/dashboard/monthly/median`

  return await $fetch<MonthlyResponse>(url, {
    query: { startYear, endYear }
  })
})
