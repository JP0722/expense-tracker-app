// Date utility functions for filtering expenses

export const getStartOfMonth = (date = new Date()) => {
  const d = new Date(date)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d
}

export const getEndOfMonth = (date = new Date()) => {
  const d = new Date(date)
  d.setMonth(d.getMonth() + 1)
  d.setDate(0)
  d.setHours(23, 59, 59, 999)
  return d
}

export const getStartOfYear = (date = new Date()) => {
  const d = new Date(date)
  d.setMonth(0)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d
}

export const getStartOfDay = (date = new Date()) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export const getEndOfDay = (date = new Date()) => {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

export const filterExpensesByDateRange = (expenses, startDate, endDate) => {
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date)
    return expenseDate >= startDate && expenseDate <= endDate
  })
}

export const filterCurrentMonthExpenses = (expenses) => {
  const startOfMonth = getStartOfMonth()
  const endOfMonth = getEndOfMonth()
  return filterExpensesByDateRange(expenses, startOfMonth, endOfMonth)
}

export const filterYearToDateExpenses = (expenses) => {
  const startOfYear = getStartOfYear()
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  return filterExpensesByDateRange(expenses, startOfYear, today)
}

export const filterDailyExpenses = (expenses, date = new Date()) => {
  const startOfDay = getStartOfDay(date)
  const endOfDay = getEndOfDay(date)
  return filterExpensesByDateRange(expenses, startOfDay, endOfDay)
}

export const getTotalExpenses = (expenses) => {
  return expenses
}

export const getCurrentMonthYear = () => {
  const date = new Date()
  return date.toLocaleString('default', { month: 'long', year: 'numeric' })
}

export const getMonthYear = (date) => {
  return date.toLocaleString('default', { month: 'long', year: 'numeric' })
}
