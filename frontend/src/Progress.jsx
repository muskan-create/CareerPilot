import './Progress.css'

function Progress() {
  const profileData = localStorage.getItem('careerPilotProfile')

  const profile = profileData
    ? JSON.parse(profileData)
    : null

  let profileCompletion = 0

  if (profile) {
    let completedFields = 0

    if (profile.name) completedFields++
    if (profile.email) completedFields++
    if (profile.college) completedFields++
    if (profile.degree) completedFields++
    if (profile.graduationYear) completedFields++
    if (profile.skills) completedFields++
    if (profile.github) completedFields++
    if (profile.linkedin) completedFields++
    if (profile.careerGoal) completedFields++

    profileCompletion = Math.round(
      (completedFields / 9) * 100
    )
  }

  const resumeScore = Number(
    localStorage.getItem('resumeScore') || 0
  )

  const problemsData = localStorage.getItem('dsaProblems')

  const dsaProblems = problemsData
    ? JSON.parse(problemsData)
    : []

  const solvedProblems = dsaProblems.filter(
    problem => problem.solved
  ).length

  const dsaProgress =
    dsaProblems.length === 0
      ? 0
      : Math.round(
          (solvedProblems / dsaProblems.length) * 100
        )

  const mockInterviewCount = Number(
    localStorage.getItem('mockInterviewCount') || 0
  )

  const lastInterviewScore = Number(
    localStorage.getItem('lastInterviewScore') || 0
  )

  const resultsData = localStorage.getItem(
    'mockInterviewResults'
  )

  const interviewResults = resultsData
    ? JSON.parse(resultsData)
    : []

  const averageInterviewScore =
    interviewResults.length === 0
      ? 0
      : Math.round(
          interviewResults.reduce(
            (total, interview) =>
              total + Number(interview.score || 0),
            0
          ) / interviewResults.length
        )

  const overallProgress = Math.round(
    (
      profileCompletion +
      resumeScore +
      dsaProgress +
      lastInterviewScore
    ) / 4
  )

  return (
    <div className="progress-page">
      <div className="progress-container">

        <div className="progress-header">
          <div>
            <p className="progress-small-heading">
              CAREERPILOT
            </p>

            <h1>
              Your Career Progress
            </h1>

            <p className="progress-description">
              Track your preparation and see how close you are
              to your career goal.
            </p>
          </div>
        </div>

        <div className="overall-card">

          <div className="overall-content">
            <div>
              <p className="overall-label">
                OVERALL PROGRESS
              </p>

              <h2>
                Keep moving forward
              </h2>

              <p className="overall-description">
                Your overall career preparation progress.
              </p>
            </div>

            <div className="overall-number">
              {overallProgress}%
            </div>
          </div>

          <div className="overall-progress-bar">
            <div
              className="overall-progress-fill"
              style={{
                width: `${overallProgress}%`
              }}
            />
          </div>

          <div className="overall-footer">
            <span>Career preparation</span>
            <span>{overallProgress}% completed</span>
          </div>

        </div>

        <div className="progress-grid">

          <div className="progress-card">
            <div className="progress-card-top">
              <div className="progress-card-icon">
                👤
              </div>

              <span className="card-status">
                PROFILE
              </span>
            </div>

            <h3>Profile</h3>

            <p>
              Complete your career profile.
            </p>

            <div className="progress-card-bottom">
              <strong>
                {profileCompletion}%
              </strong>

              <span>
                Completed
              </span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${profileCompletion}%`
                }}
              />
            </div>
          </div>

          <div className="progress-card">
            <div className="progress-card-top">
              <div className="progress-card-icon">
                📄
              </div>

              <span className="card-status">
                RESUME
              </span>
            </div>

            <h3>Resume</h3>

            <p>
              Improve your resume score.
            </p>

            <div className="progress-card-bottom">
              <strong>
                {resumeScore}%
              </strong>

              <span>
                Resume score
              </span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${resumeScore}%`
                }}
              />
            </div>
          </div>

          <div className="progress-card">
            <div className="progress-card-top">
              <div className="progress-card-icon">
                💻
              </div>

              <span className="card-status">
                DSA
              </span>
            </div>

            <h3>DSA</h3>

            <p>
              Solve coding problems regularly.
            </p>

            <div className="progress-card-bottom">
              <strong>
                {dsaProgress}%
              </strong>

              <span>
                Progress
              </span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${dsaProgress}%`
                }}
              />
            </div>
          </div>

          <div className="progress-card">
            <div className="progress-card-top">
              <div className="progress-card-icon">
                🎤
              </div>

              <span className="card-status">
                PRACTICE
              </span>
            </div>

            <h3>Mock Interviews</h3>

            <p>
              Practice interviews and improve confidence.
            </p>

            <div className="progress-card-bottom">
              <strong>
                {mockInterviewCount}
              </strong>

              <span>
                Interviews
              </span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill interview-progress"
                style={{
                  width: `${mockInterviewCount > 0 ? 100 : 0}%`
                }}
              />
            </div>
          </div>

        </div>

        <div className="interview-analytics">

          <div className="section-heading">
            <p>PERFORMANCE</p>
            <h2>
              Interview Analytics
            </h2>
          </div>

          <div className="analytics-grid">

            <div className="analytics-card">
              <span>
                LATEST SCORE
              </span>

              <strong>
                {lastInterviewScore}
                <small>/100</small>
              </strong>

              <p>
                Your latest interview
              </p>
            </div>

            <div className="analytics-card">
              <span>
                AVERAGE SCORE
              </span>

              <strong>
                {averageInterviewScore}
                <small>/100</small>
              </strong>

              <p>
                Across all interviews
              </p>
            </div>

            <div className="analytics-card">
              <span>
                TOTAL INTERVIEWS
              </span>

              <strong>
                {mockInterviewCount}
              </strong>

              <p>
                Practice sessions
              </p>
            </div>

          </div>

        </div>

        <div className="history-section">

          <div className="section-heading">
            <p>YOUR ACTIVITY</p>

            <h2>
              Interview History
            </h2>
          </div>

          {interviewResults.length === 0 ? (

            <div className="no-history">
              <div className="empty-icon">
                🎤
              </div>

              <h3>
                No interviews yet
              </h3>

              <p>
                Complete your first mock interview to see
                your history here.
              </p>

              <a href="/mock-interview">
                Start your first interview →
              </a>
            </div>

          ) : (

            <div className="history-list">

              {[...interviewResults]
                .reverse()
                .map((interview, index) => (

                  <div
                    className="history-card"
                    key={index}
                  >

                    <div className="history-icon">
                      🎤
                    </div>

                    <div className="history-info">
                      <h3>
                        {interview.type} Interview
                      </h3>

                      <p>
                        {interview.date}
                      </p>
                    </div>

                    <div className="history-score">
                      {interview.score}
                      <span>/100</span>
                    </div>

                  </div>

                ))}

            </div>

          )}

        </div>

        <div className="career-goal-card">

          <div className="career-goal-content">

            <div className="career-goal-icon">
              🎯
            </div>

            <div>
              <p className="goal-label">
                CAREER GOAL
              </p>

              <h2>
                {profile?.careerGoal || 'Software Developer'}
              </h2>

              <p className="goal-description">
                Keep building your skills and stay consistent.
              </p>
            </div>

          </div>

          <a
            href="/dashboard"
            className="progress-btn"
          >
            ← Back to Dashboard
          </a>

        </div>

      </div>
    </div>
  )
}

export default Progress