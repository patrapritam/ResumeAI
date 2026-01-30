import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resumeAPI } from "../services/api";
import { useToast } from "../context/ToastContext";
import RadarChart from "../components/RadarChart";
import { SkeletonAnalysis } from "../components/Skeleton";
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Target,
  TrendingUp,
  Clock,
  Download,
  Share2,
  Copy,
  GraduationCap,
  Shield,
} from "lucide-react";
import "./Analysis.css";

function Analysis() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const scoreRef = useRef(null);

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        const { data } = await resumeAPI.getAnalysis(id);
        setAnalysis(data.data.analysis);

        // Trigger confetti for high scores
        if (data.data.analysis.matchScore >= 80) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }

        // Animate score
        const target = Math.round(data.data.analysis.matchScore);
        let current = 0;
        const step = target / 50;
        const interval = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(interval);
          }
          setAnimatedScore(Math.round(current));
        }, 30);
      } catch {
        setLoadError("Failed to load analysis");
      } finally {
        setLoading(false);
      }
    };
    loadAnalysis();
  }, [id]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const exportToPDF = () => {
    // Generate PDF content
    const content = `
RESUME ANALYSIS REPORT
======================

Job: ${analysis.jobTitle}
Date: ${formatDate(analysis.createdAt)}

OVERALL MATCH SCORE: ${Math.round(analysis.matchScore)}%
Skill Match: ${Math.round(analysis.skillMatchScore)}%
Experience Match: ${Math.round(analysis.experienceMatchScore)}%

ASSESSMENT
----------
${analysis.overallAssessment}

MATCHED SKILLS (${analysis.matchedSkills?.length || 0})
--------------
${analysis.matchedSkills?.join(", ") || "None"}

MISSING SKILLS (${analysis.missingSkills?.length || 0})
--------------
${analysis.missingSkills?.join(", ") || "None"}

RECOMMENDATIONS
---------------
${analysis.recommendations?.map((r, i) => `${i + 1}. [${r.priority}] ${r.skill}: ${r.suggestion}`).join("\n") || "None"}

RESUME IMPROVEMENTS
-------------------
${analysis.resumeImprovements?.map((tip, i) => `${i + 1}. ${tip}`).join("\n") || "None"}
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analysis-${analysis.jobTitle.toLowerCase().replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    success("Report downloaded!");
  };

  const shareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    success("Link copied to clipboard!");
  };

  const copyRecommendations = () => {
    const text = analysis.recommendations
      ?.map((r) => `[${r.priority}] ${r.skill}: ${r.suggestion}`)
      .join("\n");
    navigator.clipboard.writeText(text || "No recommendations");
    success("Recommendations copied!");
  };

  if (loading) {
    return (
      <div className="analysis-page page">
        <div className="container">
          <SkeletonAnalysis />
        </div>
      </div>
    );
  }

  if (loadError || !analysis) {
    return (
      <div className="page">
        <div className="container">
          <div className="error-state glass-card">
            <AlertCircle size={48} />
            <h2>{loadError || "Analysis not found"}</h2>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="analysis-page page">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: [
                  "#6366f1",
                  "#8b5cf6",
                  "#10b981",
                  "#f59e0b",
                  "#ec4899",
                ][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      <div className="container">
        {/* Header */}
        <div className="analysis-header">
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            Back
          </button>
          <div className="header-info">
            <h1>{analysis.jobTitle}</h1>
            <div className="analysis-meta">
              <Clock size={14} />
              <span>Analyzed {formatDate(analysis.createdAt)}</span>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary btn-sm" onClick={exportToPDF}>
              <Download size={16} />
              Export
            </button>
            <button className="btn btn-secondary btn-sm" onClick={shareLink}>
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>

        {/* Score Overview */}
        <div className="score-overview glass-card">
          <div className="main-score">
            <div className="score-circle large" ref={scoreRef}>
              <svg viewBox="0 0 100 100">
                <circle className="score-bg" cx="50" cy="50" r="45" />
                <circle
                  className="score-fill"
                  cx="50"
                  cy="50"
                  r="45"
                  style={{
                    strokeDashoffset: 283 - (283 * animatedScore) / 100,
                    stroke:
                      animatedScore >= 70
                        ? "var(--accent-green)"
                        : animatedScore >= 50
                          ? "var(--accent-orange)"
                          : "var(--accent-red)",
                  }}
                />
              </svg>
              <div className="score-value">
                <span className="score-number">{animatedScore}</span>
                <span className="score-percent">%</span>
              </div>
            </div>
            <h2>Overall Match</h2>
            {analysis.matchScore >= 80 && (
              <span className="excellent-badge">🎉 Excellent Match!</span>
            )}
          </div>

          <div className="score-breakdown">
            <div className="breakdown-item">
              <div className="breakdown-icon">
                <Target size={20} />
              </div>
              <div className="breakdown-info">
                <span className="breakdown-value">
                  {Math.round(analysis.skillMatchScore)}%
                </span>
                <span className="breakdown-label">Skill Match</span>
              </div>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-icon">
                <TrendingUp size={20} />
              </div>
              <div className="breakdown-info">
                <span className="breakdown-value">
                  {Math.round(analysis.experienceMatchScore)}%
                </span>
                <span className="breakdown-label">Experience Match</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <Link to={`/learning-path/${id}`} className="action-card glass-card">
            <GraduationCap size={24} />
            <span>View Learning Path</span>
          </Link>
          <Link to="/ats-check" className="action-card glass-card">
            <Shield size={24} />
            <span>Check ATS Compatibility</span>
          </Link>
        </div>

        {/* Radar Chart */}
        {(analysis.matchedSkills?.length > 0 ||
          analysis.missingSkills?.length > 0) && (
          <div className="glass-card radar-section">
            <RadarChart
              resumeSkills={analysis.matchedSkills || []}
              requiredSkills={[
                ...(analysis.matchedSkills || []),
                ...(analysis.missingSkills || []),
              ]}
              title="Skill Comparison"
            />
          </div>
        )}

        {/* Assessment */}
        <div className="assessment-section glass-card">
          <h3>Assessment</h3>
          <p>{analysis.overallAssessment}</p>
        </div>

        {/* Skills Grid */}
        <div className="skills-grid grid-2">
          <div className="glass-card">
            <h3>
              <CheckCircle size={20} className="text-green" />
              Matched Skills ({analysis.matchedSkills?.length || 0})
            </h3>
            <div className="skill-tags">
              {analysis.matchedSkills?.map((skill, i) => (
                <span key={i} className="skill-tag matched">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="glass-card">
            <h3>
              <AlertCircle size={20} className="text-red" />
              Missing Skills ({analysis.missingSkills?.length || 0})
            </h3>
            <div className="skill-tags">
              {analysis.missingSkills?.map((skill, i) => (
                <span key={i} className="skill-tag missing">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {analysis.recommendations?.length > 0 && (
          <div className="recommendations-section glass-card">
            <div className="recommendations-header">
              <h3>
                <Sparkles size={20} />
                Recommendations
              </h3>
              <button
                className="btn btn-secondary btn-sm"
                onClick={copyRecommendations}
              >
                <Copy size={14} />
                Copy All
              </button>
            </div>
            <div className="recommendations-list">
              {analysis.recommendations.map((rec, i) => (
                <div key={i} className="recommendation-item">
                  <div className="rec-header">
                    <span
                      className={`rec-priority ${rec.priority?.toLowerCase()}`}
                    >
                      {rec.priority}
                    </span>
                    <span className="rec-skill">{rec.skill}</span>
                  </div>
                  <p>{rec.suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Improvements */}
        {analysis.resumeImprovements?.length > 0 && (
          <div className="improvements-section glass-card">
            <h3>Resume Improvements</h3>
            <ul className="improvements-list">
              {analysis.resumeImprovements.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analysis;
