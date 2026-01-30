import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { jobAPI } from "../services/api";
import {
  Plus,
  Briefcase,
  Trash2,
  Edit,
  Search,
  FolderOpen,
  Clock,
  ChevronRight,
  Building,
  X,
} from "lucide-react";
import { SkeletonCard } from "../components/Skeleton";
import "./JobLibrary.css";

function JobLibrary() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    isTemplate: false,
  });
  const { success, error } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await jobAPI.getAll();
      setJobs(data.data?.jobs || []);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingJob) {
        await jobAPI.update(editingJob.id, formData);
        success("Job updated successfully!");
      } else {
        await jobAPI.create(formData);
        success("Job saved successfully!");
      }
      fetchJobs();
      closeModal();
    } catch (err) {
      error("Failed to save job");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await jobAPI.delete(id);
      setJobs(jobs.filter((j) => j._id !== id));
      success("Job deleted");
    } catch (err) {
      error("Failed to delete job");
    }
  };

  const openModal = (job = null) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        title: job.title,
        company: job.company || "",
        description: job.description,
        isTemplate: job.isTemplate || false,
      });
    } else {
      setEditingJob(null);
      setFormData({
        title: "",
        company: "",
        description: "",
        isTemplate: false,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingJob(null);
    setFormData({ title: "", company: "", description: "", isTemplate: false });
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const templates = filteredJobs.filter((j) => j.isTemplate);
  const savedJobs = filteredJobs.filter((j) => !j.isTemplate);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="job-library-page page">
        <div className="container">
          <div className="page-header">
            <h1>Job Library</h1>
          </div>
          <div className="jobs-grid">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="job-library-page page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>
              <FolderOpen size={28} />
              Job Library
            </h1>
            <p>Save job descriptions for quick re-analysis</p>
          </div>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <Plus size={18} />
            Add Job
          </button>
        </div>

        <div className="search-bar glass-card">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Templates Section */}
        {templates.length > 0 && (
          <div className="jobs-section">
            <h2>
              <Briefcase size={20} />
              Job Templates
            </h2>
            <div className="jobs-grid">
              {templates.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onEdit={() => openModal(job)}
                  onDelete={() => handleDelete(job._id)}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </div>
        )}

        {/* Saved Jobs Section */}
        <div className="jobs-section">
          <h2>
            <Building size={20} />
            Saved Jobs
          </h2>
          {savedJobs.length === 0 ? (
            <div className="empty-state glass-card">
              <FolderOpen size={48} />
              <h3>No saved jobs yet</h3>
              <p>
                Save job descriptions to quickly analyze your resumes against
                them
              </p>
              <button className="btn btn-primary" onClick={() => openModal()}>
                <Plus size={18} />
                Add Your First Job
              </button>
            </div>
          ) : (
            <div className="jobs-grid">
              {savedJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onEdit={() => openModal(job)}
                  onDelete={() => handleDelete(job._id)}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal glass-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>{editingJob ? "Edit Job" : "Add Job"}</h2>
              <button className="btn btn-icon" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Job Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Senior Frontend Developer"
                  required
                />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  placeholder="e.g., Google"
                />
              </div>
              <div className="form-group">
                <label>Job Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Paste the full job description here..."
                  rows={8}
                  required
                />
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isTemplate}
                    onChange={(e) =>
                      setFormData({ ...formData, isTemplate: e.target.checked })
                    }
                  />
                  Save as template (reusable for common roles)
                </label>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingJob ? "Update" : "Save"} Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function JobCard({ job, onEdit, onDelete, formatDate }) {
  return (
    <div className="job-card glass-card">
      <div className="job-card-header">
        <h3>{job.title}</h3>
        {job.isTemplate && <span className="template-badge">Template</span>}
      </div>
      {job.company && <p className="job-company">{job.company}</p>}
      <p className="job-description">{job.description?.slice(0, 120)}...</p>
      <div className="job-meta">
        <Clock size={14} />
        <span>{formatDate(job.createdAt)}</span>
      </div>
      <div className="job-actions">
        <Link
          to={`/upload?jobId=${job._id}`}
          className="btn btn-primary btn-sm"
        >
          Analyze
          <ChevronRight size={16} />
        </Link>
        <button className="btn btn-icon" onClick={onEdit}>
          <Edit size={16} />
        </button>
        <button className="btn btn-icon btn-danger" onClick={onDelete}>
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default JobLibrary;
