import { useState } from 'react'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()

    setError('')

    if (!email.trim() || !password) {
      setError('Please enter email and password.')
      return
    }

    try {
      const response = await fetch(
        'https://careerpilot-061q.onrender.com/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Login failed.')
        return
      }

      localStorage.setItem('careerPilotLoggedIn', 'true')
      localStorage.setItem('careerPilotToken', data.token)

      localStorage.setItem(
        'careerPilotUser',
        JSON.stringify(data.user)
      )

      const savedProfile = localStorage.getItem('careerPilotProfile')

      if (!savedProfile) {
        localStorage.setItem(
          'careerPilotProfile',
          JSON.stringify({
            name: data.user.name,
            email: data.user.email,
            college: '',
            degree: '',
            graduationYear: '',
            skills: '',
            github: '',
            linkedin: '',
            careerGoal: ''
          })
        )
      }

      window.location.href = '/dashboard'
    } catch {
      setError('Unable to connect to server. Please try again.')
    }
  }

  return (
    <div className="login-page">

      <div className="login-box">

        <h1>Welcome Back</h1>

        <p className="login-subtitle">
          Login to continue your CareerPilot journey
        </p>

        {error && (
          <p className="login-error">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin}>

          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />

          <button
            type="submit"
            className="login-submit"
          >
            Login
          </button>

        </form>

        <p className="register-text">
          Don't have an account?
          <a href="/register"> Create Account</a>
        </p>

      </div>

    </div>
  )
}

export default Login