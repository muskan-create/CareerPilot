import { useState } from 'react'
import './Settings.css'

function Settings() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('careerPilotTheme') || 'light'
  })

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('careerPilotTheme', newTheme)
    document.body.setAttribute('data-theme', newTheme)
  }

  const handleChangePassword = async (event) => {
    event.preventDefault()

    setPasswordMessage('')
    setPasswordError('')

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill all password fields.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.')
      return
    }

    try {
      setChangingPassword(true)

      const token = localStorage.getItem('careerPilotToken')

      if (!token) {
        setPasswordError('Please login again.')
        return
      }

      const response = await fetch(
        'http://127.0.0.1:5000/api/auth/change-password',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          },
          body: JSON.stringify({
            currentPassword,
            newPassword
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setPasswordError(data.message || 'Unable to change password.')
        return
      }

      setPasswordMessage('Password changed successfully.')

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch  {
      setPasswordError('Unable to connect to server.')
    } finally {
      setChangingPassword(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('careerPilotToken')
    localStorage.removeItem('careerPilotLoggedIn')
    localStorage.removeItem('careerPilotUser')
    window.location.href = '/'
  }

  return (
    <div className="settings-page">
      <div className="settings-container">

        <div className="settings-header">
          <p className="settings-small-heading">CAREERPILOT</p>
          <h1>Settings</h1>
          <p>Manage your account and application preferences.</p>
        </div>

        <div className="settings-card">
          <div className="settings-section-heading">
            <p>ACCOUNT</p>
            <h2>Account Settings</h2>
            <span>Manage your profile, resume and career progress.</span>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-icon profile-icon"></div>

              <div>
                <h3>Profile</h3>
                <p>Update your personal and career information.</p>
              </div>
            </div>

            <a href="/profile" className="settings-btn">
              Edit Profile →
            </a>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-icon resume-icon"></div>

              <div>
                <h3>Resume</h3>
                <p>Analyze and improve your resume.</p>
              </div>
            </div>

            <a href="/resume-analyzer" className="settings-btn">
              Resume Analyzer →
            </a>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-icon progress-icon"></div>

              <div>
                <h3>Progress</h3>
                <p>View your career preparation progress.</p>
              </div>
            </div>

            <a href="/progress" className="settings-btn">
              View Progress →
            </a>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-section-heading">
            <p>SECURITY</p>
            <h2>Change Password</h2>
            <span>Update your CareerPilot account password.</span>
          </div>

          <form
            className="password-form"
            onSubmit={handleChangePassword}
          >
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(event) =>
                setCurrentPassword(event.target.value)
              }
            />

            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(event.target.value)
              }
            />

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
            />

            <button
              type="submit"
              className="settings-btn"
              disabled={changingPassword}
            >
              {changingPassword
                ? 'Changing...'
                : 'Change Password'}
            </button>

            {passwordMessage && (
              <p className="success-message">
                {passwordMessage}
              </p>
            )}

            {passwordError && (
              <p className="error-message">
                {passwordError}
              </p>
            )}
          </form>
        </div>

        <div className="settings-card">
          <div className="settings-section-heading">
            <p>PREFERENCES</p>
            <h2>Appearance</h2>
            <span>Choose how CareerPilot looks.</span>
          </div>

          <div className="theme-options">

            <button
              type="button"
              className={`theme-option ${theme === 'light' ? 'active' : ''}`}
              onClick={() => handleThemeChange('light')}
            >
              <span className="theme-preview light-preview"></span>

              <span className="theme-option-content">
                <strong>Light</strong>
                <small>Black background and white text</small>
              </span>

              <span className="theme-check">
                {theme === 'light' ? '✓' : ''}
              </span>
            </button>

            <button
              type="button"
              className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => handleThemeChange('dark')}
            >
              <span className="theme-preview dark-preview"></span>

              <span className="theme-option-content">
                <strong>Dark</strong>
                <small>Deep blue background and white text</small>
              </span>

              <span className="theme-check">
                {theme === 'dark' ? '✓' : ''}
              </span>
            </button>

          </div>
        </div>

        <div className="settings-card danger-card">
          <div className="settings-section-heading">
            <p>ACCOUNT</p>
            <h2>Account</h2>
            <span>Manage your current CareerPilot session.</span>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-icon logout-icon"></div>

              <div>
                <h3>Logout</h3>
                <p>Sign out of your CareerPilot account.</p>
              </div>
            </div>

            <button
              type="button"
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        <a href="/dashboard" className="back-dashboard">
          ← Back to Dashboard
        </a>

      </div>
    </div>
  )
}

export default Settings