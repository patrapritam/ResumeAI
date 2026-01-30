import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resumeAPI } from "../services/api";
import {
  Upload as UploadIcon,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import "./Upload.css";

function Upload() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const existingResumeId = searchParams.get("resumeId");

  const [file, setFile] = useState(null);
  const [resumeId, setResumeId] = useState(existingResumeId);
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [step, setStep] = useState(existingResumeId ? 2 : 1);

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      setUploadError("Please upload a PDF or DOCX file (max 10MB)");
      return;
    }

    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setUploadError("");

      // Upload the file
      await handleUpload(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  const handleUpload = async (uploadFile) => {
    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("resume", uploadFile);

      const { data } = await resumeAPI.upload(formData);
      setResumeId(data.data.resume.id);
      setStep(2);
    } catch (error) {
      setUploadError(
        error.response?.data?.message || "Upload failed. Please try again."
      );
      setFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      return;
    }

    setAnalyzing(true);

    try {
      const { data } = await resumeAPI.analyze({
        resumeId,
        jobDescription,
        jobTitle: jobTitle || "Untitled Position",
      });

      setAnalysisResult(data.data);
      setStep(3);
    } catch (error) {
      setUploadError(
        error.response?.data?.message || "Analysis failed. Please try again."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setResumeId(null);
    setJobDescription("");
    setJobTitle("");
    setAnalysisResult(null);
    setUploadError("");
    setStep(1);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="upload-page page">
      <div className="container">
        <div className="upload-header">
          <h1>Analyze Your Resume</h1>
          <p>
            Upload your resume and enter a job description to get your match
            score
          </p>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          <div
            className={`step ${step >= 1 ? "active" : ""} ${
              step > 1 ? "completed" : ""
            }`}
          >
            <div className="step-number">
              {step > 1 ? <CheckCircle size={18} /> : "1"}
            </div>
            <span>Upload Resume</span>
          </div>
          <div className="step-line"></div>
          <div
            className={`step ${step >= 2 ? "active" : ""} ${
              step > 2 ? "completed" : ""
            }`}
          >
            <div className="step-number">
              {step > 2 ? <CheckCircle size={18} /> : "2"}
            </div>
            <span>Job Description</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 3 ? "active" : ""}`}>
            <div className="step-number">3</div>
            <span>Results</span>
          </div>
        </div>

        {uploadError && (
          <div
            className="alert alert-error"
            style={{ marginBottom: "var(--space-lg)" }}
          >
            <AlertCircle size={18} />
            {uploadError}
          </div>
        )}

        {/* Step 1: Upload */}
        {step === 1 && (
          <div className="upload-section glass-card">
            <div
              {...getRootProps()}
              className={`dropzone ${isDragActive ? "active" : ""} ${
                uploading ? "uploading" : ""
              }`}
            >
              <input {...getInputProps()} />

              {uploading ? (
                <div className="upload-loading">
                  <div className="spinner"></div>
                  <h3>Uploading and extracting text...</h3>
                  <p>This may take a moment</p>
                </div>
              ) : file ? (
                <div className="file-preview">
                  <div className="file-icon">
                    <FileText size={32} />
                  </div>
                  <div className="file-info">
                    <h4>{file.name}</h4>
                    <span>{formatFileSize(file.size)}</span>
                  </div>
                  <button
                    className="remove-file"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="dropzone-icon">
                    <UploadIcon size={48} />
                  </div>
                  <h3>
                    {isDragActive
                      ? "Drop your resume here"
                      : "Drag & drop your resume"}
                  </h3>
                  <p>or click to browse</p>
                  <span className="file-types">PDF, DOCX up to 10MB</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Job Description */}
        {step === 2 && (
          <div className="job-section glass-card">
            <div className="job-header">
              <h2>Enter Job Description</h2>
              <p>
                Paste the job posting to analyze how well your resume matches
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Job Title (Optional)</label>
              <input
                type="text"
                className="form-input"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g., Senior Frontend Developer"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Job Description *</label>
              <textarea
                className="form-input form-textarea"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={10}
              />
            </div>

            <div className="job-actions">
              <button className="btn btn-secondary" onClick={resetUpload}>
                Start Over
              </button>
              <button
                className="btn btn-primary btn-lg"
                onClick={handleAnalyze}
                disabled={!jobDescription.trim() || analyzing}
              >
                {analyzing ? (
                  <>
                    <div
                      className="spinner"
                      style={{ width: 20, height: 20 }}
                    ></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Analyze Match
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && analysisResult && (
          <div className="results-section">
            {/* Score Card */}
            <div className="score-card glass-card">
              <div className="score-display">
                <div className="score-circle large">
                  <svg viewBox="0 0 100 100">
                    <circle className="score-bg" cx="50" cy="50" r="45" />
                    <circle
                      className="score-fill"
                      cx="50"
                      cy="50"
                      r="45"
                      style={{
                        strokeDashoffset:
                          283 - (283 * analysisResult.matchScore) / 100,
                        stroke:
                          analysisResult.matchScore >= 70
                            ? "var(--accent-green)"
                            : analysisResult.matchScore >= 50
                            ? "var(--accent-orange)"
                            : "var(--accent-red)",
                      }}
                    />
                  </svg>
                  <div className="score-value">
                    <span className="score-number">
                      {Math.round(analysisResult.matchScore)}
                    </span>
                    <span className="score-percent">%</span>
                  </div>
                </div>
                <h2>Match Score</h2>
                <p className="score-assessment">
                  {analysisResult.overallAssessment}
                </p>
              </div>

              <div className="sub-scores">
                <div className="sub-score">
                  <div className="sub-score-label">Skill Match</div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${analysisResult.skillMatchScore}%` }}
                    ></div>
                  </div>
                  <span className="sub-score-value">
                    {Math.round(analysisResult.skillMatchScore)}%
                  </span>
                </div>
                <div className="sub-score">
                  <div className="sub-score-label">Experience Match</div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${analysisResult.experienceMatchScore}%`,
                      }}
                    ></div>
                  </div>
                  <span className="sub-score-value">
                    {Math.round(analysisResult.experienceMatchScore)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Skills Analysis */}
            <div className="skills-analysis grid-2">
              <div className="glass-card skill-group">
                <h3>
                  <CheckCircle size={20} className="text-green" />
                  Matched Skills ({analysisResult.matchedSkills?.length || 0})
                </h3>
                <div className="skill-tags">
                  {analysisResult.matchedSkills?.map((skill, i) => (
                    <span key={i} className="skill-tag matched">
                      {skill}
                    </span>
                  ))}
                  {(!analysisResult.matchedSkills ||
                    analysisResult.matchedSkills.length === 0) && (
                    <p className="no-skills">No matching skills found</p>
                  )}
                </div>
              </div>

              <div className="glass-card skill-group">
                <h3>
                  <AlertCircle size={20} className="text-red" />
                  Missing Skills ({analysisResult.missingSkills?.length || 0})
                </h3>
                <div className="skill-tags">
                  {analysisResult.missingSkills?.map((skill, i) => (
                    <span key={i} className="skill-tag missing">
                      {skill}
                    </span>
                  ))}
                  {(!analysisResult.missingSkills ||
                    analysisResult.missingSkills.length === 0) && (
                    <p className="no-skills">You have all required skills!</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {analysisResult.recommendations &&
              analysisResult.recommendations.length > 0 && (
                <div className="recommendations-section glass-card">
                  <h3>
                    <Sparkles size={20} />
                    AI Recommendations
                  </h3>
                  <div className="recommendations-list">
                    {analysisResult.recommendations.map((rec, i) => (
                      <div key={i} className="recommendation-item">
                        <div className="rec-header">
                          <span
                            className={`rec-priority ${rec.priority.toLowerCase()}`}
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

            {/* Resume Improvements */}
            {analysisResult.resumeImprovements &&
              analysisResult.resumeImprovements.length > 0 && (
                <div className="improvements-section glass-card">
                  <h3>Resume Improvement Tips</h3>
                  <ul className="improvements-list">
                    {analysisResult.resumeImprovements.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Actions */}
            <div className="results-actions">
              <button className="btn btn-secondary" onClick={resetUpload}>
                New Analysis
              </button>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload;
