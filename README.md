# CareerPilot

CareerPilot is a full-stack career guidance platform designed to help students prepare for software development careers through resume analysis, DSA tracking, mock interviews, profile management, progress tracking, and job recommendations.

## Live Project

https://career-pilot-mocha-phi.vercel.app/

## Features

### Authentication

* User registration and login
* Password hashing using bcrypt
* JWT-based authentication
* Protected backend routes

### Profile Management

* Student profile
* College and degree details
* Skills
* GitHub and LinkedIn profiles
* Career goal
* MongoDB-based profile persistence

### Resume Analyzer

* PDF resume upload
* Resume text extraction
* Technical skill detection
* Resume section detection
* Resume scoring
* Target role matching
* Strengths and improvement suggestions
* Resume analysis report download
* Resume data stored in MongoDB

### DSA Tracker

* Add DSA problems
* Track problem difficulty and topic
* Mark problems as solved
* Delete problems
* Track DSA progress
* MongoDB persistence

### AI-Style Mock Interview

* HR interview questions
* Technical interview questions
* Mixed interview mode
* Answer evaluation
* Question-wise scoring
* Feedback
* Final interview score
* Interview history
* MongoDB persistence

### Job Recommendations

* Job role preferences
* Location preferences
* Job type preferences
* Resume/profile-based job matching

### Progress Dashboard

* Profile completion
* Resume score
* DSA progress
* Mock interview statistics
* Latest interview score
* Average interview score
* Interview history
* Overall progress

### Settings

* Change password
* Logout
* Application settings

## Tech Stack

### Frontend

* React
* Vite
* React Router
* JavaScript
* CSS
* PDF.js
* jsPDF

### Backend

* Node.js
* Express.js
* REST APIs
* JWT
* bcrypt
* dotenv
* CORS

### Database

* MongoDB Atlas
* Mongoose

### Development Tools

* Git
* GitHub
* VS Code
* Vercel

## Project Structure

```text
CareerPilot/
│
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── DSATracker.jsx
│   │   ├── JobRecommendations.jsx
│   │   ├── MockInterview.jsx
│   │   ├── Progress.jsx
│   │   ├── ResumeAnalyzer.jsx
│   │   ├── Settings.jsx
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## How It Works

```text
User
 │
 ▼
React Frontend
 │
 ▼
Express REST API
 │
 ├── Authentication
 ├── Profile
 ├── Resume
 ├── DSA
 ├── Mock Interviews
 └── Job Preferences
 │
 ▼
MongoDB Atlas
```

## Authentication Flow

```text
Register
   ↓
Password Hashing
   ↓
MongoDB
   ↓
Login
   ↓
JWT Token
   ↓
Protected API Requests
```

## Resume Analysis Flow

```text
Upload PDF
   ↓
Extract Resume Text
   ↓
Detect Skills & Sections
   ↓
Calculate Resume Score
   ↓
Calculate Role Match
   ↓
Generate Suggestions
   ↓
Save Results to MongoDB
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/muskan-create/CareerPilot.git
cd CareerPilot
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd backend
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
```

Do not upload the `.env` file to GitHub.

### 5. Start backend

```bash
cd backend
npm run dev
```

### 6. Start frontend

```bash
cd frontend
npm run dev
```

Open the frontend URL shown by Vite in your browser.

## Security

* Passwords are hashed using bcrypt.
* Protected APIs use JWT authentication.
* Sensitive environment variables are stored in `.env`.
* Environment files are excluded from GitHub using `.gitignore`.

## Future Enhancements

* Advanced AI-powered interview evaluation
* More personalized job recommendations
* Additional DSA question sets
* Resume improvement recommendations
* Advanced analytics and visualizations
* Production deployment improvements

## Author

**Muskan Prajapati**

B.Tech Computer Science Engineering — Data Science

GitHub: https://github.com/muskan-create

## License

This project is created for educational and portfolio purposes.
