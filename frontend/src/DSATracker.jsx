import { useState, useEffect } from 'react'
import './DSATracker.css'

function DSATracker() {

  const [problems, setProblems] = useState(() => {
    const savedProblems = localStorage.getItem('dsaProblems')

    if (savedProblems) {
      try {
        return JSON.parse(savedProblems)
      } catch {
        return []
      }
    }

    return []
  })

  const [problemName, setProblemName] = useState('')
  const [difficulty, setDifficulty] = useState('Easy')
  const [topic, setTopic] = useState('Arrays')

  useEffect(() => {
    async function loadDSAProblems() {
      try {
        const token = localStorage.getItem('careerPilotToken')

        if (!token) {
          return
        }

        const response = await fetch(
          'http://127.0.0.1:5000/api/auth/dsa',
          {
            headers: {
              Authorization: 'Bearer ' + token
            }
          }
        )

        const data = await response.json()

        if (response.ok) {
          setProblems(data.dsaProblems || [])

          localStorage.setItem(
            'dsaProblems',
            JSON.stringify(data.dsaProblems || [])
          )
        }
      } catch (error) {
        console.log(
          'Unable to load DSA data:',
          error.message
        )
      }
    }

    loadDSAProblems()
  }, [])

  // ADD PROBLEM
  async function addProblem(e) {
  e.preventDefault()

  if (!problemName.trim()) {
    alert('Please enter problem name.')
    return
  }

  const newProblem = {
    id: Date.now(),
    name: problemName.trim(),
    difficulty: difficulty,
    topic: topic,
    solved: false
  }

  try {
    const token = localStorage.getItem('careerPilotToken')

    if (!token) {
      alert('Please login again.')
      return
    }

    const updatedProblems = [
      ...problems,
      newProblem
    ]

    const response = await fetch(
      'http://127.0.0.1:5000/api/auth/dsa',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({
          dsaProblems: updatedProblems
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      alert(data.message || 'Unable to save DSA problem.')
      return
    }

    setProblems(data.dsaProblems)

    localStorage.setItem(
      'dsaProblems',
      JSON.stringify(data.dsaProblems)
    )

    setProblemName('')
    setDifficulty('Easy')
    setTopic('Arrays')

    console.log('DSA problem saved to MongoDB successfully')
  } catch (error) {
    console.log(
      'Unable to save DSA problem:',
      error.message
    )

    alert('Unable to connect to server.')
  }
}
  // MARK / UNMARK SOLVED
  async function toggleSolved(id) {
  const updatedProblems = problems.map((problem) => {

    if (problem.id === id) {
      return {
        ...problem,
        solved: !problem.solved
      }
    }

    return problem
  })

  try {
    const token = localStorage.getItem('careerPilotToken')

    if (!token) {
      alert('Please login again.')
      return
    }

    const response = await fetch(
      'http://127.0.0.1:5000/api/auth/dsa',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({
          dsaProblems: updatedProblems
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      alert(data.message || 'Unable to update problem.')
      return
    }

    setProblems(data.dsaProblems)

    localStorage.setItem(
      'dsaProblems',
      JSON.stringify(data.dsaProblems)
    )

    console.log('DSA solved status saved to MongoDB successfully')
  } catch (error) {
    console.log(
      'Unable to update DSA problem:',
      error.message
    )

    alert('Unable to connect to server.')
  }
}

  // DELETE PROBLEM
  async function deleteProblem(id) {
  const updatedProblems = problems.filter(
    (problem) => problem.id !== id
  )

  try {
    const token = localStorage.getItem('careerPilotToken')

    if (!token) {
      alert('Please login again.')
      return
    }

    const response = await fetch(
      'http://127.0.0.1:5000/api/auth/dsa',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({
          dsaProblems: updatedProblems
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      alert(data.message || 'Unable to delete problem.')
      return
    }

    setProblems(data.dsaProblems)

    localStorage.setItem(
      'dsaProblems',
      JSON.stringify(data.dsaProblems)
    )

    console.log('DSA problem deleted from MongoDB successfully')
  } catch (error) {
    console.log(
      'Unable to delete DSA problem:',
      error.message
    )

    alert('Unable to connect to server.')
  }
}

  // BASIC STATS
  const totalProblems = problems.length

  const solvedProblems = problems.filter(
    (problem) => problem.solved
  ).length

  const easyProblems = problems.filter(
    (problem) => problem.difficulty === 'Easy'
  ).length

  const mediumProblems = problems.filter(
    (problem) => problem.difficulty === 'Medium'
  ).length

  const hardProblems = problems.filter(
    (problem) => problem.difficulty === 'Hard'
  ).length

  // OVERALL PROGRESS
  const progress =
    totalProblems === 0
      ? 0
      : Math.round(
          (solvedProblems / totalProblems) * 100
        )

  // TOPICS
  const topics = [
    'Arrays',
    'Strings',
    'Hashing',
    'Two Pointers',
    'Binary Search',
    'Linked List',
    'Stack',
    'Queue',
    'Trees',
    'Graphs',
    'Dynamic Programming'
  ]

  // TOPIC-WISE PROGRESS
  const topicProgress = topics.map((topicName) => {

    const topicProblems = problems.filter(
      (problem) => problem.topic === topicName
    )

    const topicSolved = topicProblems.filter(
      (problem) => problem.solved
    ).length

    const topicTotal = topicProblems.length

    const topicPercentage =
      topicTotal === 0
        ? 0
        : Math.round(
            (topicSolved / topicTotal) * 100
          )

    return {
      name: topicName,
      solved: topicSolved,
      total: topicTotal,
      percentage: topicPercentage
    }
  })

  return (
    <div className="dsa-page">

      <div className="dsa-container">

        <div className="dsa-header">

          <p className="dsa-small-heading">
            CAREERPILOT
          </p>

          <h1>
            DSA Tracker 💻
          </h1>

          <p>
            Track your Data Structures & Algorithms practice.
          </p>

        </div>

        <div className="dsa-stats">

          <div className="dsa-stat-card">
            <h2>{totalProblems}</h2>
            <p>Total Problems</p>
          </div>

          <div className="dsa-stat-card">
            <h2>{solvedProblems}</h2>
            <p>Solved</p>
          </div>

          <div className="dsa-stat-card">
            <h2>{easyProblems}</h2>
            <p>Easy</p>
          </div>

          <div className="dsa-stat-card">
            <h2>{mediumProblems}</h2>
            <p>Medium</p>
          </div>

          <div className="dsa-stat-card">
            <h2>{hardProblems}</h2>
            <p>Hard</p>
          </div>

        </div>

        <div className="dsa-progress-box">

          <div className="dsa-progress-header">

            <h2>
              Your Progress
            </h2>

            <strong>
              {progress}%
            </strong>

          </div>

          <div className="dsa-progress-bar">

            <div
              className="dsa-progress-fill"
              style={{
                width: `${progress}%`
              }}
            ></div>

          </div>

          <p>
            {solvedProblems} of {totalProblems} problems solved
          </p>

        </div>

        {topicProgress.some(
          (topic) => topic.total > 0
        ) && (

          <div className="topic-progress-box">

            <h2>
              Topic Progress
            </h2>

            <div className="topic-progress-list">

              {topicProgress
                .filter(
                  (topic) => topic.total > 0
                )
                .map((topic) => (

                  <div
                    className="topic-progress-item"
                    key={topic.name}
                  >

                    <div className="topic-progress-info">

                      <span>
                        {topic.name}
                      </span>

                      <span>
                        {topic.solved} / {topic.total}
                      </span>

                    </div>

                    <div className="topic-progress-bar">

                      <div
                        className="topic-progress-fill"
                        style={{
                          width: `${topic.percentage}%`
                        }}
                      ></div>

                    </div>

                    <p>
                      {topic.percentage}% completed
                    </p>

                  </div>

                ))}

            </div>

          </div>

        )}

        <div className="add-problem-box">

          <h2>
            Add DSA Problem
          </h2>

          <form onSubmit={addProblem}>

            <input
              type="text"
              placeholder="Enter problem name"
              value={problemName}
              onChange={(e) =>
                setProblemName(e.target.value)
              }
            />

            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value)
              }
            >

              <option value="Easy">
                Easy
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Hard">
                Hard
              </option>

            </select>

            <select
              value={topic}
              onChange={(e) =>
                setTopic(e.target.value)
              }
            >

              <option value="Arrays">
                Arrays
              </option>

              <option value="Strings">
                Strings
              </option>

              <option value="Hashing">
                Hashing
              </option>

              <option value="Two Pointers">
                Two Pointers
              </option>

              <option value="Binary Search">
                Binary Search
              </option>

              <option value="Linked List">
                Linked List
              </option>

              <option value="Stack">
                Stack
              </option>

              <option value="Queue">
                Queue
              </option>

              <option value="Trees">
                Trees
              </option>

              <option value="Graphs">
                Graphs
              </option>

              <option value="Dynamic Programming">
                Dynamic Programming
              </option>

            </select>

            <button type="submit">
              + Add Problem
            </button>

          </form>

        </div>

        <div className="problem-list-box">

          <h2>
            Your Problems
          </h2>

          {problems.length === 0 ? (

            <div className="empty-dsa">

              <div>
                📝
              </div>

              <h3>
                No problems added yet
              </h3>

              <p>
                Add your first DSA problem above.
              </p>

            </div>

          ) : (

            <div className="problem-list">

              {problems.map((problem) => (

                <div
                  className={`problem-card ${
                    problem.solved ? 'solved' : ''
                  }`}
                  key={problem.id}
                >

                  <div className="problem-left">

                    <button
                      type="button"
                      className="solve-btn"
                      onClick={() =>
                        toggleSolved(problem.id)
                      }
                    >
                      {problem.solved
                        ? '✓ Solved'
                        : 'Mark Solved'}
                    </button>

                    <div>

                      <h3>
                        {problem.name}
                      </h3>

                      <div className="problem-details">

                        <span>
                          {problem.topic}
                        </span>

                        <span>
                          {problem.difficulty}
                        </span>

                      </div>

                    </div>

                  </div>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() =>
                      deleteProblem(problem.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              ))}

            </div>

          )}

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

export default DSATracker