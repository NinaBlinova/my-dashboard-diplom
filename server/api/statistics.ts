import type { GrowthData, GrowthApiItem } from '~/types'

type GrowthResponse = {
  data: GrowthApiItem[]
  success: boolean
}

type TaxpayersCountResponse = {
  count: number
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const scope = query.scope as string
  const taxType = query.taxType as string | undefined
  const inn = query.inn as string | undefined
  const backend = config.public.backendUrl

  if (scope === 'alone' && inn) {
    const response = await $fetch<GrowthResponse>(
      `${backend}/api/dashboard/yearly/growth/${inn}`
    )

    const latest = response.data?.at(-1)

    return {
      taxpayers: 1,
      income: latest?.Income ?? 0,
      tax: latest?.Tax ?? 0,
      transactions: latest?.Transactions ?? 0,
      variation: roundVariation(latest)
    }
  }

  const taxpayersUrl = taxType
    ? `${config.public.backendUrl}/api/dashboard/taxpayers/${taxType}`
    : `${config.public.backendUrl}/api/dashboard/taxpayers`

  const [count, yearly] = await Promise.all([
    $fetch<TaxpayersCountResponse>(taxpayersUrl),
    $fetch<GrowthResponse>(
      taxType
        ? `${backend}/api/dashboard/yearly/growth/median/${taxType}`
        : `${backend}/api/dashboard/yearly/growth/median`
    )
  ])

  const latest = yearly.data?.at(-1)

  return {
    taxpayers: count.count ?? 0,
    income: latest?.Income ?? 0,
    tax: latest?.Tax ?? 0,
    transactions: latest?.Transactions ?? 0,
    variation: roundVariation(latest)
  }
})

function roundVariation(growth?: GrowthApiItem): GrowthData {
  return {
    TotalIncomeGrowth: round(growth?.['IncomeGrowth_%'] ?? 0),
    TotalTaxGrowth: round(growth?.['TaxGrowth_%'] ?? 0),
    TotalTransactionsGrowth: round(growth?.['TransactionsGrowth_%'] ?? 0)
  }
}

function round(value: number) {
  return Number(value.toFixed(2))
}
