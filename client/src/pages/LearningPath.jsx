import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { resumeAPI } from "../services/api";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  ExternalLink,
  CheckCircle,
  GraduationCap,
  Target,
  TrendingUp,
} from "lucide-react";
import "./LearningPath.css";

// Learning resources database
const LEARNING_RESOURCES = {
  react: [
    {
      name: "React - The Complete Guide",
      platform: "Udemy",
      url: "https://www.udemy.com/course/react-the-complete-guide/",
      hours: 48,
    },
    {
      name: "Full Stack Open",
      platform: "University of Helsinki",
      url: "https://fullstackopen.com/",
      hours: 200,
    },
  ],
  python: [
    {
      name: "Python for Everybody",
      platform: "Coursera",
      url: "https://www.coursera.org/specializations/python",
      hours: 80,
    },
    {
      name: "Automate the Boring Stuff",
      platform: "Free",
      url: "https://automatetheboringstuff.com/",
      hours: 20,
    },
  ],
  javascript: [
    {
      name: "JavaScript: Understanding the Weird Parts",
      platform: "Udemy",
      url: "https://www.udemy.com/course/understand-javascript/",
      hours: 12,
    },
    {
      name: "JavaScript30",
      platform: "Free",
      url: "https://javascript30.com/",
      hours: 30,
    },
  ],
  typescript: [
    {
      name: "TypeScript Deep Dive",
      platform: "Free",
      url: "https://basarat.gitbook.io/typescript/",
      hours: 15,
    },
    {
      name: "TypeScript Course for Beginners",
      platform: "freeCodeCamp",
      url: "https://www.youtube.com/watch?v=BwuLxPH8IDs",
      hours: 5,
    },
  ],
  nodejs: [
    {
      name: "Node.js - The Complete Guide",
      platform: "Udemy",
      url: "https://www.udemy.com/course/nodejs-the-complete-guide/",
      hours: 40,
    },
    {
      name: "Learn Node.js",
      platform: "freeCodeCamp",
      url: "https://www.freecodecamp.org/news/learn-node-js/",
      hours: 10,
    },
  ],
  aws: [
    {
      name: "AWS Certified Solutions Architect",
      platform: "Udemy",
      url: "https://www.udemy.com/course/aws-certified-solutions-architect-associate/",
      hours: 27,
    },
    {
      name: "AWS Training",
      platform: "AWS",
      url: "https://aws.amazon.com/training/",
      hours: 40,
    },
  ],
  docker: [
    {
      name: "Docker Mastery",
      platform: "Udemy",
      url: "https://www.udemy.com/course/docker-mastery/",
      hours: 20,
    },
    {
      name: "Docker Tutorial",
      platform: "freeCodeCamp",
      url: "https://www.youtube.com/watch?v=fqMOX6JJhGo",
      hours: 3,
    },
  ],
  kubernetes: [
    {
      name: "Kubernetes for Developers",
      platform: "Udemy",
      url: "https://www.udemy.com/course/kubernetes-for-developers/",
      hours: 15,
    },
    {
      name: "Kubernetes Basics",
      platform: "Kubernetes.io",
      url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/",
      hours: 5,
    },
  ],
  sql: [
    {
      name: "The Complete SQL Bootcamp",
      platform: "Udemy",
      url: "https://www.udemy.com/course/the-complete-sql-bootcamp/",
      hours: 9,
    },
    {
      name: "SQL Tutorial",
      platform: "W3Schools",
      url: "https://www.w3schools.com/sql/",
      hours: 10,
    },
  ],
  graphql: [
    {
      name: "GraphQL by Example",
      platform: "Udemy",
      url: "https://www.udemy.com/course/graphql-by-example/",
      hours: 10,
    },
    {
      name: "How to GraphQL",
      platform: "Free",
      url: "https://www.howtographql.com/",
      hours: 8,
    },
  ],
  mongodb: [
    {
      name: "MongoDB - The Complete Developer's Guide",
      platform: "Udemy",
      url: "https://www.udemy.com/course/mongodb-the-complete-developers-guide/",
      hours: 17,
    },
    {
      name: "MongoDB University",
      platform: "MongoDB",
      url: "https://university.mongodb.com/",
      hours: 20,
    },
  ],
  git: [
    {
      name: "Git Complete",
      platform: "Udemy",
      url: "https://www.udemy.com/course/git-complete/",
      hours: 6,
    },
    {
      name: "Learn Git Branching",
      platform: "Free",
      url: "https://learngitbranching.js.org/",
      hours: 3,
    },
  ],
};

function LearningPath() {
  const { analysisId } = useParams();
  const navigate = useNavigate();
  const { error } = useToast();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedSkills, setCompletedSkills] = useState([]);

  useEffect(() => {
    loadAnalysis();
    const saved = localStorage.getItem("completedSkills");
    if (saved) setCompletedSkills(JSON.parse(saved));
  }, [analysisId]);

  const loadAnalysis = async () => {
    try {
      const { data } = await resumeAPI.getAnalysis(analysisId);
      setAnalysis(data.data.analysis);
    } catch (err) {
      error("Failed to load analysis");
    } finally {
      setLoading(false);
    }
  };

  const toggleSkillComplete = (skill) => {
    const updated = completedSkills.includes(skill)
      ? completedSkills.filter((s) => s !== skill)
      : [...completedSkills, skill];
    setCompletedSkills(updated);
    localStorage.setItem("completedSkills", JSON.stringify(updated));
  };

  const getResourcesForSkill = (skill) => {
    const normalized = skill.toLowerCase().replace(/[^a-z0-9]/g, "");
    return LEARNING_RESOURCES[normalized] || [];
  };

  const getTotalHours = (skills) => {
    return skills.reduce((total, skill) => {
      const resources = getResourcesForSkill(skill);
      const minHours =
        resources.length > 0 ? Math.min(...resources.map((r) => r.hours)) : 10;
      return total + minHours;
    }, 0);
  };

  if (loading) {
    return (
      <div className="page flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="page">
        <div className="container">
          <div className="error-state glass-card">
            <h2>Analysis not found</h2>
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

  const missingSkills = analysis.missingSkills || [];
  const prioritySkills = missingSkills.slice(0, 5);
  const otherSkills = missingSkills.slice(5);

  return (
    <div className="learning-path-page page">
      <div className="container">
        <div className="page-header">
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            Back
          </button>
          <div>
            <h1>
              <GraduationCap size={28} />
              Learning Path
            </h1>
            <p>Personalized roadmap to fill your skill gaps</p>
          </div>
        </div>

        {/* Stats */}
        <div className="learning-stats">
          <div className="glass-card stat-card">
            <Target size={24} />
            <div className="stat-value">{missingSkills.length}</div>
            <div className="stat-label">Skills to Learn</div>
          </div>
          <div className="glass-card stat-card">
            <Clock size={24} />
            <div className="stat-value">~{getTotalHours(missingSkills)}h</div>
            <div className="stat-label">Estimated Time</div>
          </div>
          <div className="glass-card stat-card">
            <TrendingUp size={24} />
            <div className="stat-value">
              {completedSkills.length}/{missingSkills.length}
            </div>
            <div className="stat-label">Progress</div>
          </div>
        </div>

        {/* Priority Skills */}
        {prioritySkills.length > 0 && (
          <div className="skills-section">
            <h2>
              <span className="priority-badge">Priority</span>
              High-Impact Skills
            </h2>
            <div className="skills-list">
              {prioritySkills.map((skill, index) => (
                <SkillCard
                  key={skill}
                  skill={skill}
                  index={index + 1}
                  resources={getResourcesForSkill(skill)}
                  isCompleted={completedSkills.includes(skill)}
                  onToggle={() => toggleSkillComplete(skill)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Other Skills */}
        {otherSkills.length > 0 && (
          <div className="skills-section">
            <h2>Additional Skills</h2>
            <div className="skills-list">
              {otherSkills.map((skill, index) => (
                <SkillCard
                  key={skill}
                  skill={skill}
                  index={prioritySkills.length + index + 1}
                  resources={getResourcesForSkill(skill)}
                  isCompleted={completedSkills.includes(skill)}
                  onToggle={() => toggleSkillComplete(skill)}
                />
              ))}
            </div>
          </div>
        )}

        {missingSkills.length === 0 && (
          <div className="empty-state glass-card">
            <CheckCircle size={48} />
            <h3>All caught up!</h3>
            <p>You have all the skills required for this job.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SkillCard({ skill, index, resources, isCompleted, onToggle }) {
  return (
    <div className={`skill-card glass-card ${isCompleted ? "completed" : ""}`}>
      <div className="skill-header">
        <div className="skill-number">{index}</div>
        <h3>{skill}</h3>
        <button
          className={`complete-btn ${isCompleted ? "active" : ""}`}
          onClick={onToggle}
        >
          <CheckCircle size={20} />
        </button>
      </div>

      {resources.length > 0 ? (
        <div className="resources-list">
          <h4>
            <BookOpen size={16} />
            Recommended Resources
          </h4>
          {resources.map((resource, i) => (
            <a
              key={i}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="resource-item"
            >
              <div className="resource-info">
                <span className="resource-name">{resource.name}</span>
                <span className="resource-platform">{resource.platform}</span>
              </div>
              <div className="resource-meta">
                <span className="resource-hours">~{resource.hours}h</span>
                <ExternalLink size={14} />
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="no-resources">
          Search online for "{skill}" tutorials and courses.
        </p>
      )}
    </div>
  );
}

export default LearningPath;
