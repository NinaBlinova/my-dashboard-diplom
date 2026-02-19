import type { AvatarProps } from '@nuxt/ui'

export type UserStatus = 'subscribed' | 'unsubscribed' | 'bounced'
export type SaleStatus = 'paid' | 'failed' | 'refunded'

export interface Taxpayer {
  id: number
  name: string
  INN: string
  avatar?: AvatarProps
  TaxpayerType: UserStatus
  registration_district: string
  has_employees: boolean
}

// тут скорее всего нужно будет не User, а Employer
export interface Mail {
  id: number
  unread?: boolean
  from: Taxpayer
  subject: string
  body: string
  date: string
}

export interface Member {
  name: string
  username: string
  role: 'member' | 'owner'
  avatar: AvatarProps
}

export interface Stat {
  title: string
  icon: string
  value: number | string
  variation: number
  formatter?: (value: number) => string
}

export interface Sale {
  id: string
  date: string
  status: SaleStatus
  email: string
  amount: number
}

export interface Notification {
  id: number
  unread?: boolean
  sender: Taxpayer
  body: string
  date: string
}

export type Period = 'daily' | 'weekly' | 'monthly'

export interface Range {
  start: Date
  end: Date
}

export interface DashboardFilters {
  range: Range
  period: Period
  taxType?: string
  mode: 'general' | 'average'
  scope: 'all' | 'alone'
  inn: undefined
}

interface YearsResponse {
  data?: {
    max_year?: number
    min_year?: number
    years?: number[]
  }
  success: boolean
}

interface GrowthData {
  TotalIncomeGrowth?: number | null
  TotalTaxGrowth?: number | null
  TotalTransactionsGrowth?: number | null
}

export interface GrowthApiItem {
  'IncomeGrowth_%': number | null
  'TaxGrowth_%': number | null
  'TransactionsGrowth_%': number | null
  'Year': number
}

interface DashboardStatistics {
  taxpayers: number
  income: number
  tax: number
  transactions: number
  variation: GrowthData
}
