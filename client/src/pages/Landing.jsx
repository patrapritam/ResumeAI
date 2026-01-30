import { Link } from "react-router-dom";
import {
  Upload,
  Target,
  Sparkles,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
} from "lucide-react";
import "./Landing.css";

function Landing() {
  const features = [
    {
      icon: <Upload size={28} />,
      title: "Smart Upload",
      description:
        "Upload your resume in PDF or DOCX format. Our AI instantly extracts and analyzes your skills.",
    },
    {
      icon: <Target size={28} />,
      title: "Skill Matching",
      description:
        "Compare your skills against job requirements with precision-tuned matching algorithms.",
    },
    {
      icon: <Sparkles size={28} />,
      title: "AI Suggestions",
      description:
        "Receive personalized recommendations to improve your resume and bridge skill gaps.",
    },
    {
      icon: <BarChart3 size={28} />,
      title: "Analytics Dashboard",
      description:
        "Track your progress with beautiful visualizations and actionable insights.",
    },
  ];

  const stats = [
    { value: "95%", label: "Accuracy Rate" },
    { value: "10K+", label: "Resumes Analyzed" },
    { value: "500+", label: "Skills Tracked" },
    { value: "4.9★", label: "User Rating" },
  ];

  const steps = [
    { step: "01", title: "Upload Resume", desc: "Drop your PDF or DOCX file" },
    { step: "02", title: "Add Job Description", desc: "Paste the job posting" },
    { step: "03", title: "Get Analysis", desc: "See your match score" },
    { step: "04", title: "Improve", desc: "Follow AI recommendations" },
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Zap size={14} />
              AI-Powered Resume Analysis
            </div>
            <h1>
              Land Your Dream Job with
              <span className="text-gradient"> AI-Powered</span> Resume Analysis
            </h1>
            <p className="hero-subtitle">
              Upload your resume, paste a job description, and let our AI
              calculate your match score, identify skill gaps, and provide
              personalized improvement suggestions.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started Free
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Sign In
              </Link>
            </div>
            <div className="hero-features">
              <div className="hero-feature">
                <CheckCircle size={16} />
                <span>No credit card required</span>
              </div>
              <div className="hero-feature">
                <CheckCircle size={16} />
                <span>Free forever plan</span>
              </div>
              <div className="hero-feature">
                <CheckCircle size={16} />
                <span>Instant results</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card glass-card">
              <div className="score-display">
                <div className="score-circle">
                  <svg viewBox="0 0 100 100">
                    <circle className="score-bg" cx="50" cy="50" r="45" />
                    <circle
                      className="score-fill"
                      cx="50"
                      cy="50"
                      r="45"
                      strokeDasharray="283"
                      strokeDashoffset="56.6"
                    />
                  </svg>
                  <div className="score-value">
                    <span className="score-number">85</span>
                    <span className="score-percent">%</span>
                  </div>
                </div>
                <h3>Match Score</h3>
                <p>Based on 24 skills matched</p>
              </div>
              <div className="skills-preview">
                <div className="skill-tag matched">React</div>
                <div className="skill-tag matched">TypeScript</div>
                <div className="skill-tag matched">Node.js</div>
                <div className="skill-tag missing">Kubernetes</div>
                <div className="skill-tag missing">AWS</div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-bg">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item glass-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header">
            <h2>Powerful Features for Job Seekers</h2>
            <p>
              Everything you need to optimize your resume and land more
              interviews
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card glass-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Get your resume analyzed in four simple steps</p>
          </div>
          <div className="steps-grid">
            {steps.map((item, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{item.step}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                {index < steps.length - 1 && (
                  <div className="step-arrow">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card glass-card">
            <div className="cta-content">
              <h2>Ready to Boost Your Job Search?</h2>
              <p>
                Join thousands of job seekers who have improved their resumes
                with AI.
              </p>
              <Link to="/register" className="btn btn-primary btn-lg">
                Start Analyzing Free
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className="cta-features">
              <div className="cta-feature">
                <Shield size={20} />
                <span>Your data is secure</span>
              </div>
              <div className="cta-feature">
                <TrendingUp size={20} />
                <span>Improve with every analysis</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
