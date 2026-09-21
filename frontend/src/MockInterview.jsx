import { useState, useEffect } from 'react'
import './MockInterview.css'

function MockInterview() {
  const [interviewType, setInterviewType] = useState('HR')
  const [started, setStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answer, setAnswer] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [questionScores, setQuestionScores] = useState([])
  const [interviewAnswers, setInterviewAnswers] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [completedScore, setCompletedScore] = useState(0)
  const [interviewCount, setInterviewCount] = useState(0)

  const questions = {
    HR: [
      'Tell me about yourself.',
      'What are your strengths?',
      'Why should we hire you?'
    ],
    Technical: [
      'What is the difference between let, var and const in JavaScript?',
      'What is a database?',
      'What is the difference between frontend and backend?'
    ],
    Mixed: [
      'Tell me about yourself.',
      'Explain one project you have worked on.',
      'What is your biggest technical strength?'
    ]
  }

  const keywords = {
    'Tell me about yourself.': [
      'education',
      'skills',
      'project',
      'experience',
      'career',
      'goal',
      'developer',
      'student'
    ],
    'What are your strengths?': [
      'communication',
      'problem solving',
      'learning',
      'teamwork',
      'leadership',
      'adaptability',
      'technical',
      'strength'
    ],
    'Why should we hire you?': [
      'skills',
      'experience',
      'project',
      'learning',
      'team',
      'contribute',
      'hardworking',
      'developer'
    ],
    'What is the difference between let, var and const in JavaScript?': [
      'let',
      'var',
      'const',
      'scope',
      'variable',
      'reassign',
      'redeclaration'
    ],
    'What is a database?': [
      'database',
      'data',
      'store',
      'storage',
      'table',
      'sql',
      'mongodb',
      'query'
    ],
    'What is the difference between frontend and backend?': [
      'frontend',
      'backend',
      'user',
      'interface',
      'server',
      'database',
      'api',
      'client'
    ],
    'Explain one project you have worked on.': [
      'project',
      'technology',
      'react',
      'javascript',
      'problem',
      'solution',
      'feature',
      'role'
    ],
    'What is your biggest technical strength?': [
      'technical',
      'coding',
      'javascript',
      'python',
      'problem',
      'solving',
      'dsa',
      'learning'
    ]
  }

  useEffect(() => {
    async function loadMockInterviews() {
      try {
        const token = localStorage.getItem(
          'careerPilotToken'
        )

        if (!token) {
          return
        }

        const response = await fetch(
          'http://127.0.0.1:5000/api/auth/mock-interviews',
          {
            headers: {
              Authorization: 'Bearer ' + token
            }
          }
        )

        const data = await response.json()

        if (response.ok) {
          setInterviewCount(
            (data.mockInterviews || []).length
          )
        }
      } catch (error) {
        console.log(
          'Unable to load mock interviews:',
          error.message
        )
      }
    }

    loadMockInterviews()
  }, [])

  function calculateScore(userAnswer) {
    const cleanAnswer =
      userAnswer.trim().toLowerCase()

    const words =
      cleanAnswer
        .split(/\s+/)
        .filter(Boolean)

    const wordCount = words.length

    const currentQuestionText =
      questions[interviewType][currentQuestion]

    const questionKeywords =
      keywords[currentQuestionText] || []

    const matchedKeywords =
      questionKeywords.filter(
        keyword =>
          cleanAnswer.includes(keyword)
      )

    const keywordScore =
      questionKeywords.length === 0
        ? 0
        : (
            matchedKeywords.length /
            questionKeywords.length
          ) * 40

    const lengthScore =
      wordCount < 5
        ? 5
        : wordCount < 15
          ? 15
          : wordCount < 30
            ? 23
            : wordCount < 50
              ? 28
              : 30

    let structureScore = 0

    if (wordCount >= 10) {
      structureScore += 10
    }

    if (
      cleanAnswer.includes('because') ||
      cleanAnswer.includes('for example') ||
      cleanAnswer.includes('such as') ||
      cleanAnswer.includes('also')
    ) {
      structureScore += 10
    }

    if (
      cleanAnswer.includes('.') ||
      cleanAnswer.includes(',')
    ) {
      structureScore += 5
    }

    if (wordCount >= 30) {
      structureScore += 5
    }

    return Math.min(
      100,
      Math.round(
        lengthScore +
        keywordScore +
        structureScore
      )
    )
  }

  function getFeedback(currentScore) {
    if (currentScore >= 90) {
      return 'Excellent answer! Your response is relevant, detailed, and well structured. Keep practicing your confidence and delivery.'
    }

    if (currentScore >= 80) {
      return 'Good answer! Your response is relevant. Try to add a specific example and explain your points more clearly.'
    }

    if (currentScore >= 70) {
      return 'Good start! Try to include more relevant points, examples, and details related to the question.'
    }

    return 'Your answer needs more improvement. Try to understand the question, include relevant keywords, and explain your answer clearly.'
  }

  function submitAnswer() {
    if (!answer.trim()) {
      alert('Please enter your answer.')
      return
    }

    const currentScore =
      calculateScore(answer)

    setScore(currentScore)
    setFeedback(
      getFeedback(currentScore)
    )

    setQuestionScores(
      previousScores => [
        ...previousScores,
        currentScore
      ]
    )

    setShowFeedback(true)
  }

  async function saveInterviewToMongoDB(
    finalScore,
    completeQuestions
  ) {
    try {
      const token = localStorage.getItem(
        'careerPilotToken'
      )

      if (!token) {
        console.log('No login token found.')
        return false
      }

      const response = await fetch(
        'http://127.0.0.1:5000/api/auth/mock-interviews',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          },
          body: JSON.stringify({
            role: interviewType,
            questions: completeQuestions,
            finalScore
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        console.log(
          'Unable to save interview:',
          data.message
        )
        return false
      }

      console.log(
        'Complete mock interview saved to MongoDB successfully'
      )

      return true
    } catch (error) {
      console.log(
        'Unable to save mock interview:',
        error.message
      )

      return false
    }
  }

  async function nextQuestion() {
    const currentQuestionText =
      questions[interviewType][currentQuestion]

    const currentQuestionData = {
      question: currentQuestionText,
      answer,
      score,
      feedback: getFeedback(score)
    }

    const completeQuestions = [
      ...interviewAnswers,
      currentQuestionData
    ]

    const updatedQuestionScores = [
      ...questionScores,
      score
    ]

    if (
      currentQuestion <
      questions[interviewType].length - 1
    ) {
      setInterviewAnswers(
        completeQuestions
      )

      setQuestionScores(
        updatedQuestionScores
      )

      setCurrentQuestion(
        currentQuestion + 1
      )

      setAnswer('')
      setShowFeedback(false)
      setScore(0)
      setFeedback('')
    } else {
      const finalScore = Math.round(
        updatedQuestionScores.reduce(
          (total, value) =>
            total + value,
          0
        ) /
          updatedQuestionScores.length
      )

      const saved =
        await saveInterviewToMongoDB(
          finalScore,
          completeQuestions
        )

      if (!saved) {
        alert(
          'Interview could not be saved. Please try again.'
        )
        return
      }

      const newCount =
        interviewCount + 1

      setInterviewCount(newCount)
      setCompletedScore(finalScore)
      setInterviewAnswers(
        completeQuestions
      )
      setQuestionScores(
        updatedQuestionScores
      )
      setShowFeedback(false)
      setShowResult(true)
    }
  }

  function startNewInterview() {
    setShowResult(false)
    setStarted(false)
    setCurrentQuestion(0)
    setAnswer('')
    setQuestionScores([])
    setInterviewAnswers([])
    setScore(0)
    setFeedback('')
    setCompletedScore(0)
  }

  return (
    <div className="mock-page">

      {!started ? (
        <div className="mock-container">

          <div className="mock-header">

            <p className="mock-small-heading">
              CAREERPILOT
            </p>

            <h1>
              AI Mock Interview 🎤
            </h1>

            <p>
              Practice your interview and improve your confidence.
            </p>

          </div>

          <div className="interview-box">

            <h2>
              Choose Interview Type
            </h2>

            <p>
              Select the type of interview you want to practice.
            </p>

            <div className="interview-options">

              <button
                className={
                  interviewType === 'HR'
                    ? 'interview-option active'
                    : 'interview-option'
                }
                onClick={() =>
                  setInterviewType('HR')
                }
              >
                👤 HR Interview
              </button>

              <button
                className={
                  interviewType === 'Technical'
                    ? 'interview-option active'
                    : 'interview-option'
                }
                onClick={() =>
                  setInterviewType(
                    'Technical'
                  )
                }
              >
                💻 Technical Interview
              </button>

              <button
                className={
                  interviewType === 'Mixed'
                    ? 'interview-option active'
                    : 'interview-option'
                }
                onClick={() =>
                  setInterviewType('Mixed')
                }
              >
                🎯 Mixed Interview
              </button>

            </div>

            <div className="selected-interview">

              <p>
                Selected Interview
              </p>

              <h3>
                {interviewType} Interview
              </h3>

            </div>

            <button
              className="start-interview-btn"
              onClick={() => {
                setShowResult(false)
                setCurrentQuestion(0)
                setQuestionScores([])
                setInterviewAnswers([])
                setAnswer('')
                setShowFeedback(false)
                setScore(0)
                setCompletedScore(0)
                setStarted(true)
              }}
            >
              Start Interview →
            </button>

          </div>

          <a
            href="/dashboard"
            className="back-dashboard"
          >
            ← Back to Dashboard
          </a>

        </div>
      ) : (

        <div className="mock-container">

          <div className="mock-header">

            <p className="mock-small-heading">
              CAREERPILOT
            </p>

            <h1>
              {interviewType} Interview 🎤
            </h1>

            {!showResult && (
              <p>
                Question {currentQuestion + 1} of{' '}
                {questions[interviewType].length}
              </p>
            )}

          </div>

          <div className="interview-box">

            {showResult ? (
              <>
                <h2>
                  Interview Completed 🎉
                </h2>

                <div className="feedback-box">

                  <h3>
                    Final Score: {completedScore}/100
                  </h3>

                  <p>
                    {completedScore >= 90
                      ? 'Excellent performance! You are showing strong interview preparation.'
                      : completedScore >= 80
                        ? 'Good performance! Keep practicing to improve your confidence.'
                        : 'Good start! Continue practicing and make your answers more detailed.'}
                  </p>

                  <p>
                    You completed all{' '}
                    {questions[interviewType].length}{' '}
                    questions.
                  </p>

                  <p>
                    Interview Type: {interviewType}
                  </p>

                </div>

                <button
                  className="start-interview-btn"
                  onClick={startNewInterview}
                >
                  Start New Interview →
                </button>
              </>

            ) : !showFeedback ? (

              <>
                <h2>
                  {questions[interviewType][currentQuestion]}
                </h2>

                <textarea
                  value={answer}
                  onChange={e =>
                    setAnswer(e.target.value)
                  }
                  placeholder="Type your answer here..."
                  rows="7"
                />

                <button
                  className="start-interview-btn"
                  onClick={submitAnswer}
                >
                  Submit Answer →
                </button>
              </>

            ) : (

              <>
                <h2>
                  Answer Submitted ✓
                </h2>

                <div className="feedback-box">

                  <h3>
                    Score: {score}/100
                  </h3>

                  <p>
                    {feedback}
                  </p>

                </div>

                <button
                  className="start-interview-btn"
                  onClick={nextQuestion}
                >
                  {currentQuestion ===
                  questions[interviewType].length - 1
                    ? 'Finish Interview ✓'
                    : 'Next Question →'}
                </button>

              </>
            )}

          </div>

        </div>
      )}

    </div>
  )
}

export default MockInterview