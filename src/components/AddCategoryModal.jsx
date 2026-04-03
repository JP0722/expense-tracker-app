import './AddCategoryModal.css'

const AddCategoryModal = ({
  isOpen,
  categoryName,
  categorySummary,
  isSubmitting,
  error,
  onCategoryNameChange,
  onCategorySummaryChange,
  onAdd,
  onClose
}) => {
  if (!isOpen) return null

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isSubmitting) {
      onAdd()
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Category</h3>
          <button
            className="modal-close"
            onClick={onClose}
            disabled={isSubmitting}
            type="button"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            ⚠️ {error}
          </div>
        )}

        <div className="modal-form">
          <div className="form-group">
            <label htmlFor="categoryName">Category Name</label>
            <input
              id="categoryName"
              type="text"
              placeholder="Category name"
              value={categoryName}
              onChange={onCategoryNameChange}
              className="input"
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="categorySummary">Summary (optional)</label>
            <textarea
              id="categorySummary"
              placeholder="Summary"
              value={categorySummary}
              onChange={onCategorySummaryChange}
              className="input textarea"
              disabled={isSubmitting}
              rows="4"
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>

        <div className="modal-buttons">
          <button
            onClick={onAdd}
            className="btn-add"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add'}
          </button>
          <button
            onClick={onClose}
            className="btn-cancel"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddCategoryModal
