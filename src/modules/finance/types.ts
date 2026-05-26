export type FinanceKPIs = {
  ingresos: number
  gastos: number
  balance: number
  flujoNeto: number
  savingsRate: number
  ingresosPrevMonth: number
  gastosPrevMonth: number
  movimientosCount: number
  fuentesCount: number
}

export type MonthlyPoint = {
  month: string
  ingresos: number
  gastos: number
}

export type Movement = {
  id: string
  date: string
  concept: string
  subconcept: string
  category: string
  source: string
  status: 'received' | 'pending'
  amount: number
  currency: string
  type: 'in' | 'out'
}

export type CategoryTotal = {
  category: string
  amount: number
  percentage: number
}

export type SourceTotal = {
  source: string
  channelName: string
  amount: number
  percentage: number
  trend: number
}
