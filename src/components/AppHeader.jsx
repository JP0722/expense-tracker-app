import './AppHeader.css'

const AppHeader = ({ onLogout, loading }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-title">
          <h1>💰 Expense Tracker</h1>
          <p className="subtitle">Track your spending and manage your budget</p>
        </div>
        <button
          onClick={onLogout}
          disabled={loading}
          className="btn-logout"
          title="Logout"
        >
          {loading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </header>
  )
}

export default AppHeader
