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
  employees_count: number
  passport: string
  activity_type: string
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

export interface YearsResponse {
  data?: {
    max_year?: number
    min_year?: number
    years?: number[]
  }
  success: boolean
}

export interface GrowthData {
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

export interface GrowthResponse {
  data: GrowthApiItem[]
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

export interface ModelItem {
  CreatedAt: string
  MAE: number
  ModelName: string
  ModelVersion: string
  R2: number
  RMSE: number
  TargetName: string
}

export interface ModelsItems {
  data: ModelItem[]
}

export interface User {
  Id: number
  password: string
  Username: string
  Email: string
  FullName: string
  Bio?: string

  Phone?: string
  BirthDate?: string
  Gender?: string
  Address_Reg?: string

  PassportSeries?: string
  PassportNumber?: string
  PassportIssuedBy?: string
  PassportIssueDate?: string

  SNILS?: string
  INN?: string
  OMSPolicyNumber?: string

  Avatar?: string
  CreatedAt: string
  IsActive: number
  user_role: string
}

export interface LoginResponse {
  success: boolean
  user: User
  message?: string
}

export interface UpdateProfileResponse {
  success: boolean
  user: User
  message: string
}

export interface UserLog {
  LogId: number
  UserId: number
  Username: string
  Action: string
  AdditionalInfo: string | null
  ActionDate: string
}

export interface UserLogsResponse {
  success: boolean
  logs: UserLog[]
}
