import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/useTheme";
import {
  FileText,
  LayoutDashboard,
  Upload,
  BarChart3,
  LogOut,
  User,
  Menu,
  X,
  Sun,
  Moon,
  FolderOpen,
  FileEdit,
  Shield,
  Sparkles,
  ChevronDown,
  Wrench,
} from "lucide-react";
import "./Header.css";

function Header() {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <div className="logo-icon">
              <FileText size={24} />
            </div>
            <div className="logo-content">
              <span className="logo-text">TalentLens</span>
              <span className="logo-byline">by Pritam Patra</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-desktop">
            {user ? (
              <>
                <Link to="/dashboard" className="nav-link">
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <Link to="/upload" className="nav-link">
                  <Upload size={18} />
                  Analyze
                </Link>
                <Link to="/jobs" className="nav-link">
                  <FolderOpen size={18} />
                  Jobs
                </Link>
                <Link to="/resume-builder" className="nav-link">
                  <FileEdit size={18} />
                  Builder
                </Link>

                {/* Tools Dropdown */}
                <div className="dropdown" ref={toolsRef}>
                  <button
                    className="nav-link dropdown-trigger"
                    onClick={() => setToolsOpen(!toolsOpen)}
                  >
                    <Wrench size={18} />
                    Tools
                    <ChevronDown
                      size={14}
                      className={toolsOpen ? "rotate" : ""}
                    />
                  </button>
                  {toolsOpen && (
                    <div className="dropdown-menu">
                      <Link
                        to="/ats-check"
                        className="dropdown-item"
                        onClick={() => setToolsOpen(false)}
                      >
                        <Shield size={16} />
                        ATS Check
                      </Link>
                      <Link
                        to="/cover-letter"
                        className="dropdown-item"
                        onClick={() => setToolsOpen(false)}
                      >
                        <Sparkles size={16} />
                        Cover Letter
                      </Link>
                    </div>
                  )}
                </div>

                {user.role === "admin" && (
                  <Link to="/admin" className="nav-link">
                    <BarChart3 size={18} />
                    Analytics
                  </Link>
                )}
                <button
                  className="theme-toggle"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <div className="user-menu">
                  <button className="user-button">
                    <User size={18} />
                    <span>{user.name}</span>
                  </button>
                  <button onClick={handleLogout} className="btn btn-secondary">
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="nav-mobile">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <Link
                  to="/upload"
                  className="nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Upload size={18} />
                  Analyze Resume
                </Link>
                <Link
                  to="/jobs"
                  className="nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FolderOpen size={18} />
                  Job Library
                </Link>
                <Link
                  to="/resume-builder"
                  className="nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FileEdit size={18} />
                  Resume Builder
                </Link>

                <div className="mobile-divider"></div>
                <span className="mobile-section-label">Tools</span>

                <Link
                  to="/ats-check"
                  className="nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Shield size={18} />
                  ATS Check
                </Link>
                <Link
                  to="/cover-letter"
                  className="nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Sparkles size={18} />
                  Cover Letter
                </Link>

                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="nav-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <BarChart3 size={18} />
                    Analytics
                  </Link>
                )}

                <div className="mobile-divider"></div>

                <button
                  className="nav-link mobile-theme-btn"
                  onClick={() => {
                    toggleTheme();
                  }}
                >
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="btn btn-secondary mobile-logout-btn"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ textAlign: "center" }}
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
