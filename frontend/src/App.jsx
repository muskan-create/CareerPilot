import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login from './Login'
import Register from './Register'
import Dashboard from './Dashboard'
import Profile from './Profile'
import ResumeAnalyzer from './ResumeAnalyzer'
import DSATracker from './DSATracker'
import MockInterview from './MockInterview'
import JobRecommendations from './JobRecommendations'
import Progress from './Progress'
import Settings from './Settings'

import './App.css'

function ProtectedRoute({ children }) {
  const isLoggedIn =
    localStorage.getItem('careerPilotLoggedIn') === 'true'

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return children
}

function Home() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">CareerPilot</div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="/login" className="login-btn">
            Login
          </a>
        </div>
      </nav>

      <section className="hero-section" id="home">
        <div className="hero-content">
          <p className="small-heading">
            YOUR CAREER, YOUR FUTURE
          </p>

          <h1>
            Build Your Career
            <br />
            With <span>CareerPilot</span>
          </h1>

          <p className="hero-text">
            Learn skills, prepare for interviews, track your progress,
            and move one step closer to your dream job.
          </p>

          <div className="hero-buttons">
            <a href="/register" className="primary-btn">
              Get Started
            </a>

            <a href="#features" className="secondary-btn">
              Explore Features
            </a>
          </div>
        </div>
      </section>

      <section className="features-section" id="features">
        <p className="small-heading">
          WHAT CAREERPILOT OFFERS
        </p>

        <h2>
          Everything You Need to Build Your Career
        </h2>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon">📄</div>

            <h3>Resume Analyzer</h3>

            <p>
              Upload your resume and get insights about missing skills,
              improvements, and job readiness.
            </p>

            <button>Explore →</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💻</div>

            <h3>DSA Tracker</h3>

            <p>
              Track your coding problems, monitor your progress,
              and improve your DSA skills step by step.
            </p>

            <button>Explore →</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎤</div>

            <h3>AI Mock Interview</h3>

            <p>
              Practice technical and HR interviews with AI
              and receive instant feedback.
            </p>

            <button>Explore →</button>
          </div>

        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-content">

          <p className="small-heading">
            ABOUT CAREERPILOT
          </p>

          <h2>
            Your Personal Career Companion
          </h2>

          <p>
            CareerPilot is designed to help students prepare for their
            dream careers in one place. From resume building and DSA
            practice to mock interviews and job preparation, everything
            is organized to make your placement journey easier.
          </p>

          <a href="/register" className="primary-btn">
            Start Your Journey
          </a>

        </div>
      </section>

      <footer className="footer">
        <div className="footer-logo">
          CareerPilot
        </div>

        <p>
          Build your skills. Prepare smarter. Get hired.
        </p>

        <p className="copyright">
          © 2026 CareerPilot. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resume-analyzer"
          element={
            <ProtectedRoute>
              <ResumeAnalyzer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dsa-tracker"
          element={
            <ProtectedRoute>
              <DSATracker />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mock-interview"
          element={
            <ProtectedRoute>
              <MockInterview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/job-recommendations"
          element={
            <ProtectedRoute>
              <JobRecommendations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App

