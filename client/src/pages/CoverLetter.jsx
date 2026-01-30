import { useState, useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { resumeAPI } from "../services/api";
import {
  FileEdit,
  Sparkles,
  Copy,
  Download,
  RefreshCw,
  FileText,
  Briefcase,
  ChevronDown,
} from "lucide-react";
import "./CoverLetter.css";

const TEMPLATES = [
  {
    id: "professional",
    name: "Professional",
    description: "Formal and corporate tone",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Modern and engaging style",
  },
  {
    id: "enthusiastic",
    name: "Enthusiastic",
    description: "High energy and passionate",
  },
];

function CoverLetter() {
  const { user } = useContext(AuthContext);
  const { success, error } = useToast();
  const [searchParams] = useSearchParams();
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [template, setTemplate] = useState("professional");
  const [coverLetter, setCoverLetter] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const { data } = await resumeAPI.getAll();
      setResumes(data.data?.resumes || []);
      if (data.data?.resumes?.length > 0) {
        setSelectedResume(data.data.resumes[0]);
      }
    } catch (err) {
      console.error("Failed to load resumes:", err);
    }
  };

  const generateCoverLetter = async () => {
    if (!selectedResume || !jobDescription || !companyName || !jobTitle) {
      error("Please fill in all required fields");
      return;
    }

    setGenerating(true);
    try {
      // Simulate AI generation (in production, this would call the NLP service)
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const skills =
        selectedResume.skills?.technical?.slice(0, 5).join(", ") ||
        "relevant technical skills";
      const name = user?.name || "Your Name";

      const templates = {
        professional: `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With my background in ${skills}, I am confident in my ability to contribute effectively to your team.

Throughout my career, I have developed expertise in building scalable solutions and collaborating with cross-functional teams. My experience aligns closely with the requirements outlined in your job description, particularly in areas such as problem-solving, technical implementation, and delivering high-quality results.

What excites me most about ${companyName} is the opportunity to work on innovative projects that make a real impact. I am particularly drawn to your company's commitment to excellence and continuous improvement.

I would welcome the opportunity to discuss how my skills and experience can benefit your team. Thank you for considering my application.

Sincerely,
${name}`,

        creative: `Hi there!

I came across the ${jobTitle} role at ${companyName}, and I couldn't resist applying — it's like this position was made for me!

Here's the deal: I bring ${skills} to the table, along with an obsessive attention to detail and a genuine love for creating things that matter. I've spent my career perfecting my craft and collaborating with amazing teams to deliver exceptional results.

What really caught my attention about ${companyName}? Your innovative approach and the exciting challenges you're tackling. I want to be part of that energy and contribute my unique perspective to your team.

Let's chat! I'd love to share more about how I can help ${companyName} achieve its goals.

Cheers,
${name}`,

        enthusiastic: `Dear ${companyName} Team,

I am THRILLED to apply for the ${jobTitle} position! This opportunity represents exactly what I've been looking for in my career journey.

My expertise in ${skills} has prepared me exceptionally well for this role. I am passionate about delivering results that exceed expectations and continuously pushing the boundaries of what's possible.

The innovative work happening at ${companyName} is truly inspiring. I am eager to bring my enthusiasm, skills, and fresh ideas to your team and contribute to your continued success.

I am confident that together, we can achieve remarkable things. I would be honored to discuss how my passion and expertise align with ${companyName}'s mission.

With great enthusiasm,
${name}`,
      };

      setCoverLetter(templates[template]);
      success("Cover letter generated!");
    } catch (err) {
      error("Failed to generate cover letter");
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter);
    success("Copied to clipboard!");
  };

  const downloadAsText = () => {
    const blob = new Blob([coverLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter-${companyName.toLowerCase().replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    success("Downloaded!");
  };

  return (
    <div className="cover-letter-page page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>
              <Sparkles size={28} />
              Cover Letter Generator
            </h1>
            <p>Create a tailored cover letter in seconds</p>
          </div>
        </div>

        <div className="generator-layout">
          {/* Input Section */}
          <div className="input-section glass-card">
            <h2>
              <FileText size={20} />
              Input Details
            </h2>

            <div className="form-group">
              <label>Select Resume</label>
              <div className="custom-select">
                <select
                  value={selectedResume?.id || ""}
                  onChange={(e) => {
                    const resume = resumes.find((r) => r.id === e.target.value);
                    setSelectedResume(resume);
                  }}
                >
                  {resumes.map((resume) => (
                    <option key={resume.id} value={resume.id}>
                      {resume.filename}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., Google"
                />
              </div>
              <div className="form-group">
                <label>Job Title *</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Senior Developer"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Job Description *</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                rows={6}
              />
            </div>

            <div className="form-group">
              <label>Tone Template</label>
              <div className="template-options">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    className={`template-option ${template === t.id ? "active" : ""}`}
                    onClick={() => setTemplate(t.id)}
                  >
                    <span className="template-name">{t.name}</span>
                    <span className="template-desc">{t.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg"
              onClick={generateCoverLetter}
              disabled={generating}
            >
              {generating ? (
                <>
                  <RefreshCw size={18} className="spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Cover Letter
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="output-section glass-card">
            <div className="output-header">
              <h2>
                <FileEdit size={20} />
                Your Cover Letter
              </h2>
              {coverLetter && (
                <div className="output-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={copyToClipboard}
                  >
                    <Copy size={16} />
                    Copy
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={downloadAsText}
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              )}
            </div>

            {coverLetter ? (
              <div className="cover-letter-content">
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={20}
                />
              </div>
            ) : (
              <div className="empty-output">
                <Sparkles size={48} />
                <h3>No cover letter yet</h3>
                <p>
                  Fill in the details and click "Generate" to create your
                  personalized cover letter.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoverLetter;
