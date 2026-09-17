import { useState } from 'react'
import jsPDF from 'jspdf'
import * as pdfjsLib from 'pdfjs-dist'
import './ResumeAnalyzer.css'

// PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

function ResumeAnalyzer() {

  const [resume, setResume] = useState(null)
  const [resumeText, setResumeText] = useState('')
  const [foundSkills, setFoundSkills] = useState([])

  const [resumeScore, setResumeScore] = useState(0)
  const [scoreMessage, setScoreMessage] = useState('')

  const [suggestions, setSuggestions] = useState([])
  const [strengths, setStrengths] = useState([])

  const [selectedRole, setSelectedRole] = useState('')

  const [roleMatch, setRoleMatch] = useState({
    percentage: 0,
    matchedSkills: [],
    missingSkills: []
  })

  const [scoreBreakdown, setScoreBreakdown] = useState({
    skills: 0,
    education: 0,
    projects: 0,
    experience: 0,
    certifications: 0,
    contact: 0,
    objective: 0,
    github: 0,
    content: 0
  })

  const [sections, setSections] = useState({
    education: false,
    projects: false,
    experience: false,
    certifications: false,
    contact: false
  })


  // ==============================
  // FIND SKILLS
  // ==============================

  function findSkills(text) {

    const skillsList = [
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

    const lowerText = text.toLowerCase()

    return skillsList.filter((skill) =>
      lowerText.includes(skill.toLowerCase())
    )
  }


  // ==============================
  // FILE UPLOAD
  // ==============================

  function handleFileChange(e) {

    const file = e.target.files[0]

    if (!file) {
      return
    }

    if (file.type !== 'application/pdf') {

      alert('Please upload a PDF file only.')

      e.target.value = ''

      return
    }

    if (file.size > 5 * 1024 * 1024) {

      alert('Resume size should be less than 5 MB.')

      e.target.value = ''

      return
    }

    setResume(file)

    setResumeText('')
    setFoundSkills([])
    setResumeScore(0)
    setScoreMessage('')
    setSuggestions([])
    setStrengths([])
    setSelectedRole('')

    setRoleMatch({
      percentage: 0,
      matchedSkills: [],
      missingSkills: []
    })

    setSections({
      education: false,
      projects: false,
      experience: false,
      certifications: false,
      contact: false
    })

    setScoreBreakdown({
      skills: 0,
      education: 0,
      projects: 0,
      experience: 0,
      certifications: 0,
      contact: 0,
      objective: 0,
      github: 0,
      content: 0
    })
  }


  // ==============================
  // ANALYZE RESUME
  // ==============================

  async function handleAnalyze() {

    if (!resume) {

      alert('Please upload your resume first.')

      return
    }

    if (!selectedRole) {

      alert('Please select your target job role.')

      return
    }

    try {

      console.log('Starting Resume Analysis...')

      // Convert PDF into ArrayBuffer
      const arrayBuffer =
        await resume.arrayBuffer()


      // Load PDF
      const loadingTask =
        pdfjsLib.getDocument({
          data: arrayBuffer
        })

      const pdf =
        await loadingTask.promise


      console.log(
        'PDF loaded successfully.'
      )

      console.log(
        'Total Pages:',
        pdf.numPages
      )


      // ==============================
      // EXTRACT TEXT
      // ==============================

      let text = ''

      for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
      ) {

        const page =
          await pdf.getPage(pageNumber)

        const content =
          await page.getTextContent()

        const pageText =
          content.items
            .map((item) => item.str)
            .join(' ')

        text += pageText + '\n'
      }


      console.log(
        'Resume Text:',
        text
      )


      if (!text.trim()) {

        alert(
          'No readable text found in this PDF. Please upload a text-based PDF.'
        )

        return
      }


      setResumeText(text)
      localStorage.setItem('resumeText', text)


      // ==============================
      // FIND SKILLS
      // ==============================

      const skills =
        findSkills(text)

      setFoundSkills(skills)

      console.log(
        'Skills Found:',
        skills
      )


      // ==============================
      // LOWERCASE TEXT
      // ==============================

      const lowerText =
        text.toLowerCase()


      // ==============================
      // DETECT SECTIONS
      // ==============================

      const detectedSections = {

        education:
          lowerText.includes('education') ||
          lowerText.includes('b-tech') ||
          lowerText.includes('b.tech') ||
          lowerText.includes('university') ||
          lowerText.includes('college'),

        projects:
          lowerText.includes('projects') ||
          lowerText.includes('project'),

        experience:
          lowerText.includes('experience') ||
          lowerText.includes('intern') ||
          lowerText.includes('employment'),

        certifications:
          lowerText.includes('certificate') ||
          lowerText.includes('certification') ||
          lowerText.includes('nptel'),

        contact:
          text.includes('@') &&
          (
            lowerText.includes('github') ||
            lowerText.includes('linkedin') ||
            lowerText.includes('phone')
          )
      }


      setSections(
        detectedSections
      )


      console.log(
        'Sections Found:',
        detectedSections
      )


      
      // JOB ROLE SKILLS
      
      const roleSkills = {

        'Software Developer': [
          'C++',
          'Python',
          'Java',
          'SQL',
          'Git',
          'DSA',
          'JavaScript'
        ],

        'Full Stack Developer': [
          'HTML',
          'CSS',
          'JavaScript',
          'React',
          'Node.js',
          'Express',
          'MongoDB',
          'Git'
        ],

        'Data Analyst': [
          'Python',
          'SQL',
          'Excel',
          'Power BI',
          'Data Science'
        ],

        'Data Scientist': [
          'Python',
          'SQL',
          'Machine Learning',
          'Data Science',
          'Excel'
        ]
      }


      const requiredSkills =
        roleSkills[selectedRole]


     
      // MATCHED SKILLS
      

      const matchedSkills =
        requiredSkills.filter(
          (requiredSkill) =>
            skills.some(
              (resumeSkill) =>
                resumeSkill.toLowerCase() ===
                requiredSkill.toLowerCase()
            )
        )


      // ==============================
      // MISSING SKILLS
      // ==============================

      const missingSkills =
        requiredSkills.filter(
          (requiredSkill) =>
            !skills.some(
              (resumeSkill) =>
                resumeSkill.toLowerCase() ===
                requiredSkill.toLowerCase()
            )
        )


      // ==============================
      // MATCH PERCENTAGE
      // ==============================

      const matchPercentage =
        Math.round(
          (matchedSkills.length /
            requiredSkills.length) *
            100
        )


      setRoleMatch({

        percentage:
          matchPercentage,

        matchedSkills:
          matchedSkills,

        missingSkills:
          missingSkills
      })


      console.log(
        'Target Role:',
        selectedRole
      )

      console.log(
        'Matched Skills:',
        matchedSkills
      )

      console.log(
        'Missing Skills:',
        missingSkills
      )

      console.log(
        'Role Match:',
        matchPercentage
      )


      // ==============================
      // SMART SCORE
      // ==============================

      const breakdown = {

        skills: 0,
        education: 0,
        projects: 0,
        experience: 0,
        certifications: 0,
        contact: 0,
        objective: 0,
        github: 0,
        content: 0
      }


      // Skills - 20
      if (skills.length >= 10) {

        breakdown.skills = 20

      }
      else if (skills.length >= 5) {

        breakdown.skills = 15

      }
      else if (skills.length > 0) {

        breakdown.skills = 8
      }


      // Education - 15
      if (detectedSections.education) {

        breakdown.education = 15
      }


      // Projects - 15
      if (detectedSections.projects) {

        breakdown.projects = 15
      }


      // Experience - 15
      if (detectedSections.experience) {

        breakdown.experience = 15
      }


      // Certifications - 10
      if (detectedSections.certifications) {

        breakdown.certifications = 10
      }


      // Contact - 10
      if (detectedSections.contact) {

        breakdown.contact = 10
      }


      // Objective - 5
      if (
        lowerText.includes('career objective') ||
        lowerText.includes('objective') ||
        lowerText.includes('summary') ||
        lowerText.includes('profile')
      ) {

        breakdown.objective = 5
      }


      // GitHub - 5
      if (
        lowerText.includes('github')
      ) {

        breakdown.github = 5
      }


      // Content - 5
      if (
        text.length > 1500
      ) {

        breakdown.content = 5
      }


      // ==============================
      // TOTAL SCORE
      // ==============================

      const score =
        Object.values(
          breakdown
        ).reduce(
          (total, value) =>
            total + value,
          0
        )


     setScoreBreakdown(
  breakdown
)

const finalScore = Math.round(
  (score * 0.7) +
  (matchPercentage * 0.3)
)

setResumeScore(
  finalScore
)

localStorage.setItem(
  'resumeScore',
  finalScore
)
const token = localStorage.getItem('careerPilotToken')

if (token) {
  try {
    const response = await fetch(
      'http://127.0.0.1:5000/api/auth/resume',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({
          resumeScore: finalScore,
          resumeText: text,
          selectedRole: selectedRole,
          roleMatchPercentage: matchPercentage
        })
      }
    )

    const data = await response.json()

    if (response.ok) {
      console.log('Resume data saved to MongoDB successfully')
    } else {
      console.log(
        'Resume data save failed:',
        data.message
      )
    }
  } catch (error) {
    console.log(
      'Unable to save resume data to MongoDB:',
      error.message
    )
  }
}

console.log(
  'Resume Score:',
  finalScore
)

      // ==============================
      // SCORE MESSAGE
      // ==============================

      if (score >= 80) {

        setScoreMessage(
          'Excellent Resume! 🎉'
        )

      }
      else if (score >= 60) {

        setScoreMessage(
          'Good Resume! 👍'
        )

      }
      else {

        setScoreMessage(
          'Needs Improvement 💡'
        )
      }


      // ==============================
      // SUGGESTIONS
      // ==============================

      const newSuggestions = []


      if (
        !detectedSections.education
      ) {

        newSuggestions.push(
          'Add an Education section to your resume.'
        )
      }


      if (
        !detectedSections.projects
      ) {

        newSuggestions.push(
          'Add Projects to showcase your practical skills.'
        )
      }


      if (
        !detectedSections.experience
      ) {

        newSuggestions.push(
          'Add internship or work experience if available.'
        )
      }


      if (
        !detectedSections.certifications
      ) {

        newSuggestions.push(
          'Add relevant certifications or courses.'
        )
      }


      if (
        skills.length < 5
      ) {

        newSuggestions.push(
          'Add more relevant technical skills.'
        )
      }


      if (
        !detectedSections.contact
      ) {

        newSuggestions.push(
          'Add proper contact details such as email, GitHub or LinkedIn.'
        )
      }


      if (
        !lowerText.includes('objective') &&
        !lowerText.includes('summary') &&
        !lowerText.includes('profile')
      ) {

        newSuggestions.push(
          'Add a short career objective or professional summary.'
        )
      }


      setSuggestions(
        newSuggestions
      )


      // ==============================
      // STRENGTHS
      // ==============================

      const newStrengths = []


      if (
        skills.length >= 10
      ) {

        newStrengths.push(
          'Strong technical skill set detected.'
        )
      }


      if (
        detectedSections.projects
      ) {

        newStrengths.push(
          'Projects are included in your resume.'
        )
      }


      if (
        detectedSections.experience
      ) {

        newStrengths.push(
          'Experience section is present.'
        )
      }


      if (
        detectedSections.certifications
      ) {

        newStrengths.push(
          'Certifications strengthen your profile.'
        )
      }


      if (
        detectedSections.contact
      ) {

        newStrengths.push(
          'Contact information is properly included.'
        )
      }


      if (
        lowerText.includes('objective') ||
        lowerText.includes('summary') ||
        lowerText.includes('profile')
      ) {

        newStrengths.push(
          'Career objective or professional summary is present.'
        )
      }


      if (
        lowerText.includes('github')
      ) {

        newStrengths.push(
          'GitHub profile is included.'
        )
      }


      setStrengths(
        newStrengths
      )


      console.log(
        'Suggestions:',
        newSuggestions
      )

      console.log(
        'Strengths:',
        newStrengths
      )


      alert(
        'Resume analyzed successfully! 🎉'
      )

    }
    catch (error) {

      console.error(
        'Resume Analysis Error:',
        error
      )

      alert(
        'Unable to read the resume. Please check the browser Console.'
      )
    }
  }


  // ==============================
  // DOWNLOAD REPORT
  // ==============================

  function downloadReport() {

    const doc =
      new jsPDF()


    doc.setFontSize(20)

    doc.text(
      'CareerPilot - Resume Analysis Report',
      20,
      20
    )


    doc.setFontSize(14)

    doc.text(
      `Resume Score: ${resumeScore}%`,
      20,
      35
    )


    doc.setFontSize(12)

    doc.text(
      `Result: ${scoreMessage}`,
      20,
      45
    )


    doc.text(
      `Target Role: ${selectedRole}`,
      20,
      55
    )


    doc.text(
      `Role Match: ${roleMatch.percentage}%`,
      20,
      65
    )


    let y = 80


    // Skills
    doc.setFontSize(14)

    doc.text(
      'Skills Found:',
      20,
      y
    )

    y += 10


    foundSkills.forEach(
      (skill) => {

        if (y > 270) {

          doc.addPage()

          y = 20
        }

        doc.setFontSize(12)

        doc.text(
          `- ${skill}`,
          25,
          y
        )

        y += 7
      }
    )


    // Matched Skills
    y += 5


    if (y > 260) {

      doc.addPage()

      y = 20
    }


    doc.setFontSize(14)

    doc.text(
      'Matched Skills:',
      20,
      y
    )

    y += 10


    roleMatch.matchedSkills.forEach(
      (skill) => {

        if (y > 270) {

          doc.addPage()

          y = 20
        }

        doc.setFontSize(12)

        doc.text(
          `- ${skill}`,
          25,
          y
        )

        y += 7
      }
    )


    // Missing Skills
    y += 5


    if (y > 260) {

      doc.addPage()

      y = 20
    }


    doc.setFontSize(14)

    doc.text(
      'Missing Skills:',
      20,
      y
    )

    y += 10


    roleMatch.missingSkills.forEach(
      (skill) => {

        if (y > 270) {

          doc.addPage()

          y = 20
        }

        doc.setFontSize(12)

        doc.text(
          `- ${skill}`,
          25,
          y
        )

        y += 7
      }
    )


    // Strengths
    y += 5


    if (y > 260) {

      doc.addPage()

      y = 20
    }


    doc.setFontSize(14)

    doc.text(
      'Resume Strengths:',
      20,
      y
    )

    y += 10


    strengths.forEach(
      (strength) => {

        if (y > 270) {

          doc.addPage()

          y = 20
        }

        doc.setFontSize(12)

        doc.text(
          `- ${strength}`,
          25,
          y
        )

        y += 7
      }
    )


    // Suggestions
    y += 5


    if (y > 260) {

      doc.addPage()

      y = 20
    }


    doc.setFontSize(14)

    doc.text(
      'Improvement Suggestions:',
      20,
      y
    )

    y += 10


    suggestions.forEach(
      (suggestion) => {

        if (y > 270) {

          doc.addPage()

          y = 20
        }

        doc.setFontSize(12)

        doc.text(
          `- ${suggestion}`,
          25,
          y
        )

        y += 7
      }
    )


    doc.save(
      'CareerPilot-Resume-Report.pdf'
    )
  }


  // ==============================
  // UI
  // ==============================

  return (

    <div className="resume-page">

      <div className="resume-container">

        <h1>
          Resume Analyzer 📄
        </h1>

        <p className="resume-subtitle">
          Upload your resume and get insights to improve it.
        </p>


        {/* UPLOAD */}

        <div className="upload-box">

          <div className="upload-icon">
            📄
          </div>

          <h2>
            Upload Your Resume
          </h2>

          <p>
            Upload your PDF resume to analyze it.
          </p>


          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
          />


          {resume && (

            <p className="file-name">
              Selected: {resume.name}
            </p>

          )}


          {/* JOB ROLE */}

          <div className="role-box">

            <h3>
              🎯 Select Your Target Job Role
            </h3>


            <select
              value={selectedRole}
              onChange={(e) =>
                setSelectedRole(
                  e.target.value
                )
              }
            >

              <option value="">
                Select a Job Role
              </option>

              <option value="Software Developer">
                Software Developer
              </option>

              <option value="Full Stack Developer">
                Full Stack Developer
              </option>

              <option value="Data Analyst">
                Data Analyst
              </option>

              <option value="Data Scientist">
                Data Scientist
              </option>

            </select>

          </div>


          {/* ANALYZE */}

          <button
            className="analyze-btn"
            onClick={handleAnalyze}
          >
            Analyze Resume →
          </button>


          {/* SCORE */}

          {resumeScore > 0 && (

            <div className="score-box">

              <h2>
                Resume Score
              </h2>

              <div className="score-number">
                {resumeScore}%
              </div>

              <h3 className="score-message">
                {scoreMessage}
              </h3>

              <p>
                Your resume has been analyzed successfully.
              </p>


              <button
                className="download-btn"
                onClick={downloadReport}
              >
                📥 Download Analysis Report
              </button>

            </div>

          )}


          {/* SCORE BREAKDOWN */}

          {resumeScore > 0 && (

            <div className="breakdown-box">

              <h3>
                Score Breakdown 📊
              </h3>


              <ScoreItem
                label="💻 Skills"
                value={scoreBreakdown.skills}
                max={20}
              />

              <ScoreItem
                label="🎓 Education"
                value={scoreBreakdown.education}
                max={15}
              />

              <ScoreItem
                label="🚀 Projects"
                value={scoreBreakdown.projects}
                max={15}
              />

              <ScoreItem
                label="💼 Experience"
                value={scoreBreakdown.experience}
                max={15}
              />

              <ScoreItem
                label="🏆 Certifications"
                value={scoreBreakdown.certifications}
                max={10}
              />

              <ScoreItem
                label="📧 Contact"
                value={scoreBreakdown.contact}
                max={10}
              />

              <ScoreItem
                label="📝 Objective"
                value={scoreBreakdown.objective}
                max={5}
              />

              <ScoreItem
                label="🔗 GitHub"
                value={scoreBreakdown.github}
                max={5}
              />

              <ScoreItem
                label="📄 Content"
                value={scoreBreakdown.content}
                max={5}
              />

            </div>

          )}


          {/* JOB ROLE MATCHING */}

          {resumeText && selectedRole && (

            <div className="role-match-box">

              <h3>
                🎯 Job Role Matching
              </h3>

              <p>
                Selected Role:
                <strong>
                  {' '}{selectedRole}
                </strong>
              </p>


              <div className="match-number">
                {roleMatch.percentage}%
              </div>


              <p>
                Resume Match
              </p>


              <div className="progress-bar">

                <div
                  className="progress-fill"
                  style={{
                    width:
                      `${roleMatch.percentage}%`
                  }}
                ></div>

              </div>


              <h4>
                Matched Skills ✅
              </h4>


              <div className="skills-list">

                {roleMatch.matchedSkills.length > 0 ? (

                  roleMatch.matchedSkills.map(
                    (skill, index) => (

                      <span
                        className="skill-tag"
                        key={index}
                      >
                        ✓ {skill}
                      </span>

                    )
                  )

                ) : (

                  <p>
                    No matched skills found.
                  </p>

                )}

              </div>


              <h4>
                Missing Skills ⚠️
              </h4>


              <div className="skills-list">

                {roleMatch.missingSkills.length > 0 ? (

                  roleMatch.missingSkills.map(
                    (skill, index) => (

                      <span
                        className="missing-skill"
                        key={index}
                      >
                        ⚠️ {skill}
                      </span>

                    )
                  )

                ) : (

                  <p>
                    Great! No major missing skills.
                  </p>

                )}

              </div>

            </div>

          )}


          {/* RESUME TEXT */}

          {resumeText && (

            <div className="resume-text-box">

              <h3>
                Resume Text
              </h3>

              <p>
                {resumeText}
              </p>

            </div>

          )}


          {/* SKILLS */}

          {foundSkills.length > 0 && (

            <div className="skills-box">

              <h3>
                Skills Found
              </h3>


              <div className="skills-list">

                {foundSkills.map(
                  (skill, index) => (

                    <span
                      className="skill-tag"
                      key={index}
                    >
                      ✓ {skill}
                    </span>

                  )
                )}

              </div>

            </div>

          )}


          {/* SECTIONS */}

          {resumeText && (

            <div className="sections-box">

              <h3>
                Resume Sections
              </h3>


              <div className="section-list">

                <p>
                  {sections.education
                    ? '✅'
                    : '❌'} Education
                </p>

                <p>
                  {sections.projects
                    ? '✅'
                    : '❌'} Projects
                </p>

                <p>
                  {sections.experience
                    ? '✅'
                    : '❌'} Experience
                </p>

                <p>
                  {sections.certifications
                    ? '✅'
                    : '❌'} Certifications
                </p>

                <p>
                  {sections.contact
                    ? '✅'
                    : '❌'} Contact Information
                </p>

              </div>

            </div>

          )}


          {/* STRENGTHS */}

          {resumeText &&
            strengths.length > 0 && (

              <div className="strengths-box">

                <h3>
                  Resume Strengths 💪
                </h3>


                <div className="strengths-list">

                  {strengths.map(
                    (strength, index) => (

                      <p key={index}>
                        ✅ {strength}
                      </p>

                    )
                  )}

                </div>

              </div>

            )}


          {/* SUGGESTIONS */}

          {resumeText &&
            suggestions.length > 0 && (

              <div className="suggestions-box">

                <h3>
                  Improvement Suggestions 💡
                </h3>


                <div className="suggestions-list">

                  {suggestions.map(
                    (suggestion, index) => (

                      <p key={index}>
                        ⚠️ {suggestion}
                      </p>

                    )
                  )}

                </div>

              </div>

            )}


          {/* NO SUGGESTIONS */}

          {resumeText &&
            suggestions.length === 0 && (

              <div className="suggestions-box">

                <h3>
                  Resume Looks Great! 🎉
                </h3>

                <p>
                  No major improvements were detected.
                </p>

              </div>

            )}

        </div>

      </div>

    </div>
  )
}


// ==============================
// SCORE ITEM COMPONENT
// ==============================

function ScoreItem({
  label,
  value,
  max
}) {

  const percentage =
    (value / max) * 100

  return (

    <div className="score-item">

      <div className="score-label">

        <span>
          {label}
        </span>

        <span>
          {value}/{max}
        </span>

      </div>


      <div className="progress-bar">

        <div
          className="progress-fill"
          style={{
            width:
              `${percentage}%`
          }}
        ></div>

      </div>

    </div>
  )
}


export default ResumeAnalyzer