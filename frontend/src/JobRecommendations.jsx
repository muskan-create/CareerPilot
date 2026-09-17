import './JobRecommendations.css'

function JobRecommendations() {
  const savedProfile = localStorage.getItem('careerPilotProfile')

  const profile = savedProfile
    ? JSON.parse(savedProfile)
    : {
        careerGoal: 'Software Developer',
        skills: ''
      }

  const profileSkills = profile.skills
    ? profile.skills
        .split(',')
        .map(skill => skill.trim().toLowerCase())
        .filter(Boolean)
    : []

  const savedResumeText =
    localStorage.getItem('resumeText') || ''

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
      (profile.careerGoal || '').toLowerCase()

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

    return Math.round(
      (skillMatch * 0.7) +
      (goalMatch * 0.3)
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
                {profile.careerGoal || 'Software Developer'}
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

        <div className="jobs-section">

          <div className="section-heading">
            <p>CAREER OPPORTUNITIES</p>

            <h2>
              Recommended Jobs
            </h2>

            <span>
              Jobs selected based on your skills and career goal.
            </span>
          </div>

          <div className="jobs-grid">

            {jobs.map(job => {

              const match = calculateMatch(job)

              return (
                <div
                  className="job-card"
                  key={job.title}
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
            })}

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

