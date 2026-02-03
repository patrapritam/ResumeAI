# TalentLens

**AI-Powered Resume Analysis Platform**

A comprehensive full-stack platform that analyzes resumes against job descriptions, generates cover letters, builds ATS-optimized resumes, and provides personalized career improvement suggestions.

*Created by Pritam Patra*

---

## ✨ Features

### Core Analysis
- **📄 Smart Resume Upload** - Drag-and-drop support for PDF and DOCX formats
- **🎯 AI Skill Matching** - Advanced NLP-powered skill extraction and comparison
- **📊 Match Score Dashboard** - Visual representation of resume-job compatibility with radar charts
- **💡 Personalized Recommendations** - AI-generated improvement suggestions

### Career Tools
- **📝 Resume Builder** - Create professional, ATS-optimized resumes from scratch
- **✉️ Cover Letter Generator** - AI-powered cover letters tailored to job descriptions
- **🔍 ATS Compatibility Check** - Ensure your resume passes Applicant Tracking Systems
- **📚 Learning Paths** - Personalized skill development roadmaps

### Platform Features
- **🏢 Job Library** - Save and manage target job descriptions
- **📈 Admin Analytics** - Trend analysis and skill gap insights
- **🌓 Dark/Light Theme** - Beautiful glassmorphism design with theme toggle
- **🎬 Splash Screen** - Animated intro with branding
- **📱 Responsive Design** - Works on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite | Build Tool & Dev Server |
| React Router v6 | Client-side Routing |
| Recharts | Data Visualization |
| Lucide React | Icon Library |
| CSS Variables | Theming (Dark/Light) |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express | API Framework |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| Multer | File Uploads |
| Axios | HTTP Client |

### NLP Service
| Technology | Purpose |
|------------|---------|
| Python 3.11 | Runtime |
| FastAPI | API Framework |
| PyPDF2 | PDF Text Extraction |
| python-docx | DOCX Processing |
| spaCy | NLP Processing |
| Groq AI | AI Recommendations |

---

## 📁 Project Structure

```
TalentLens/
├── client/                      # React Frontend
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Header.jsx       # Navigation header
│   │   │   ├── Footer.jsx       # Site footer
│   │   │   ├── FAB.jsx          # Floating action button
│   │   │   ├── SplashScreen.jsx # Animated intro
│   │   │   └── RadarChart.jsx   # Skills visualization
│   │   ├── context/             # React context providers
│   │   │   ├── AuthContext.js   # Authentication state
│   │   │   ├── ThemeContext.jsx # Theme management
│   │   │   └── ToastContext.jsx # Notifications
│   │   ├── pages/               # Page components
│   │   │   ├── Landing.jsx      # Home page
│   │   │   ├── Dashboard.jsx    # User dashboard
│   │   │   ├── Upload.jsx       # Resume upload
│   │   │   ├── Analysis.jsx     # Analysis results
│   │   │   ├── JobLibrary.jsx   # Job management
│   │   │   ├── ResumeBuilder.jsx# Resume creation
│   │   │   ├── CoverLetter.jsx  # Cover letter generator
│   │   │   ├── ATSCheck.jsx     # ATS compatibility
│   │   │   └── LearningPath.jsx # Skill roadmaps
│   │   ├── services/            # API services
│   │   └── index.css            # Global styles
│   └── package.json
│
├── server/                      # Node.js Backend
│   ├── src/
│   │   ├── controllers/         # Route handlers
│   │   ├── models/              # MongoDB schemas
│   │   ├── routes/              # API routes
│   │   └── middleware/          # Auth & upload middleware
│   └── package.json
│
├── nlp-service/                 # Python NLP Microservice
│   ├── app/
│   │   ├── extractors/          # Text & skill extraction
│   │   ├── matchers/            # Matching algorithms
│   │   └── recommendations/     # AI suggestions
│   ├── main.py
│   └── requirements.txt
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- MongoDB (local or Atlas)
- Groq API Key (for AI features)

### 1. Clone the Repository

```bash
git clone https://github.com/patrapritam/ResumeAI.git
cd ResumeAI
```

### 2. Set up the NLP Service

```bash
cd nlp-service

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the service
python main.py
```

NLP Service runs on `http://localhost:8000`

### 3. Set up the Backend

```bash
cd server

# Install dependencies
npm install

# Start the server
npm run dev
```

Backend runs on `http://localhost:5000`

### 4. Set up the Frontend

```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 🔧 Environment Variables

### Server (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume-analyzer
JWT_SECRET=your-super-secret-jwt-key
NLP_SERVICE_URL=http://localhost:8000
CLIENT_URL=http://localhost:5173
```

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

### NLP Service (`nlp-service/.env`)
```env
GROQ_API_KEY=your-groq-api-key
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get user profile |

### Resume
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resume/upload` | Upload resume |
| POST | `/api/resume/analyze` | Analyze against job |
| GET | `/api/resume` | Get all resumes |
| DELETE | `/api/resume/:id` | Delete resume |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | Get saved jobs |
| POST | `/api/jobs` | Save new job |
| DELETE | `/api/jobs/:id` | Delete job |

### Cover Letter
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/cover-letter/generate` | Generate cover letter |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/dashboard` | Dashboard stats |
| GET | `/api/analytics/top-skills` | Top missing skills |
| GET | `/api/analytics/trends` | Analysis trends |

---

## 🎨 Design System

TalentLens features a modern **glassmorphism** design with:

- **Gradient backgrounds** with animated orbs
- **Glass-effect cards** with backdrop blur
- **Smooth animations** and transitions
- **Dark/Light theme** support
- **Responsive layouts** for all devices
- **Animated splash screen** with letter-by-letter reveal

### Theme Colors
- Primary: Purple gradient (`#6366f1` → `#a855f7`)
- Accent: Green, Red, Orange for status indicators
- Dark mode: Deep navy backgrounds
- Light mode: Clean white/gray backgrounds

---

## 🧪 Testing

### Health Checks
```bash
# NLP Service
curl http://localhost:8000/health

# Backend
curl http://localhost:5000/api/health
```

---

## 📝 Usage Flow

1. **Visit Landing Page** - See animated splash screen and hero section
2. **Register/Login** - Create account or sign in
3. **Upload Resume** - Drag and drop PDF/DOCX
4. **Add Job Description** - From Job Library or paste directly
5. **View Analysis** - Match score, skill gaps, radar chart
6. **Generate Cover Letter** - AI-powered customized letters
7. **Check ATS Score** - Optimize for applicant tracking systems
8. **Follow Learning Path** - Skill development recommendations

---

## 🌐 Deployment

The platform is deployed on:
- **Frontend**: Vercel
- **Backend**: Render
- **NLP Service**: Render
- **Database**: MongoDB Atlas

Live URL: [TalentLens on Vercel](https://resume-ai-p7w2.vercel.app)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Pritam Patra**
- Email: pritampatra.fb@gmail.com
- GitHub: [@patrapritam](https://github.com/patrapritam)
- LinkedIn: [Pritam Patra](https://linkedin.com/in/patrapritam)

---

## 🙏 Acknowledgments

- Groq AI for fast inference
- spaCy for NLP capabilities
- Recharts for data visualization
- Lucide for beautiful icons
- Vercel & Render for hosting
