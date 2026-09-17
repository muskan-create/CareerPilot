import { useState } from 'react'
import './Register.css'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  async function handleRegister(e) {
    e.preventDefault()

    setError('')

    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError('Please fill all fields.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Registration failed.')
        return
      }

      alert('Account created successfully! 🎉')

      window.location.href = '/login'
    } catch {
      setError('Unable to connect to server. Please try again.')
    }
  }

  return (
    <div className="register-page">

      <div className="register-box">

        <h1>Create Account</h1>

        <p className="register-subtitle">
          Start your CareerPilot journey today
        </p>

        {error && (
          <p className="register-error">
            {error}
          </p>
        )}

        <form onSubmit={handleRegister}>

          <label>
            Full Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
          />

          <label>
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />

          <label>
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
          />

          <label>
            Confirm Password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
          />

          <button
            type="submit"
            className="register-submit"
          >
            Create Account
          </button>

        </form>

        <p className="login-text">
          Already have an account?
          <a href="/login"> Login</a>
        </p>

      </div>

    </div>
  )
}

export default Register