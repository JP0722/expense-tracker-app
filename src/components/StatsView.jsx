import { useState } from 'react'
import './StatsView.css'
import {
  filterCurrentMonthExpenses,
  filterYearToDateExpenses,
  filterDailyExpenses,
  getTotalExpenses,
  getMonthYear,
  getCurrentMonthYear
} from '../lib/dateUtils'

const StatsView = ({
  expenses,
  categories,
  loading,
  getCategoryName
}) => {
  const [filterType, setFilterType] = useState('month')
  const [showCategoryBreakdown, setShowCategoryBreakdown] = useState(true)
  const [showDetailedExpenses, setShowDetailedExpenses] = useState(true)

  const getFilteredExpenses = () => {
    switch (filterType) {
      case 'month':
        return filterCurrentMonthExpenses(expenses)
      case 'year':
        return filterYearToDateExpenses(expenses)
      case 'daily':
        return filterDailyExpenses(expenses)
      case 'total':
        return getTotalExpenses(expenses)
      default:
        return filterCurrentMonthExpenses(expenses)
    }
  }

  const getFilterLabel = () => {
    switch (filterType) {
      case 'month':
        return `Month to Date (${getCurrentMonthYear()})`
      case 'year':
        return 'Year to Date'
      case 'daily':
        return 'Today'
      case 'total':
        return 'Total'
      default:
        return getCurrentMonthYear()
    }
  }

  const filteredExpenses = getFilteredExpenses()

  // Calculate total for filtered expenses
  const totalFiltered = filteredExpenses.reduce((sum, exp) => sum + exp.cost, 0)

  // Calculate category stats for filtered expenses
  const getCategoryStats = () => {
    const stats = {}
    categories.forEach(cat => {
      stats[cat.id] = filteredExpenses
        .filter(e => e.category_id === cat.id)
        .reduce((sum, e) => sum + e.cost, 0)
    })
    return stats
  }

  const categoryStats = getCategoryStats()

  if (loading) {
    return <div className="stats-view">⏳ Loading stats...</div>
  }

  return (
    <div className="stats-view">
      <div className="stats-header">
        <h2>📊 Expense Analytics</h2>
      </div>

      <div className="stats-filter-section">
        <label>View:</label>
        <div className="stats-filter-buttons">
          <button
            className={`filter-btn ${filterType === 'month' ? 'active' : ''}`}
            onClick={() => setFilterType('month')}
          >
            Month
          </button>
          <button
            className={`filter-btn ${filterType === 'year' ? 'active' : ''}`}
            onClick={() => setFilterType('year')}
          >
            Year
          </button>
          <button
            className={`filter-btn ${filterType === 'daily' ? 'active' : ''}`}
            onClick={() => setFilterType('daily')}
          >
            Today
          </button>
          <button
            className={`filter-btn ${filterType === 'total' ? 'active' : ''}`}
            onClick={() => setFilterType('total')}
          >
            Total
          </button>
        </div>
      </div>

      <div className="stats-summary-card">
        <div className="filter-label">{getFilterLabel()}</div>
        <div className="total-amount">₹{totalFiltered.toFixed(2)}</div>
        <div className="expense-count">
          {filteredExpenses.length} {filteredExpenses.length === 1 ? 'expense' : 'expenses'}
        </div>
      </div>

      <div className="stats-category-breakdown">
        <div className="dropdown-header" onClick={() => setShowCategoryBreakdown(!showCategoryBreakdown)}>
          <h3>Category Breakdown</h3>
          <span className={`dropdown-arrow ${showCategoryBreakdown ? 'open' : ''}`}>▼</span>
        </div>
        {showCategoryBreakdown && (
          <>
            {categories.length === 0 ? (
              <p className="no-data">No categories available</p>
            ) : (
              <div className="category-list">
                {categories.map(cat => {
                  const amount = categoryStats[cat.id] || 0
                  const percentage = totalFiltered > 0 ? ((amount / totalFiltered) * 100).toFixed(1) : 0
                  return (
                    <div key={cat.id} className="category-item">
                      <div className="category-info">
                        <span className="category-name">{cat.name}</span>
                        <span className="category-count">
                          {filteredExpenses.filter(e => e.category_id === cat.id).length} items
                        </span>
                      </div>
                      <div className="category-amount-section">
                        <span className="category-amount">₹{amount.toFixed(2)}</span>
                        <span className="category-percentage">{percentage}%</span>
                      </div>
                      <div className="category-bar">
                        <div
                          className="category-bar-fill"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>

      <div className="stats-detailed-list">
        <div className="dropdown-header" onClick={() => setShowDetailedExpenses(!showDetailedExpenses)}>
          <h3>Detailed Expenses</h3>
          <span className={`dropdown-arrow ${showDetailedExpenses ? 'open' : ''}`}>▼</span>
        </div>
        {showDetailedExpenses && (
          <>
            {filteredExpenses.length === 0 ? (
              <p className="no-data">No expenses for this period</p>
            ) : (
              <div className="expense-items">
                {filteredExpenses.map((expense, idx) => (
                  <div key={`${expense.id}-${idx}`} className="detailed-expense-item">
                    <div className="expense-header">
                      <span className="expense-date">
                        {new Date(expense.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="expense-category">{getCategoryName(expense.category_id)}</span>
                    </div>
                    <div className="expense-details">
                      <span className="expense-description">
                        {expense.description || 'No description'}
                      </span>
                      <span className="expense-cost">₹{expense.cost.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default StatsView
