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
  taxType?: string
  mode: 'general' | 'average'
  scope: 'all' | 'alone'
  inn: undefined
  startYear?: number
  endYear?: number
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

export type GrowthApiItem = {
  'Year': number
  'Income': number
  'Tax': number
  'Transactions': number
  'IncomeGrowth_%': number | null
  'TaxGrowth_%': number | null
  'TransactionsGrowth_%': number | null
}

interface DashboardStatistics {
  taxpayers: number
  income: number
  tax: number
  transactions: number
  variation: GrowthData
}

export interface YearlyItem {
  Income: number
  Tax: number
  Transactions: number
  Year: number
}

export interface YearlyResponse {
  data: YearlyItem[]
}

export interface GrowthResponse {
  data: GrowthApiItem[]
}

export interface TaxpayersCountResponse {
  count: number
}

export interface MonthlyApiItem {
  Id: number
  Year: number
  Month: number
  Income: number
  Tax: number
  Transactions: number
  TaxType: string | null
  CreatedAt: string
}

export interface MonthlyResponse {
  success: boolean
  data: MonthlyApiItem[]
}

export interface MonthlyGeneralItem {
  Month: number
  Year: number
  TotalIncome: number
  TotalTax: number
  TotalTransactions: number
}

export interface MonthlyGeneralResponse {
  success: boolean
  data: MonthlyGeneralItem[]
}
