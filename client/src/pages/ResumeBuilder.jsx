import { useState } from "react";
import { useToast } from "../context/ToastContext";
import {
  FileEdit,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  Plus,
  Trash2,
  Download,
  Eye,
  Save,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import "./ResumeBuilder.css";

const SECTIONS = {
  personalInfo: { title: "Personal Information", icon: User },
  experience: { title: "Work Experience", icon: Briefcase },
  education: { title: "Education", icon: GraduationCap },
  skills: { title: "Skills", icon: Code },
  certifications: { title: "Certifications", icon: Award },
};

function ResumeBuilder() {
  const { success, error } = useToast();
  const [activeSection, setActiveSection] = useState("personalInfo");
  const [showPreview, setShowPreview] = useState(false);
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      portfolio: "",
      summary: "",
    },
    experience: [],
    education: [],
    skills: { technical: [], soft: [] },
    certifications: [],
  });

  const updatePersonalInfo = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now(),
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        },
      ],
    }));
  };

  const updateExperience = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp,
      ),
    }));
  };

  const removeExperience = (id) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now(),
          degree: "",
          institution: "",
          location: "",
          graduationDate: "",
          gpa: "",
        },
      ],
    }));
  };

  const updateEducation = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu,
      ),
    }));
  };

  const removeEducation = (id) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const addSkill = (type) => {
    const skill = prompt(`Enter a ${type} skill:`);
    if (skill) {
      setResumeData((prev) => ({
        ...prev,
        skills: {
          ...prev.skills,
          [type]: [...prev.skills[type], skill],
        },
      }));
    }
  };

  const removeSkill = (type, index) => {
    setResumeData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: prev.skills[type].filter((_, i) => i !== index),
      },
    }));
  };

  const addCertification = () => {
    setResumeData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { id: Date.now(), name: "", issuer: "", date: "", url: "" },
      ],
    }));
  };

  const updateCertification = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert,
      ),
    }));
  };

  const removeCertification = (id) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((cert) => cert.id !== id),
    }));
  };

  const exportToPDF = () => {
    success("Generating PDF... (Feature coming soon!)");
  };

  const saveResume = () => {
    localStorage.setItem("resumeBuilder", JSON.stringify(resumeData));
    success("Resume saved locally!");
  };

  return (
    <div className="resume-builder-page page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>
              <FileEdit size={28} />
              Resume Builder
            </h1>
            <p>Create a professional resume step by step</p>
          </div>
          <div className="header-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye size={18} />
              {showPreview ? "Edit" : "Preview"}
            </button>
            <button className="btn btn-secondary" onClick={saveResume}>
              <Save size={18} />
              Save
            </button>
            <button className="btn btn-primary" onClick={exportToPDF}>
              <Download size={18} />
              Export PDF
            </button>
          </div>
        </div>

        <div className="builder-layout">
          {/* Sidebar */}
          <div className="builder-sidebar glass-card">
            {Object.entries(SECTIONS).map(([key, { title, icon: Icon }]) => (
              <button
                key={key}
                className={`sidebar-item ${activeSection === key ? "active" : ""}`}
                onClick={() => setActiveSection(key)}
              >
                <Icon size={18} />
                {title}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="builder-content glass-card">
            {showPreview ? (
              <ResumePreview data={resumeData} />
            ) : (
              <>
                {activeSection === "personalInfo" && (
                  <PersonalInfoSection
                    data={resumeData.personalInfo}
                    onChange={updatePersonalInfo}
                  />
                )}
                {activeSection === "experience" && (
                  <ExperienceSection
                    data={resumeData.experience}
                    onAdd={addExperience}
                    onUpdate={updateExperience}
                    onRemove={removeExperience}
                  />
                )}
                {activeSection === "education" && (
                  <EducationSection
                    data={resumeData.education}
                    onAdd={addEducation}
                    onUpdate={updateEducation}
                    onRemove={removeEducation}
                  />
                )}
                {activeSection === "skills" && (
                  <SkillsSection
                    data={resumeData.skills}
                    onAdd={addSkill}
                    onRemove={removeSkill}
                  />
                )}
                {activeSection === "certifications" && (
                  <CertificationsSection
                    data={resumeData.certifications}
                    onAdd={addCertification}
                    onUpdate={updateCertification}
                    onRemove={removeCertification}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PersonalInfoSection({ data, onChange }) {
  return (
    <div className="section-content">
      <h2>Personal Information</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            placeholder="John Doe"
          />
        </div>
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="john@example.com"
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={data.location}
            onChange={(e) => onChange("location", e.target.value)}
            placeholder="San Francisco, CA"
          />
        </div>
        <div className="form-group">
          <label>LinkedIn</label>
          <input
            type="url"
            value={data.linkedin}
            onChange={(e) => onChange("linkedin", e.target.value)}
            placeholder="linkedin.com/in/johndoe"
          />
        </div>
        <div className="form-group">
          <label>Portfolio</label>
          <input
            type="url"
            value={data.portfolio}
            onChange={(e) => onChange("portfolio", e.target.value)}
            placeholder="johndoe.dev"
          />
        </div>
      </div>
      <div className="form-group full-width">
        <label>Professional Summary</label>
        <textarea
          value={data.summary}
          onChange={(e) => onChange("summary", e.target.value)}
          placeholder="Brief summary of your professional background and goals..."
          rows={4}
        />
      </div>
    </div>
  );
}

function ExperienceSection({ data, onAdd, onUpdate, onRemove }) {
  const [expanded, setExpanded] = useState({});

  return (
    <div className="section-content">
      <div className="section-header">
        <h2>Work Experience</h2>
        <button className="btn btn-primary btn-sm" onClick={onAdd}>
          <Plus size={16} />
          Add Experience
        </button>
      </div>
      {data.length === 0 ? (
        <p className="empty-text">
          No experience added yet. Click "Add Experience" to begin.
        </p>
      ) : (
        data.map((exp) => (
          <div key={exp.id} className="collapsible-item">
            <div
              className="collapsible-header"
              onClick={() =>
                setExpanded((prev) => ({ ...prev, [exp.id]: !prev[exp.id] }))
              }
            >
              <span>
                {exp.title || "New Position"}{" "}
                {exp.company && `at ${exp.company}`}
              </span>
              {expanded[exp.id] ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </div>
            {expanded[exp.id] && (
              <div className="collapsible-content">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Job Title</label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) =>
                        onUpdate(exp.id, "title", e.target.value)
                      }
                      placeholder="Senior Developer"
                    />
                  </div>
                  <div className="form-group">
                    <label>Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) =>
                        onUpdate(exp.id, "company", e.target.value)
                      }
                      placeholder="Tech Corp"
                    />
                  </div>
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) =>
                        onUpdate(exp.id, "startDate", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) =>
                        onUpdate(exp.id, "endDate", e.target.value)
                      }
                      disabled={exp.current}
                    />
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    value={exp.description}
                    onChange={(e) =>
                      onUpdate(exp.id, "description", e.target.value)
                    }
                    placeholder="Describe your responsibilities and achievements..."
                    rows={4}
                  />
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onRemove(exp.id)}
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

function EducationSection({ data, onAdd, onUpdate, onRemove }) {
  return (
    <div className="section-content">
      <div className="section-header">
        <h2>Education</h2>
        <button className="btn btn-primary btn-sm" onClick={onAdd}>
          <Plus size={16} />
          Add Education
        </button>
      </div>
      {data.length === 0 ? (
        <p className="empty-text">No education added yet.</p>
      ) : (
        data.map((edu) => (
          <div key={edu.id} className="item-card">
            <div className="form-grid">
              <div className="form-group">
                <label>Degree</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => onUpdate(edu.id, "degree", e.target.value)}
                  placeholder="Bachelor of Science in Computer Science"
                />
              </div>
              <div className="form-group">
                <label>Institution</label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) =>
                    onUpdate(edu.id, "institution", e.target.value)
                  }
                  placeholder="Stanford University"
                />
              </div>
              <div className="form-group">
                <label>Graduation Date</label>
                <input
                  type="month"
                  value={edu.graduationDate}
                  onChange={(e) =>
                    onUpdate(edu.id, "graduationDate", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>GPA</label>
                <input
                  type="text"
                  value={edu.gpa}
                  onChange={(e) => onUpdate(edu.id, "gpa", e.target.value)}
                  placeholder="3.8"
                />
              </div>
            </div>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onRemove(edu.id)}
            >
              <Trash2 size={16} />
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
}

function SkillsSection({ data, onAdd, onRemove }) {
  return (
    <div className="section-content">
      <h2>Skills</h2>
      <div className="skills-container">
        <div className="skill-category">
          <div className="skill-header">
            <h3>Technical Skills</h3>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onAdd("technical")}
            >
              <Plus size={16} />
              Add
            </button>
          </div>
          <div className="skill-tags">
            {data.technical.map((skill, i) => (
              <span key={i} className="skill-tag">
                {skill}
                <button onClick={() => onRemove("technical", i)}>
                  <Trash2 size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="skill-category">
          <div className="skill-header">
            <h3>Soft Skills</h3>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onAdd("soft")}
            >
              <Plus size={16} />
              Add
            </button>
          </div>
          <div className="skill-tags">
            {data.soft.map((skill, i) => (
              <span key={i} className="skill-tag">
                {skill}
                <button onClick={() => onRemove("soft", i)}>
                  <Trash2 size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CertificationsSection({ data, onAdd, onUpdate, onRemove }) {
  return (
    <div className="section-content">
      <div className="section-header">
        <h2>Certifications</h2>
        <button className="btn btn-primary btn-sm" onClick={onAdd}>
          <Plus size={16} />
          Add Certification
        </button>
      </div>
      {data.length === 0 ? (
        <p className="empty-text">No certifications added yet.</p>
      ) : (
        data.map((cert) => (
          <div key={cert.id} className="item-card">
            <div className="form-grid">
              <div className="form-group">
                <label>Certification Name</label>
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => onUpdate(cert.id, "name", e.target.value)}
                  placeholder="AWS Solutions Architect"
                />
              </div>
              <div className="form-group">
                <label>Issuing Organization</label>
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => onUpdate(cert.id, "issuer", e.target.value)}
                  placeholder="Amazon Web Services"
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="month"
                  value={cert.date}
                  onChange={(e) => onUpdate(cert.id, "date", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Credential URL</label>
                <input
                  type="url"
                  value={cert.url}
                  onChange={(e) => onUpdate(cert.id, "url", e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onRemove(cert.id)}
            >
              <Trash2 size={16} />
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
}

function ResumePreview({ data }) {
  return (
    <div className="resume-preview">
      <div className="preview-header">
        <h1>{data.personalInfo.fullName || "Your Name"}</h1>
        <div className="preview-contact">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && (
            <span>{data.personalInfo.location}</span>
          )}
        </div>
        {data.personalInfo.summary && (
          <p className="preview-summary">{data.personalInfo.summary}</p>
        )}
      </div>

      {data.experience.length > 0 && (
        <div className="preview-section">
          <h2>Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="preview-item">
              <div className="preview-item-header">
                <strong>{exp.title}</strong>
                <span>
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <div className="preview-item-sub">{exp.company}</div>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {data.education.length > 0 && (
        <div className="preview-section">
          <h2>Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="preview-item">
              <div className="preview-item-header">
                <strong>{edu.degree}</strong>
                <span>{edu.graduationDate}</span>
              </div>
              <div className="preview-item-sub">{edu.institution}</div>
            </div>
          ))}
        </div>
      )}

      {(data.skills.technical.length > 0 || data.skills.soft.length > 0) && (
        <div className="preview-section">
          <h2>Skills</h2>
          {data.skills.technical.length > 0 && (
            <p>
              <strong>Technical:</strong> {data.skills.technical.join(", ")}
            </p>
          )}
          {data.skills.soft.length > 0 && (
            <p>
              <strong>Soft Skills:</strong> {data.skills.soft.join(", ")}
            </p>
          )}
        </div>
      )}

      {data.certifications.length > 0 && (
        <div className="preview-section">
          <h2>Certifications</h2>
          {data.certifications.map((cert) => (
            <div key={cert.id} className="preview-item">
              <strong>{cert.name}</strong> - {cert.issuer} ({cert.date})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResumeBuilder;
