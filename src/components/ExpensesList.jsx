import './ExpensesList.css'

const ExpensesList = ({
  expenses,
  loading,
  getCategoryName,
  onDeleteExpense
}) => {
  return (
    <section className="expenses-section">
      <h2>Expenses ({expenses.length})</h2>
      {loading ? (
        <div className="loading">⏳ Loading expenses...</div>
      ) : (
        <div className="expenses-list">
          {expenses.length === 0 ? (
            <p className="no-expenses">No expenses yet. Add one to get started!</p>
          ) : (
            expenses.map(expense => (
              <div key={expense.id} className="expense-item">
                <div className="expense-info">
                  <div className="expense-details">
                    <h4>{expense.description}</h4>
                    <p className="expense-meta">
                      <span className="category-tag">
                        {getCategoryName(expense.category_id)}
                      </span>
                      <span className="date">
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                  <div className="expense-amount">
                    <p className="amount">₹{expense.cost.toFixed(2)}</p>
                  </div>
                </div>
                <button
                  className="btn-delete"
                  onClick={() => onDeleteExpense(expense.id)}
                  title="Delete expense"
                  type="button"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  )
}

export default ExpensesList
