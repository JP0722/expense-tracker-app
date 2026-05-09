import './BottomNavbar.css'

const BottomNavbar = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bottom-navbar">
      <button
        className={`navbar-tab ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => onTabChange('home')}
        title="Add Expense"
      >
        <span className="navbar-icon">➕</span>
        <span className="navbar-label">Home</span>
      </button>

      <button
        className={`navbar-tab ${activeTab === 'stats' ? 'active' : ''}`}
        onClick={() => onTabChange('stats')}
        title="View Stats"
      >
        <span className="navbar-icon">📊</span>
        <span className="navbar-label">Stats</span>
      </button>
    </nav>
  )
}

export default BottomNavbar
