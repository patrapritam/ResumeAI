import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { resumeAPI } from "../services/api";
import {
  Shield,
  Upload,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Zap,
  Eye,
  RefreshCw,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import "./ATSCheck.css";

function ATSCheck() {
  const { user } = useContext(AuthContext);
  const { success, error } = useToast();
  const [file, setFile] = useState(null);
  const [checking, setChecking] = useState(false);
  const [results, setResults] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1,
    onDrop: (accepted) => {
      if (accepted.length > 0) {
        setFile(accepted[0]);
        setResults(null);
      }
    },
  });

  const checkATS = async () => {
    if (!file) return;

    setChecking(true);
    try {
      // Simulate ATS check (in production, this would call the NLP service)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulated results
      setResults({
        score: Math.floor(Math.random() * 30) + 70,
        parsing: {
          success: true,
          contactFound: true,
          experienceFound: true,
          educationFound: true,
          skillsFound: true,
        },
        issues: [
          {
            type: "warning",
            message:
              "Consider using standard section headers (e.g., 'Experience' instead of 'Work History')",
          },
          {
            type: "warning",
            message: "Some bullet points may be too long for ATS parsing",
          },
          {
            type: "info",
            message: "PDF format detected - some ATS systems prefer DOCX",
          },
        ],
        keywords: {
          found: ["JavaScript", "React", "Node.js", "Python", "SQL"],
          suggested: ["TypeScript", "AWS", "Docker", "Agile"],
        },
        formatting: {
          hasHeader: true,
          hasFooter: false,
          hasColumns: false,
          hasGraphics: false,
          fontConsistent: true,
        },
      });
      success("ATS check complete!");
    } catch (err) {
      error("Failed to check resume");
    } finally {
      setChecking(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResults(null);
  };

  return (
    <div className="ats-check-page page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>
              <Shield size={28} />
              ATS Compatibility Check
            </h1>
            <p>See how your resume performs with Applicant Tracking Systems</p>
          </div>
        </div>

        <div className="ats-layout">
          {/* Upload Section */}
          <div className="glass-card upload-section">
            <h2>
              <Upload size={20} />
              Upload Resume
            </h2>

            {!file ? (
              <div
                {...getRootProps()}
                className={`dropzone ${isDragActive ? "active" : ""}`}
              >
                <input {...getInputProps()} />
                <FileText size={48} />
                <p>Drag & drop your resume here</p>
                <span>or click to browse (PDF, DOCX)</span>
              </div>
            ) : (
              <div className="file-preview">
                <FileText size={32} />
                <div className="file-info">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <button className="btn btn-icon" onClick={reset}>
                  <XCircle size={20} />
                </button>
              </div>
            )}

            <button
              className="btn btn-primary btn-lg"
              onClick={checkATS}
              disabled={!file || checking}
            >
              {checking ? (
                <>
                  <RefreshCw size={18} className="spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Check ATS Compatibility
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          {results && (
            <div className="results-section">
              {/* Score Card */}
              <div className="glass-card score-card">
                <div className="score-circle">
                  <svg viewBox="0 0 100 100">
                    <circle className="score-bg" cx="50" cy="50" r="45" />
                    <circle
                      className="score-fill"
                      cx="50"
                      cy="50"
                      r="45"
                      style={{
                        strokeDashoffset: 283 - (283 * results.score) / 100,
                        stroke:
                          results.score >= 80
                            ? "var(--accent-green)"
                            : results.score >= 60
                              ? "var(--accent-orange)"
                              : "var(--accent-red)",
                      }}
                    />
                  </svg>
                  <div className="score-value">{results.score}%</div>
                </div>
                <h3>ATS Compatibility Score</h3>
                <p>
                  {results.score >= 80
                    ? "Excellent! Your resume is well-optimized for ATS."
                    : results.score >= 60
                      ? "Good, but there's room for improvement."
                      : "Your resume may have issues with ATS systems."}
                </p>
              </div>

              {/* Parsing Results */}
              <div className="glass-card">
                <h3>
                  <Eye size={20} />
                  Parsing Results
                </h3>
                <div className="parsing-grid">
                  <ParseItem
                    label="Contact Info"
                    success={results.parsing.contactFound}
                  />
                  <ParseItem
                    label="Experience"
                    success={results.parsing.experienceFound}
                  />
                  <ParseItem
                    label="Education"
                    success={results.parsing.educationFound}
                  />
                  <ParseItem
                    label="Skills"
                    success={results.parsing.skillsFound}
                  />
                </div>
              </div>

              {/* Issues */}
              {results.issues.length > 0 && (
                <div className="glass-card">
                  <h3>
                    <AlertTriangle size={20} />
                    Issues & Recommendations
                  </h3>
                  <div className="issues-list">
                    {results.issues.map((issue, i) => (
                      <div key={i} className={`issue-item ${issue.type}`}>
                        {issue.type === "warning" ? (
                          <AlertTriangle size={16} />
                        ) : (
                          <CheckCircle size={16} />
                        )}
                        <span>{issue.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Keywords */}
              <div className="glass-card">
                <h3>Keywords Analysis</h3>
                <div className="keywords-section">
                  <div>
                    <h4>
                      <CheckCircle size={16} className="text-green" />
                      Found Keywords
                    </h4>
                    <div className="keyword-tags">
                      {results.keywords.found.map((kw, i) => (
                        <span key={i} className="keyword-tag found">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4>
                      <AlertTriangle size={16} className="text-orange" />
                      Consider Adding
                    </h4>
                    <div className="keyword-tags">
                      {results.keywords.suggested.map((kw, i) => (
                        <span key={i} className="keyword-tag suggested">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Formatting */}
              <div className="glass-card">
                <h3>Formatting Check</h3>
                <div className="formatting-grid">
                  <FormatItem
                    label="No graphics/images"
                    success={!results.formatting.hasGraphics}
                  />
                  <FormatItem
                    label="Single column layout"
                    success={!results.formatting.hasColumns}
                  />
                  <FormatItem
                    label="Consistent fonts"
                    success={results.formatting.fontConsistent}
                  />
                  <FormatItem
                    label="No headers/footers"
                    success={
                      !results.formatting.hasHeader &&
                      !results.formatting.hasFooter
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ParseItem({ label, success }) {
  return (
    <div className={`parse-item ${success ? "success" : "fail"}`}>
      {success ? <CheckCircle size={18} /> : <XCircle size={18} />}
      <span>{label}</span>
    </div>
  );
}

function FormatItem({ label, success }) {
  return (
    <div className={`format-item ${success ? "success" : "warning"}`}>
      {success ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
      <span>{label}</span>
    </div>
  );
}

export default ATSCheck;
