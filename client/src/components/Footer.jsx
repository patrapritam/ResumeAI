import { Github, Twitter, Linkedin, Heart } from "lucide-react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>ResumeAI</h3>
            <p>AI-powered resume analysis for the modern job seeker.</p>
          </div>

          <div className="footer-links">
            <div className="footer-section">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#careers">Careers</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <a href="#privacy">Privacy</a>
              <a href="#terms">Terms</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            Made with <Heart size={14} className="heart" /> ©{" "}
            {new Date().getFullYear()} ResumeAI
          </p>
          <div className="social-links">
            <a href="#" aria-label="GitHub">
              <Github size={20} />
            </a>
            <a href="#" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="#" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
