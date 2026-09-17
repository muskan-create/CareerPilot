import { useState, useEffect } from 'react'
import './Dashboard.css'

function Dashboard() {

  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem('careerPilotProfile')

    if (!savedProfile) {
      return null
    }

    try {
      return JSON.parse(savedProfile)
    } catch {
      return null
    }
  })

  const [resumeScore, setResumeScore] = useState(() => {
    const savedScore = localStorage.getItem('resumeScore')
    return savedScore ? Number(savedScore) : 0
  })

  const [dsaProblems, setDsaProblems] = useState(() => {
    const savedProblems = localStorage.getItem('dsaProblems')

    if (!savedProblems) {
      return []
    }

    try {
      return JSON.parse(savedProblems)
    } catch {
      return []
    }
  })

  const [mockInterviewCount, setMockInterviewCount] = useState(() => {
    const savedCount = localStorage.getItem('mockInterviewCount')
    return savedCount ? Number(savedCount) : 0
  })

  useEffect(() => {

    async function loadDashboardProfile() {
      try {
        const token = localStorage.getItem('careerPilotToken')

        if (!token) {
          return
        }

        const response = await fetch(
          'http://127.0.0.1:5000/api/auth/profile',
          {
            headers: {
              Authorization: 'Bearer ' + token
            }
          }
        )

        const data = await response.json()

      if (response.ok && data.user) {
  setProfile(data.user)

  setResumeScore(data.user.resumeScore || 0)

  localStorage.setItem(
    'careerPilotProfile',
    JSON.stringify(data.user)
  )

  localStorage.setItem(
    'resumeScore',
    String(data.user.resumeScore || 0)
  )
}
setDsaProblems(data.user.dsaProblems || [])

localStorage.setItem(
  'dsaProblems',
  JSON.stringify(data.user.dsaProblems || [])
)
      } catch {
        console.log('Unable to load dashboard profile')
      }
    }

    const updateDashboardData = () => {

      loadDashboardProfile()

      const savedResumeScore =
        localStorage.getItem('resumeScore')

      setResumeScore(
        savedResumeScore
          ? Number(savedResumeScore)
          : 0
      )

      const savedProblems =
        localStorage.getItem('dsaProblems')

      if (savedProblems) {
        try {
          setDsaProblems(JSON.parse(savedProblems))
        } catch {
          setDsaProblems([])
        }
      } else {
        setDsaProblems([])
      }

      const savedCount =
        localStorage.getItem('mockInterviewCount')

      setMockInterviewCount(
        savedCount
          ? Number(savedCount)
          : 0
      )
    }

    updateDashboardData()

    window.addEventListener(
      'storage',
      updateDashboardData
    )

    window.addEventListener(
      'focus',
      updateDashboardData
    )

    return () => {
      window.removeEventListener(
        'storage',
        updateDashboardData
      )

      window.removeEventListener(
        'focus',
        updateDashboardData
      )
    }

  }, [])

  let completedFields = 0

  if (profile) {

    if (profile.name) completedFields++
    if (profile.email) completedFields++
    if (profile.college) completedFields++
    if (profile.degree) completedFields++
    if (profile.graduationYear) completedFields++
    if (profile.skills) completedFields++
    if (profile.github) completedFields++
    if (profile.linkedin) completedFields++
    if (profile.careerGoal) completedFields++

  }

  const profileCompletion = Math.round(
    (completedFields / 9) * 100
  )

  const dsaSolved = dsaProblems.filter(
    (problem) => problem.solved
  ).length

  const dsaProgress = dsaProblems.length === 0
    ? 0
    : Math.round(
        (dsaSolved / dsaProblems.length) * 100
      )

  const overallProgress = Math.round(
    (
      profileCompletion +
      resumeScore +
      dsaProgress
    ) / 3
  )

  return (
    <div className="dashboard">

      <aside className="sidebar">

        <div className="dashboard-logo">
          CareerPilot
        </div>

        <nav className="sidebar-menu">

          <a href="/dashboard">
            🏠 Dashboard
          </a>

          <a href="/profile">
            👤 Profile
          </a>

          <a href="/resume-analyzer">
            📄 Resume Analyzer
          </a>

          <a href="/dsa-tracker">
            💻 DSA Tracker
          </a>

          <a href="/mock-interview">
            🎤 Mock Interview
          </a>

          <a href="/progress">
            📊 Progress & Analytics
          </a>

          <a href="/job-recommendations">
            💼 Job Recommendations
          </a>

          <a href="/settings">
            ⚙️ Settings
          </a>

        </nav>

        <button
          className="logout"
          onClick={() => {
            localStorage.removeItem('careerPilotLoggedIn')
            localStorage.removeItem('careerPilotToken')
            localStorage.removeItem('careerPilotUser')
            window.location.href = '/login'
          }}
        >
          Logout
        </button>

      </aside>

      <main className="dashboard-main">

        <div className="dashboard-header">

          <div>

            <p className="dashboard-small-heading">
              STUDENT DASHBOARD
            </p>

            <h1>
              Welcome, {profile?.name || 'Student'} 👋
            </h1>

            <p>
              Career Goal: {profile?.careerGoal || 'Not selected yet'}
            </p>

          </div>

          <div className="profile-circle">

            {profile?.name
              ? profile.name.charAt(0).toUpperCase()
              : 'M'}

          </div>

        </div>

        <div className="profile-card">

          <div className="profile-info">

            <div className="large-profile-circle">

              {profile?.name
                ? profile.name.charAt(0).toUpperCase()
                : 'M'}

            </div>

            <div>

              <h2>
                Profile Completion: {profileCompletion}%
              </h2>

              <p>
                {profileCompletion === 100
                  ? 'Your profile is complete! 🎉'
                  : 'Complete your profile to get better career recommendations.'}
              </p>

            </div>

          </div>

          <a
            href="/profile"
            className="complete-profile-btn"
          >
            {profileCompletion === 100
              ? 'Edit Profile →'
              : 'Complete Profile →'}
          </a>

        </div>

        <div className="stats-grid">

          <div className="stat-card">

            <h3>
              {dsaProblems.length}
            </h3>

            <p>
              DSA Problems
            </p>

            <small>
              {dsaSolved} solved • {dsaProgress}% progress
            </small>

          </div>

          <div className="stat-card">

            <h3>
              {resumeScore}%
            </h3>

            <p>
              Resume Score
            </p>

          </div>

          <div className="stat-card">

            <h3>
              {mockInterviewCount}
            </h3>

            <p>
              Mock Interviews
            </p>

          </div>

          <div className="stat-card">

            <h3>
              {overallProgress}%
            </h3>

            <p>
              Overall Progress
            </p>

          </div>

        </div>

        <h2 className="dashboard-title">
          Your Career Tools
        </h2>

        <div className="dashboard-cards">

          <div className="dashboard-card">

            <div className="dashboard-icon">
              📄
            </div>

            <h3>
              Resume Analyzer
            </h3>

            <p>
              Analyze your resume and find areas for improvement.
            </p>

            <a
              href="/resume-analyzer"
              className="tool-btn"
            >
              Analyze Resume →
            </a>

          </div>

          <div className="dashboard-card">

            <div className="dashboard-icon">
              💻
            </div>

            <h3>
              DSA Tracker
            </h3>

            <p>
              Track your DSA practice and coding progress.
            </p>

            <a
              href="/dsa-tracker"
              className="tool-btn"
            >
              Start Practicing →
            </a>

          </div>

          <div className="dashboard-card">

            <div className="dashboard-icon">
              🎤
            </div>

            <h3>
              AI Mock Interview
            </h3>

            <p>
              Practice interviews and improve your confidence.
            </p>

            <a
              href="/mock-interview"
              className="tool-btn"
            >
              Start Interview →
            </a>

          </div>

          <div className="dashboard-card">

            <div className="dashboard-icon">
              💼
            </div>

            <h3>
              Job Recommendations
            </h3>

            <p>
              Find jobs that match your skills and career goals.
            </p>

            <a
              href="/job-recommendations"
              className="tool-btn"
            >
              Find Jobs →
            </a>

          </div>

          <div className="dashboard-card">

            <div className="dashboard-icon">
              📊
            </div>

            <h3>
              Progress & Analytics
            </h3>

            <p>
              Track your overall career preparation and progress.
            </p>

            <a
              href="/progress"
              className="tool-btn"
            >
              View Progress →
            </a>

          </div>

          <div className="dashboard-card">

            <div className="dashboard-icon">
              ⚙️
            </div>

            <h3>
              Settings
            </h3>

            <p>
              Manage your CareerPilot account and preferences.
            </p>

            <a
              href="/settings"
              className="tool-btn"
            >
              Open Settings →
            </a>

          </div>

        </div>

      </main>

    </div>
  )
}

export default Dashboard