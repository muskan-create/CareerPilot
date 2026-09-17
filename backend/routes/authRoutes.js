const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required'
      })
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase()
    })

    if (existingUser) {
      return res.status(400).json({
        message: 'Email already registered'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    })

    await user.save()

    res.status(201).json({
      message: 'Registration successful'
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      })
    }

    const user = await User.findOne({
      email: email.toLowerCase()
    })

    if (!user) {
      return res.status(400).json({
        message: 'Invalid email or password'
      })
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    )

    if (!isPasswordValid) {
      return res.status(400).json({
        message: 'Invalid email or password'
      })
    }

    const token = jwt.sign(
      {
        userId: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    )

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
})

router.get('/protected', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    res.status(200).json({
      message: 'Protected route accessed successfully',
      user
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
})

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    res.status(200).json({
      user
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
})

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const {
      name,
      college,
      degree,
      graduationYear,
      skills,
      github,
      linkedin,
      careerGoal
    } = req.body

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        name,
        college,
        degree,
        graduationYear,
        skills,
        github,
        linkedin,
        careerGoal
      },
      {
        new: true,
        runValidators: true
      }
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
})

router.put('/resume', authMiddleware, async (req, res) => {
  try {
    const {
      resumeScore,
      resumeText,
      selectedRole,
      roleMatchPercentage
    } = req.body

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        resumeScore,
        resumeText,
        selectedRole,
        roleMatchPercentage
      },
      {
        new: true,
        runValidators: true
      }
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    res.status(200).json({
      message: 'Resume data saved successfully',
      user
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
})

router.get('/dsa', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('dsaProblems')

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    res.status(200).json({
      dsaProblems: user.dsaProblems || []
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
})

router.put('/dsa', authMiddleware, async (req, res) => {
  try {
    const { dsaProblems } = req.body

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        dsaProblems: Array.isArray(dsaProblems)
          ? dsaProblems
          : []
      },
      {
        new: true,
        runValidators: true
      }
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    res.status(200).json({
      message: 'DSA data saved successfully',
      dsaProblems: user.dsaProblems || []
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
})

router.get('/mock-interviews', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    if (!Array.isArray(user.mockInterviews)) {
      user.mockInterviews = []
      await user.save()
    }

    res.status(200).json({
      mockInterviews: user.mockInterviews
    })
  } catch (error) {
    console.log('Mock interview load error:', error.message)

    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
})

router.post('/mock-interviews', authMiddleware, async (req, res) => {
  try {
    const {
      role,
      question,
      answer,
      score,
      feedback
    } = req.body

    if (!role || !question) {
      return res.status(400).json({
        message: 'Role and question are required'
      })
    }

    const user = await User.findById(req.user.userId)

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    if (!Array.isArray(user.mockInterviews)) {
      user.mockInterviews = []
    }

    user.mockInterviews.push({
      role,
      question,
      answer: answer || '',
      score: Number(score) || 0,
      feedback: feedback || ''
    })

    await user.save()

    res.status(201).json({
      message: 'Mock interview saved successfully',
      mockInterviews: user.mockInterviews
    })
  } catch (error) {
    console.log('Mock interview save error:', error.message)

    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required'
      })
    }

    const normalizedEmail = email.toLowerCase()

    const existingUser = await User.findOne({
      email: normalizedEmail
    })

    if (existingUser) {
      return res.status(400).json({
        message: 'Email already registered'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword
    })

    await user.save()

    res.status(201).json({
      message: 'Registration successful'
    })
  } catch (error) {
    console.log('Register error:', error.message)

    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      })
    }

    const user = await User.findOne({
      email: email.toLowerCase()
    })

    if (!user) {
      return res.status(400).json({
        message: 'Invalid email or password'
      })
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    )

    if (!isPasswordValid) {
      return res.status(400).json({
        message: 'Invalid email or password'
      })
    }

    const token = jwt.sign(
      {
        userId: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    )

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    console.log('Login error:', error.message)

    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
})

router.get('/protected', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    res.status(200).json({
      message: 'Protected route accessed successfully',
      user
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
})

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    res.status(200).json({
      user
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
})

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const {
      name,
      college,
      degree,
      graduationYear,
      skills,
      github,
      linkedin,
      careerGoal
    } = req.body

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        name,
        college,
        degree,
        graduationYear,
        skills,
        github,
        linkedin,
        careerGoal
      },
      {
        new: true,
        runValidators: true
      }
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user
    })
  } catch (error) {
    console.log('Profile update error:', error.message)

    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
})

router.put('/resume', authMiddleware, async (req, res) => {
  try {
    const {
      resumeScore,
      resumeText,
      selectedRole,
      roleMatchPercentage
    } = req.body

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        resumeScore,
        resumeText,
        selectedRole,
        roleMatchPercentage
      },
      {
        new: true,
        runValidators: true
      }
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    res.status(200).json({
      message: 'Resume data saved successfully',
      user
    })
  } catch (error) {
    console.log('Resume save error:', error.message)

    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
})

router.get('/dsa', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('dsaProblems')

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    res.status(200).json({
      dsaProblems: user.dsaProblems || []
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
})

router.put('/dsa', authMiddleware, async (req, res) => {
  try {
    const { dsaProblems } = req.body

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        dsaProblems: Array.isArray(dsaProblems) ? dsaProblems : []
      },
      {
        new: true,
        runValidators: true
      }
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    res.status(200).json({
      message: 'DSA data saved successfully',
      dsaProblems: user.dsaProblems
    })
  } catch (error) {
    console.log('DSA save error:', error.message)

    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
})

router.get('/mock-interviews', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('mockInterviews')

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    res.status(200).json({
      mockInterviews: user.mockInterviews || []
    })
  } catch (error) {
    console.log('Mock interview fetch error:', error.message)

    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
})

router.post('/mock-interviews', authMiddleware, async (req, res) => {
  try {
    const {
      role,
      questions,
      finalScore
    } = req.body

    if (!role || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        message: 'Role and questions are required'
      })
    }

    const user = await User.findById(req.user.userId)

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    if (!Array.isArray(user.mockInterviews)) {
      user.mockInterviews = []
    }

    user.mockInterviews.push({
      role,
      questions,
      finalScore: Number(finalScore) || 0
    })

    await user.save()

    res.status(201).json({
      message: 'Complete mock interview saved successfully',
      mockInterviews: user.mockInterviews
    })
  } catch (error) {
    console.log('Complete mock interview save error:', error.message)

    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
})

module.exports = router
})

module.exports = router