import { useState } from 'react'
import './Login.css'

const Login = ({ onLogin, loading, error: authError }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError('Please enter your email')
      return
    }

    if (!password) {
      setError('Please enter your password')
      return
    }

    try {
      await onLogin(email, password)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'email') setEmail(value)
    if (name === 'password') setPassword(value)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>💰 Expense Tracker</h1>
          <p className="login-subtitle">Track your spending and manage your budget</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              disabled={loading}
              className="login-input"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              disabled={loading}
              className="login-input"
              onKeyPress={(e) => e.key === 'Enter' && !loading && handleSubmit(e)}
            />
          </div>

          {(error || authError) && (
            <div className="alert alert-error">
              ⚠️ {error || authError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-login"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="login-note">
          💡 This is a private app for you and your partner. Use your registered email and password to login.
        </p>
      </div>
    </div>
  )
}

export default Login
