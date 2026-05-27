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

export type IncomeRaw = {
  source: string
  channel_name: string | null
  amount_original: number
  currency_original: string
  amount_clp: number | null
  payment_date: string
  status: string
  method: string | null
  notes: string | null
}

export type ExpenseRaw = {
  category: string
  amount: number
  currency_code: string
  expense_date: string
  description: string | null
}

export type MovementRaw = ({ type: 'in' } & IncomeRaw) | ({ type: 'out' } & ExpenseRaw)

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
  raw: MovementRaw
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
