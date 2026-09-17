import { useEffect, useState } from 'react'
import './Profile.css'

const emptyProfile = {
  name: '',
  email: '',
  college: '',
  degree: '',
  graduationYear: '',
  skills: '',
  github: '',
  linkedin: '',
  careerGoal: ''
}

function Profile() {
  const [profile, setProfile] = useState(emptyProfile)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = localStorage.getItem('careerPilotToken')

        if (!token) {
          setError('Please login again.')
          setLoading(false)
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

        if (!response.ok) {
          setError(data.message || 'Unable to load profile.')
          setLoading(false)
          return
        }

        setProfile({
          name: data.user.name || '',
          email: data.user.email || '',
          college: data.user.college || '',
          degree: data.user.degree || '',
          graduationYear: data.user.graduationYear || '',
          skills: data.user.skills || '',
          github: data.user.github || '',
          linkedin: data.user.linkedin || '',
          careerGoal: data.user.careerGoal || ''
        })

        localStorage.setItem(
          'careerPilotProfile',
          JSON.stringify(data.user)
        )
      } catch {
        setError('Unable to connect to server. Please try again.')
      }

      setLoading(false)
    }

    loadProfile()
  }, [])

  function handleChange(e) {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    setError('')
    setSaving(true)

    try {
      const token = localStorage.getItem('careerPilotToken')

      if (!token) {
        setError('Please login again.')
        setSaving(false)
        return
      }

      const response = await fetch(
        'http://127.0.0.1:5000/api/auth/profile',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          },
          body: JSON.stringify(profile)
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Profile update failed.')
        setSaving(false)
        return
      }

      const updatedProfile = {
        name: data.user.name || '',
        email: data.user.email || '',
        college: data.user.college || '',
        degree: data.user.degree || '',
        graduationYear: data.user.graduationYear || '',
        skills: data.user.skills || '',
        github: data.user.github || '',
        linkedin: data.user.linkedin || '',
        careerGoal: data.user.careerGoal || ''
      }

      setProfile(updatedProfile)

      localStorage.setItem(
        'careerPilotProfile',
        JSON.stringify(updatedProfile)
      )

      localStorage.setItem(
        'careerPilotUser',
        JSON.stringify({
          id: data.user._id,
          name: data.user.name,
          email: data.user.email
        })
      )

      alert('Profile saved successfully! 🎉')
    } catch {
      setError('Unable to connect to server. Please try again.')
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <h1>My Profile</h1>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="profile-container">

        <h1>My Profile</h1>

        <p className="profile-subtitle">
          Complete your profile to get better career recommendations.
        </p>

        {error && (
          <p className="profile-error">
            {error}
          </p>
        )}

        <form
          className="profile-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>College</label>

            <input
              type="text"
              name="college"
              value={profile.college}
              onChange={handleChange}
              placeholder="Enter your college name"
            />
          </div>

          <div className="form-group">
            <label>Degree</label>

            <input
              type="text"
              name="degree"
              value={profile.degree}
              onChange={handleChange}
              placeholder="Example: B.Tech CSE"
            />
          </div>

          <div className="form-group">
            <label>Graduation Year</label>

            <input
              type="number"
              name="graduationYear"
              value={profile.graduationYear}
              onChange={handleChange}
              placeholder="Example: 2027"
            />
          </div>

          <div className="form-group">
            <label>Skills</label>

            <input
              type="text"
              name="skills"
              value={profile.skills}
              onChange={handleChange}
              placeholder="Example: JavaScript, React, Python"
            />
          </div>

          <div className="form-group">
            <label>GitHub Profile</label>

            <input
              type="text"
              name="github"
              value={profile.github}
              onChange={handleChange}
              placeholder="Enter GitHub profile"
            />
          </div>

          <div className="form-group">
            <label>LinkedIn Profile</label>

            <input
              type="text"
              name="linkedin"
              value={profile.linkedin}
              onChange={handleChange}
              placeholder="Enter LinkedIn profile"
            />
          </div>

          <div className="form-group">
            <label>Career Goal</label>

            <select
              name="careerGoal"
              value={profile.careerGoal}
              onChange={handleChange}
            >
              <option value="">
                Select your career goal
              </option>

              <option value="Software Developer">
                Software Developer
              </option>

              <option value="Data Scientist">
                Data Scientist
              </option>

              <option value="Data Analyst">
                Data Analyst
              </option>

              <option value="Web Developer">
                Web Developer
              </option>

              <option value="Cloud Engineer">
                Cloud Engineer
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="save-profile-btn"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>

        </form>

      </div>
    </div>
  )
}

export default Profile