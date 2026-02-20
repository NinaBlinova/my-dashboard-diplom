import type { GrowthData, GrowthApiItem } from '~/types'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const query = getQuery(event)

  const scope = query.scope as string
  const taxType = query.taxType as string | undefined
  const inn = query.inn as string | undefined

  const backend = config.public.backendUrl

  if (scope === 'alone' && inn) {
    const [yearly, growth] = await Promise.all([
      $fetch(`${config.public.backendUrl}/api/dashboard/yearly/median/${inn}`),
      $fetch(`${config.public.backendUrl}/api/dashboard/yearly/growth/${inn}`)
    ])

    const latest = yearly.data?.at(-1) || {}
    const latestGrowth = growth.data?.at(-1) || {}

    return {
      taxpayers: 1,
      income: latest.Income || 0,
      tax: latest.Tax || 0,
      transactions: latest.Transactions || 0,
      variation: roundVariation(latestGrowth)
    }
  }

  const taxpayersUrl = taxType
    ? `${config.public.backendUrl}/api/dashboard/taxpayers/${taxType}`
    : `${config.public.backendUrl}/api/dashboard/taxpayers`

  const [count, yearly] = await Promise.all([
    $fetch(taxpayersUrl),
    $fetch(
      taxType
        ? `${backend}/api/dashboard/yearly/growth/median/${taxType}`
        : `${backend}/api/dashboard/yearly/growth/median`
    )
  ])

  const latest = yearly.data?.at(-1) ?? {}

  return {
    taxpayers: count.count ?? 0,
    income: latest.Income ?? 0,
    tax: latest.Tax ?? 0,
    transactions: latest.Transactions ?? 0,
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
