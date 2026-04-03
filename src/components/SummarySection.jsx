import './SummarySection.css'

const SummarySection = ({
  totalCost,
  categories,
  categoriesLoading,
  categoryStats,
  filterCategoryId,
  onFilterChange
}) => {
  return (
    <section className="summary-section">
      <div className="summary-card">
        <h3>Total Spending</h3>
        <p className="total-amount">₹{totalCost.toFixed(2)}</p>
      </div>

      <div className="filter-section">
        <h3>Filter by Category</h3>
        {categoriesLoading ? (
          <p className="loading">⏳ Loading categories...</p>
        ) : (
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterCategoryId === 'All' ? 'active' : ''}`}
              onClick={() => onFilterChange('All')}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`filter-btn ${filterCategoryId === cat.id.toString() ? 'active' : ''}`}
                onClick={() => onFilterChange(cat.id.toString())}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="stats-section">
        <h3>Category Summary</h3>
        {categoriesLoading ? (
          <p className="loading">⏳ Loading categories...</p>
        ) : (
          <div className="category-stats">
            {categories.map(cat => (
              <div key={cat.id} className="stat-item">
                <span className="stat-label">{cat.name}</span>
                <span className="stat-value">₹{categoryStats[cat.id].toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default SummarySection
