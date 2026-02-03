import {
  Github,
  Linkedin,
  Heart,
  Code,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>TalentLens</h3>
            <p>AI-powered resume analysis for the modern job seeker.</p>
            <div className="contact-info">
              <a
                href="mailto:pritampatra.fb@gmail.com"
                className="contact-link"
              >
                <Mail size={14} />
                pritampatra.fb@gmail.com
              </a>
              <a href="tel:+917318632266" className="contact-link">
                <Phone size={14} />
                +91 7318632266
              </a>
              <span className="contact-link">
                <MapPin size={14} />
                India
              </span>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-section">
              <h4>Product</h4>
              <Link to="/features">Features</Link>
              <Link to="/pricing">Pricing</Link>
              <Link to="/faq">FAQ</Link>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <Link to="/about">About</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/contact">Contact</Link>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="made-by">
            <Code size={14} className="code-icon" /> Crafted with{" "}
            <Heart size={14} className="heart" /> by{" "}
            <span className="author-name">Pritam Patra</span> ©{" "}
            {new Date().getFullYear()}
          </p>
          <div className="social-links">
            <a
              href="https://github.com/patrapritam"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="social-link"
            >
              <Github size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/pritam-patra-22a806251/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="social-link"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
