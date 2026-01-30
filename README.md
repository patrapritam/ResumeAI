# AI Resume Analyzer Platform

A full-stack AI platform that analyzes resumes against job descriptions to calculate match scores, identify skill gaps, and generate personalized improvement suggestions.

![ResumeAI](https://via.placeholder.com/800x400/1a1a2e/6366f1?text=ResumeAI+Platform)

## 🚀 Features

- **📄 Resume Upload** - Support for PDF and DOCX formats with drag-and-drop
- **🎯 Skill Matching** - AI-powered skill extraction and comparison
- **📊 Match Score Dashboard** - Visual representation of resume-job compatibility
- **💡 AI Recommendations** - Personalized improvement suggestions
- **📈 Admin Analytics** - Trend analysis and skill gap insights
- **🔐 Secure Authentication** - JWT-based user authentication

## 🛠️ Tech Stack

### Frontend
- React 18 with Vite
- React Router for navigation
- Recharts for data visualization
- Lucide React for icons
- Modern CSS with glassmorphism design

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Multer for file uploads

### NLP Service
- Python with FastAPI
- PyPDF2 and python-docx for text extraction
- Skill matching algorithms
- AI recommendation engine

## 📁 Project Structure

```
resume-analyzer/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── index.css       # Global styles
│   └── package.json
│
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   └── middleware/     # Auth & upload middleware
│   └── package.json
│
├── nlp-service/            # Python NLP Microservice
│   ├── app/
│   │   ├── extractors/     # Text & skill extraction
│   │   ├── matchers/       # Matching algorithms
│   │   └── recommendations/# AI suggestions
│   ├── main.py
│   └── requirements.txt
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+
- MongoDB (local or Atlas)

### 1. Clone the repository

```bash
cd "New Project"
```

### 2. Set up the NLP Service

```bash
cd nlp-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the service
python main.py
```

The NLP service will run on `http://localhost:8000`

### 3. Set up the Backend

```bash
cd server

# Install dependencies
npm install

# Create .env file (already created with defaults)
# Update MONGODB_URI if using Atlas

# Start the server
npm run dev
```

The backend will run on `http://localhost:5000`

### 4. Set up the Frontend

```bash
cd client

# Install dependencies (already done)
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔧 Environment Variables

### Server (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume-analyzer
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NLP_SERVICE_URL=http://localhost:8000
CLIENT_URL=http://localhost:5173
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

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
| GET | `/api/resume/:id` | Get resume by ID |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/dashboard` | Dashboard stats |
| GET | `/api/analytics/top-skills` | Top missing skills |
| GET | `/api/analytics/trends` | Analysis trends |

## 🎨 UI Components

The platform features a modern glassmorphism design with:
- Gradient backgrounds
- Floating orb animations
- Smooth transitions
- Responsive layouts
- Interactive charts

## 🧪 Testing

### Test the NLP Service
```bash
curl http://localhost:8000/health
```

### Test the Backend
```bash
curl http://localhost:5000/api/health
```

## 📝 Usage

1. **Register/Login** - Create an account or sign in
2. **Upload Resume** - Drag and drop your PDF/DOCX resume
3. **Enter Job Description** - Paste the job posting
4. **View Analysis** - See your match score and recommendations
5. **Improve** - Follow AI suggestions to enhance your resume

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- spaCy for NLP capabilities
- Recharts for data visualization
- Lucide for beautiful icons
