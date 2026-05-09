import { useState, useEffect } from 'react'
import './App.css'
import { useAuth } from './hooks/useAuth'
import { useExpenses } from './hooks/useExpenses'
import { useCategories } from './hooks/useCategories'
import { filterCurrentMonthExpenses } from './lib/dateUtils'
import Login from './components/Login'
import AppHeader from './components/AppHeader'
import ExpenseForm from './components/ExpenseForm'
import ExpensesList from './components/ExpensesList'
import SummarySection from './components/SummarySection'
import AddCategoryModal from './components/AddCategoryModal'
import BottomNavbar from './components/BottomNavbar'
import StatsView from './components/StatsView'

function App() {
  // Authentication
  const { user, loading: authLoading, error: authError, login, logout, isAuthenticated } = useAuth()

  // Data hooks
  const { expenses, loading: expensesLoading, error: expensesError, addExpense, deleteExpense } = useExpenses()
  const { categories, loading: categoriesLoading, addCategory } = useCategories()

  // Expense form state
  const [formData, setFormData] = useState({
    description: '',
    cost: '',
    category_id: '',
    date: new Date().toISOString().split('T')[0]
  })

  // UI state
  const [filterCategoryId, setFilterCategoryId] = useState('All')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategorySummary, setNewCategorySummary] = useState('')
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [activeTab, setActiveTab] = useState('home')

  // Set default category when categories load
  useEffect(() => {
    if (categories.length > 0 && !formData.category_id) {
      setFormData(prev => ({
        ...prev,
        category_id: categories[0].id.toString()
      }))
    }
  }, [categories])

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddExpense = async () => {
    if (!formData.cost || !formData.category_id) {
      setSubmitError('Please enter cost and select a category')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await addExpense({
        description: formData.description,
        cost: parseFloat(formData.cost),
        category_id: parseInt(formData.category_id),
        date: formData.date
      })
      setFormData({
        description: '',
        cost: '',
        category_id: categories.length > 0 ? categories[0].id.toString() : '',
        date: new Date().toISOString().split('T')[0]
      })
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setSubmitError('Category name cannot be empty')
      return
    }

    setIsAddingCategory(true)
    setSubmitError(null)
    try {
      const newCategory = await addCategory(newCategoryName, newCategorySummary)
      setNewCategoryName('')
      setNewCategorySummary('')
      setShowAddCategory(false)
      // Auto-select the new category
      setFormData(prev => ({
        ...prev,
        category_id: newCategory.id.toString()
      }))
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setIsAddingCategory(false)
    }
  }

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id)
    } catch (err) {
      setSubmitError(err.message)
    }
  }

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : 'Unknown'
  }

  // Get current month expenses
  const currentMonthExpenses = filterCurrentMonthExpenses(expenses)

  // Filter expenses by category from current month
  const filteredExpenses = filterCategoryId === 'All'
    ? currentMonthExpenses
    : currentMonthExpenses.filter(expense => expense.category_id === parseInt(filterCategoryId))

  // Calculate total cost for current month
  const totalCost = filteredExpenses.reduce((sum, expense) => sum + expense.cost, 0)
  
  // Calculate total for current month (for navbar)
  const currentMonthTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.cost, 0)

  // Calculate category stats for current month
  const getCategoryStats = () => {
    const stats = {}
    categories.forEach(cat => {
      stats[cat.id] = currentMonthExpenses
        .filter(e => e.category_id === cat.id)
        .reduce((sum, e) => sum + e.cost, 0)
    })
    return stats
  }

  const categoryStats = getCategoryStats()

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">⏳ Loading...</div>
      </div>
    )
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={login} loading={authLoading} error={authError} />
  }

  // Show main app if authenticated
  return (
    <div className="app-container">
      <AppHeader onLogout={logout} loading={authLoading} />

      <div className="content">
        {expensesError && <div className="alert alert-error">⚠️ {expensesError}</div>}

        {activeTab === 'home' ? (
          <>
            <ExpenseForm
              formData={formData}
              categories={categories}
              categoriesLoading={categoriesLoading}
              isSubmitting={isSubmitting}
              submitError={submitError}
              onFormChange={handleInputChange}
              onAddExpense={handleAddExpense}
              onShowAddCategory={() => setShowAddCategory(true)}
              onErrorDismiss={() => setSubmitError(null)}
            />

            <AddCategoryModal
              isOpen={showAddCategory}
              categoryName={newCategoryName}
              categorySummary={newCategorySummary}
              isSubmitting={isAddingCategory}
              error={submitError}
              onCategoryNameChange={(e) => setNewCategoryName(e.target.value)}
              onCategorySummaryChange={(e) => setNewCategorySummary(e.target.value)}
              onAdd={handleAddCategory}
              onClose={() => {
                setShowAddCategory(false)
                setNewCategoryName('')
                setNewCategorySummary('')
                setSubmitError(null)
              }}
            />

            <div className="main-grid">
              <SummarySection
                totalCost={totalCost}
                categories={categories}
                categoriesLoading={categoriesLoading}
                categoryStats={categoryStats}
                filterCategoryId={filterCategoryId}
                onFilterChange={setFilterCategoryId}
              />

              <ExpensesList
                expenses={filteredExpenses}
                loading={expensesLoading}
                getCategoryName={getCategoryName}
                onDeleteExpense={handleDeleteExpense}
              />
            </div>
          </>
        ) : (
          <StatsView
            expenses={expenses}
            categories={categories}
            loading={expensesLoading}
            getCategoryName={getCategoryName}
          />
        )}
      </div>

      <BottomNavbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        monthlyTotal={currentMonthTotal}
      />
    </div>
  )
}

export default App

