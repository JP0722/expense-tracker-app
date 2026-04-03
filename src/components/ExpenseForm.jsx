import { useState, useEffect } from 'react'
import './ExpenseForm.css'

const ExpenseForm = ({
  formData,
  categories,
  categoriesLoading,
  isSubmitting,
  submitError,
  onFormChange,
  onAddExpense,
  onShowAddCategory,
  onErrorDismiss
}) => {
  const [localError, setLocalError] = useState(null)

  useEffect(() => {
    if (submitError) {
      setLocalError(submitError)
    }
  }, [submitError])

  const handleDismissError = () => {
    setLocalError(null)
    if (onErrorDismiss) {
      onErrorDismiss()
    }
  }

  return (
    <section className="form-section">
      <h2>Add New Expense</h2>
      {categoriesLoading ? (
        <p className="loading">⏳ Loading categories...</p>
      ) : (
        <div className="form-group">
          {localError && (
            <div className="alert alert-error">
              <span>⚠️ {localError}</span>
              <button
                className="alert-close"
                onClick={handleDismissError}
                type="button"
              >
                ✕
              </button>
            </div>
          )}

          <div className="form-row">
            <input
              type="text"
              name="description"
              placeholder="Description (optional)"
              value={formData.description}
              onChange={onFormChange}
              className="input"
              disabled={isSubmitting}
            />
            <input
              type="number"
              name="cost"
              placeholder="Cost"
              value={formData.cost}
              onChange={onFormChange}
              className="input"
              step="0.01"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-row">
            <div className="category-input-group">
              <select
                name="category_id"
                value={formData.category_id}
                onChange={onFormChange}
                className="input"
                disabled={isSubmitting}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button
                onClick={onShowAddCategory}
                className="btn-add-category"
                title="Add new category"
                disabled={isSubmitting}
                type="button"
              >
                +
              </button>
            </div>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={onFormChange}
              className="input"
              disabled={isSubmitting}
            />
          </div>

          <button
            onClick={onAddExpense}
            className="btn-add"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Expense'}
          </button>
        </div>
      )}
    </section>
  )
}

export default ExpenseForm
