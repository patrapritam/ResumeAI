import { useState } from "react";
import { Plus, Upload, FileText, Sparkles, X } from "lucide-react";
import { Link } from "react-router-dom";
import "./FAB.css";

function FAB() {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: Upload, label: "Upload Resume", to: "/upload" },
    { icon: FileText, label: "Resume Builder", to: "/resume-builder" },
    { icon: Sparkles, label: "Cover Letter", to: "/cover-letter" },
  ];

  return (
    <div className={`fab-container ${isOpen ? "open" : ""}`}>
      <div className="fab-actions">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.to}
            className="fab-action"
            style={{ transitionDelay: `${index * 50}ms` }}
            onClick={() => setIsOpen(false)}
          >
            <span className="fab-action-label">{action.label}</span>
            <div className="fab-action-icon">
              <action.icon size={20} />
            </div>
          </Link>
        ))}
      </div>
      <button
        className="fab-main"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Quick actions"
      >
        {isOpen ? <X size={24} /> : <Plus size={24} />}
      </button>
    </div>
  );
}

export default FAB;
