import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { resumeAPI } from "../services/api";
import {
  Upload,
  FileText,
  Target,
  Clock,
  TrendingUp,
  ChevronRight,
  Plus,
  Trash2,
  BarChart2,
} from "lucide-react";
import "./Dashboard.css";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalResumes: 0,
    totalAnalyses: 0,
    avgScore: 0,
    lastAnalysis: null,
  });

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const { data } = await resumeAPI.getAll();
      setResumes(data.data.resumes);

      // Calculate stats
      const analyses = data.data.resumes.flatMap((r) =>
        r.lastAnalysis ? [r.lastAnalysis] : []
      );
      const avgScore =
        analyses.length > 0
          ? Math.round(
              analyses.reduce((sum, a) => sum + a.matchScore, 0) /
                analyses.length
            )
          : 0;

      setStats({
        totalResumes: data.data.resumes.length,
        totalAnalyses: data.data.resumes.reduce(
          (sum, r) => sum + r.analysisCount,
          0
        ),
        avgScore,
        lastAnalysis: analyses.sort(
          (a, b) => new Date(b.analyzedAt) - new Date(a.analyzedAt)
        )[0],
      });
    } catch (error) {
      console.error("Failed to fetch resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;

    try {
      await resumeAPI.delete(id);
      setResumes(resumes.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Failed to delete resume:", error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (loading) {
    return (
      <div className="page flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-page page">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {user?.name?.split(" ")[0]}!</h1>
            <p>Track your resume performance and get AI-powered insights</p>
          </div>
          <Link to="/upload" className="btn btn-primary">
            <Plus size={18} />
            New Analysis
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid grid-4">
          <div className="glass-card stat-card">
            <div className="stat-icon">
              <FileText size={24} />
            </div>
            <div className="stat-value">{stats.totalResumes}</div>
            <div className="stat-label">Resumes Uploaded</div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-icon">
              <BarChart2 size={24} />
            </div>
            <div className="stat-value">{stats.totalAnalyses}</div>
            <div className="stat-label">Total Analyses</div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-icon">
              <Target size={24} />
            </div>
            <div className="stat-value">{stats.avgScore}%</div>
            <div className="stat-label">Average Match Score</div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-value">
              {stats.lastAnalysis?.matchScore || "-"}%
            </div>
            <div className="stat-label">Latest Score</div>
          </div>
        </div>

        {/* Resumes Section */}
        <div className="resumes-section">
          <div className="section-header">
            <h2>Your Resumes</h2>
            <Link to="/upload" className="btn btn-secondary btn-sm">
              <Upload size={16} />
              Upload New
            </Link>
          </div>

          {resumes.length === 0 ? (
            <div className="empty-state glass-card">
              <div className="empty-icon">
                <FileText size={48} />
              </div>
              <h3>No resumes yet</h3>
              <p>
                Upload your first resume to get started with AI-powered analysis
              </p>
              <Link to="/upload" className="btn btn-primary">
                <Upload size={18} />
                Upload Resume
              </Link>
            </div>
          ) : (
            <div className="resumes-list">
              {resumes.map((resume) => (
                <div key={resume.id} className="resume-card glass-card">
                  <div className="resume-icon">
                    <FileText size={24} />
                  </div>
                  <div className="resume-info">
                    <h3>{resume.filename}</h3>
                    <div className="resume-meta">
                      <span>{formatFileSize(resume.fileSize)}</span>
                      <span>•</span>
                      <span>{resume.fileType.toUpperCase()}</span>
                      <span>•</span>
                      <span>{formatDate(resume.createdAt)}</span>
                    </div>
                    {resume.skills?.technical?.length > 0 && (
                      <div className="resume-skills">
                        {resume.skills.technical.slice(0, 5).map((skill, i) => (
                          <span key={i} className="skill-tag">
                            {skill}
                          </span>
                        ))}
                        {resume.skills.technical.length > 5 && (
                          <span className="skill-tag more">
                            +{resume.skills.technical.length - 5}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="resume-stats">
                    <div className="analysis-count">
                      <span className="count">{resume.analysisCount}</span>
                      <span className="label">Analyses</span>
                    </div>
                    {resume.lastAnalysis && (
                      <div className="last-score">
                        <div
                          className="score-badge"
                          style={{
                            background:
                              resume.lastAnalysis.matchScore >= 70
                                ? "rgba(16, 185, 129, 0.2)"
                                : resume.lastAnalysis.matchScore >= 50
                                ? "rgba(249, 115, 22, 0.2)"
                                : "rgba(239, 68, 68, 0.2)",
                            color:
                              resume.lastAnalysis.matchScore >= 70
                                ? "var(--accent-green)"
                                : resume.lastAnalysis.matchScore >= 50
                                ? "var(--accent-orange)"
                                : "var(--accent-red)",
                          }}
                        >
                          {resume.lastAnalysis.matchScore}%
                        </div>
                        <span className="label">Last Score</span>
                      </div>
                    )}
                  </div>
                  <div className="resume-actions">
                    <Link
                      to={`/upload?resumeId=${resume.id}`}
                      className="btn btn-secondary btn-sm"
                    >
                      Analyze
                      <ChevronRight size={16} />
                    </Link>
                    <button
                      className="btn btn-icon"
                      onClick={() => handleDelete(resume.id)}
                      title="Delete resume"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
