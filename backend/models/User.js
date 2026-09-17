const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    college: {
      type: String,
      default: ''
    },
    degree: {
      type: String,
      default: ''
    },
    graduationYear: {
      type: String,
      default: ''
    },
    skills: {
      type: String,
      default: ''
    },
    github: {
      type: String,
      default: ''
    },
    linkedin: {
      type: String,
      default: ''
    },
    careerGoal: {
      type: String,
      default: ''
    },
   mockInterviews: {
  type: [
    {
      role: String,
      questions: [
        {
          question: String,
          answer: String,
          score: Number,
          feedback: String
        }
      ],
      finalScore: Number,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  default: []
},
    resumeScore: {
      type: Number,
      default: 0
    },
    dsaProblems: {
  type: [
    {
      id: Number,
      name: String,
      difficulty: String,
      topic: String,
      solved: Boolean
    }
  ],
  default: []
},
    resumeText: {
      type: String,
      default: ''
    },
    selectedRole: {
      type: String,
      default: ''
    },
    roleMatchPercentage: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('User', userSchema)