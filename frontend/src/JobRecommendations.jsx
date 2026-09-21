import { useEffect, useState } from 'react'
import './JobRecommendations.css'

function JobRecommendations() {
 const [profile, setProfile] = useState({
  careerGoal: '',
  skills: '',
  resumeText: ''
})
  const [preferences, setPreferences] = useState({
    jobRole: '',
    location: '',
    jobType: ''
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const token = localStorage.getItem('careerPilotToken')

  useEffect(() => {
    async function loadData() {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const profileResponse = await fetch(
          'http://127.0.0.1:5000/api/auth/profile',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const profileData = await profileResponse.json()

        if (profileResponse.ok && profileData.user) {
          setProfile({
  careerGoal: profileData.user.careerGoal || '',
  skills: profileData.user.skills || '',
  resumeText: profileData.user.resumeText || ''
})
        }

        const preferencesResponse = await fetch(
          'http://127.0.0.1:5000/api/auth/job-preferences',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const preferencesData =
          await preferencesResponse.json()

        if (
          preferencesResponse.ok &&
          preferencesData.jobPreferences
        ) {
          setPreferences({
            jobRole:
              preferencesData.jobPreferences.jobRole || '',
            location:
              preferencesData.jobPreferences.location || '',
            jobType:
              preferencesData.jobPreferences.jobType || ''
          })
        }
      } catch (error) {
        console.log('Job data loading error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [token])

  const savePreferences = async () => {
    if (!token) {
      setMessage('Please login first.')
      return
    }

    setSaving(true)
    setMessage('')

    try {
      const response = await fetch(
        'http://127.0.0.1:5000/api/auth/job-preferences',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(preferences)
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || 'Unable to save preferences.')
        return
      }

      setMessage('Job preferences saved successfully.')
    } catch (error) {
      console.log('Job preferences save error:', error)
      setMessage('Unable to connect to server.')
    } finally {
      setSaving(false)
    }
  }

  const profileSkills = profile.skills
    ? profile.skills
        .split(',')
        .map(skill => skill.trim().toLowerCase())
        .filter(Boolean)
    : []

  const savedResumeText = profile.resumeText || ''

  const resumeSkillsList = [
    'HTML',
    'CSS',
    'JavaScript',
    'React',
    'Node.js',
    'MongoDB',
    'Python',
    'C++',
    'Java',
    'SQL',
    'Git',
    'GitHub',
    'Express',
    'MySQL',
    'Data Science',
    'Machine Learning',
    'DSA',
    'Next.js',
    'TypeScript',
    'Tailwind',
    'Power BI',
    'Excel'
  ]

  const resumeSkills = resumeSkillsList
    .filter(skill =>
      savedResumeText
        .toLowerCase()
        .includes(skill.toLowerCase())
    )
    .map(skill => skill.toLowerCase())

  const userSkills = [
    ...new Set([
      ...profileSkills,
      ...resumeSkills
    ])
  ]

  const jobs = [
    {
      title: 'Software Developer',
      company: 'Tech Solutions',
      location: 'Gurgaon',
      type: 'Full Time',
      skills: ['JavaScript', 'React', 'Node.js'],
      applyLink: 'https://www.linkedin.com/jobs/'
    },
    {
      title: 'Frontend Developer',
      company: 'Digital Labs',
      location: 'Noida',
      type: 'Full Time',
      skills: ['HTML', 'CSS', 'JavaScript', 'React'],
      applyLink: 'https://www.linkedin.com/jobs/'
    },
    {
      title: 'Data Analyst',
      company: 'DataTech',
      location: 'Delhi',
      type: 'Full Time',
      skills: ['Python', 'SQL', 'Data Science'],
      applyLink: 'https://www.linkedin.com/jobs/'
    },
    {
      title: 'Junior Full Stack Developer',
      company: 'WebWorks',
      location: 'Gurgaon',
      type: 'Internship',
      skills: ['React', 'Node.js', 'MongoDB'],
      applyLink: 'https://www.linkedin.com/jobs/'
    }
  ]

  const calculateMatch = job => {
    if (userSkills.length === 0) {
      return 0
    }

    const matchedSkills = job.skills.filter(skill =>
      userSkills.includes(skill.toLowerCase())
    )

    const skillMatch =
      (matchedSkills.length / job.skills.length) * 100

    const goal =
      (
        preferences.jobRole ||
        profile.careerGoal ||
        ''
      ).toLowerCase()

    const jobTitle =
      job.title.toLowerCase()

    let goalMatch = 0

    if (
      goal &&
      (
        jobTitle.includes(goal) ||
        goal.includes(jobTitle)
      )
    ) {
      goalMatch = 100
    }

    let locationMatch = 0

    if (
      preferences.location &&
      job.location.toLowerCase() ===
        preferences.location.toLowerCase()
    ) {
      locationMatch = 100
    }

    return Math.round(
      (skillMatch * 0.6) +
      (goalMatch * 0.25) +
      (locationMatch * 0.15)
    )
  }

  const filteredJobs = jobs.filter(job => {
    const role =
      preferences.jobRole.trim().toLowerCase()

    const location =
      preferences.location.trim().toLowerCase()

    const jobType =
      preferences.jobType.trim().toLowerCase()

    const roleMatch =
      !role ||
      job.title.toLowerCase().includes(role) ||
      role.includes(job.title.toLowerCase())

    const locationMatch =
      !location ||
      job.location.toLowerCase() === location

    const typeMatch =
      !jobType ||
      job.type.toLowerCase() === jobType

    return roleMatch && locationMatch && typeMatch
  })

  if (loading) {
    return (
      <div className="jobs-page">
        <div className="jobs-container">
          <h2>Loading Job Recommendations...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="jobs-page">
      <div className="jobs-container">

        <div className="jobs-header">
          <p className="jobs-small-heading">
            CAREERPILOT
          </p>

          <h1>
            Job Recommendations
          </h1>

          <p>
            Find jobs that match your skills and career goals.
          </p>
        </div>

        <div className="job-profile-summary">

          <div className="profile-summary-card">
            <div className="summary-icon">
              🎯
            </div>

            <div>
              <p>Your Career Goal</p>

              <h3>
                {profile.careerGoal || 'Not added yet'}
              </h3>
            </div>
          </div>

          <div className="profile-summary-card">
            <div className="summary-icon">
              🛠️
            </div>

            <div>
              <p>Your Skills</p>

              {profile.skills ? (
                <div className="profile-skill-list">
                  {profile.skills
                    .split(',')
                    .map(skill => skill.trim())
                    .filter(Boolean)
                    .map(skill => (
                      <span key={skill}>
                        {skill}
                      </span>
                    ))}
                </div>
              ) : (
                <h3>
                  Add skills in your profile
                </h3>
              )}
            </div>
          </div>

        </div>

        <div className="job-preferences-card">

          <div className="section-heading">
            <p>JOB PREFERENCES</p>

            <h2>
              Find Your Preferred Jobs
            </h2>

            <span>
              Select your preferred role, location and job type.
            </span>
          </div>

          <div className="job-preferences-form">

            <div>
              <label>
                Job Role
              </label>

              <input
                type="text"
                value={preferences.jobRole}
                onChange={e =>
                  setPreferences({
                    ...preferences,
                    jobRole: e.target.value
                  })
                }
                placeholder="e.g. Software Developer"
              />
            </div>

            <div>
              <label>
                Location
              </label>

              <select
                value={preferences.location}
                onChange={e =>
                  setPreferences({
                    ...preferences,
                    location: e.target.value
                  })
                }
              >
                <option value="">
                  All Locations
                </option>
                <option value="Gurgaon">
                  Gurgaon
                </option>
                <option value="Noida">
                  Noida
                </option>
                <option value="Delhi">
                  Delhi
                </option>
              </select>
            </div>

            <div>
              <label>
                Job Type
              </label>

              <select
                value={preferences.jobType}
                onChange={e =>
                  setPreferences({
                    ...preferences,
                    jobType: e.target.value
                  })
                }
              >
                <option value="">
                  All Types
                </option>
                <option value="Full Time">
                  Full Time
                </option>
                <option value="Internship">
                  Internship
                </option>
              </select>
            </div>

          </div>

          <button
            type="button"
            onClick={savePreferences}
            className="save-preferences-btn"
            disabled={saving}
          >
            {saving
              ? 'Saving...'
              : 'Save Preferences'}
          </button>

          {message && (
            <p className="job-preference-message">
              {message}
            </p>
          )}

        </div>

        <div className="jobs-section">

          <div className="section-heading">
            <p>
              CAREER OPPORTUNITIES
            </p>

            <h2>
              Recommended Jobs
            </h2>

            <span>
              Jobs selected based on your skills and preferences.
            </span>
          </div>

          <div className="jobs-grid">

            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => {

                const match = calculateMatch(job)

                return (
                  <div
                    className="job-card"
                    key={`${job.title}-${job.company}`}
                  >

                    <div className="job-card-top">

                      <div className="job-icon">
                        💼
                      </div>

                      <div className="match-badge">
                        {match}% Match
                      </div>

                    </div>

                    <h3>
                      {job.title}
                    </h3>

                    <p className="company-name">
                      {job.company}
                    </p>

                    <div className="job-details">

                      <span>
                        📍 {job.location}
                      </span>

                      <span>
                        💼 {job.type}
                      </span>

                    </div>

                    <div className="job-skills">

                      {job.skills.map(skill => (
                        <span key={skill}>
                          {skill}
                        </span>
                      ))}

                    </div>

                    <a
                      href={job.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="apply-btn"
                    >
                      Apply Now →
                    </a>

                  </div>
                )
              })
            ) : (
              <div className="no-jobs">
                <h3>
                  No matching jobs found
                </h3>

                <p>
                  Try changing your job preferences.
                </p>
              </div>
            )}

          </div>

        </div>

        <a
          href="/dashboard"
          className="back-dashboard"
        >
          ← Back to Dashboard
        </a>

      </div>
    </div>
  )
}

export default JobRecommendations