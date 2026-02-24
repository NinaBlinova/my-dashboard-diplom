import type { GrowthApiItem } from '~/types'

type GrowthResponse = {
  data: GrowthApiItem[]
  success: boolean
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const scope = query.scope as string
  const taxType = query.taxType as string | undefined
  const inn = query.inn as string | undefined

  const backend = config.public.backendUrl

  if (scope === 'alone' && inn) {
    return await $fetch<GrowthResponse>(
      `${backend}/api/dashboard/yearly/growth/${inn}`
    )
  }

  return await $fetch<GrowthResponse>(
    taxType
      ? `${backend}/api/dashboard/yearly/growth/median/${taxType}`
      : `${backend}/api/dashboard/yearly/growth/median`
  )
})
