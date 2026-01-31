import { useLocation, Link } from "react-router-dom";
import {
  Sparkles,
  Zap,
  Shield,
  Target,
  Users,
  Mail,
  Phone,
  MapPin,
  FileText,
  CheckCircle,
  Star,
  Award,
  Briefcase,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";
import "./InfoPage.css";

const pageData = {
  features: {
    title: "Features",
    subtitle: "Powerful tools to accelerate your job search",
    icon: Sparkles,
    sections: [
      {
        icon: Zap,
        title: "AI-Powered Analysis",
        description:
          "Our advanced NLP algorithms analyze your resume against job descriptions to identify matches and gaps.",
      },
      {
        icon: Target,
        title: "ATS Optimization",
        description:
          "Ensure your resume passes Applicant Tracking Systems with our comprehensive ATS compatibility checker.",
      },
      {
        icon: FileText,
        title: "Cover Letter Generator",
        description:
          "Generate personalized, professional cover letters tailored to each job application.",
      },
      {
        icon: Shield,
        title: "Skill Gap Analysis",
        description:
          "Identify missing skills and get recommendations for improvement based on your target roles.",
      },
      {
        icon: Star,
        title: "Resume Builder",
        description:
          "Create beautiful, professional resumes with our easy-to-use drag-and-drop builder.",
      },
      {
        icon: Award,
        title: "Learning Paths",
        description:
          "Get personalized learning recommendations to bridge skill gaps and advance your career.",
      },
    ],
  },
  pricing: {
    title: "Pricing",
    subtitle: "Choose the plan that works for you",
    icon: Zap,
    sections: [
      {
        icon: Star,
        title: "Free Plan",
        description:
          "Basic resume analysis, 3 analyses per month, ATS check, and email support. Perfect for getting started.",
      },
      {
        icon: Zap,
        title: "Pro Plan - $9.99/month",
        description:
          "Unlimited analyses, cover letter generator, skill gap analysis, learning paths, and priority support.",
      },
      {
        icon: Award,
        title: "Enterprise",
        description:
          "Custom solutions for teams and organizations. Contact us for pricing and features tailored to your needs.",
      },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Got questions? We've got answers",
    icon: HelpCircle,
    sections: [
      {
        icon: HelpCircle,
        title: "How does AI resume analysis work?",
        description:
          "Our AI uses natural language processing to extract skills, experience, and qualifications from your resume, then compares them against job descriptions to provide detailed matching insights.",
      },
      {
        icon: HelpCircle,
        title: "What file formats are supported?",
        description:
          "We support PDF and DOCX file formats for resume uploads. We recommend PDF for best results.",
      },
      {
        icon: HelpCircle,
        title: "Is my data secure?",
        description:
          "Absolutely! We use industry-standard encryption and never share your personal information with third parties. Your resumes are stored securely and can be deleted at any time.",
      },
      {
        icon: HelpCircle,
        title: "Can I cancel my subscription?",
        description:
          "Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.",
      },
      {
        icon: HelpCircle,
        title: "How accurate is the ATS check?",
        description:
          "Our ATS checker simulates major Applicant Tracking Systems and provides highly accurate compatibility scores and improvement suggestions.",
      },
    ],
  },
  about: {
    title: "About ResumeAI",
    subtitle: "Empowering job seekers with AI",
    icon: Users,
    sections: [
      {
        icon: Target,
        title: "Our Mission",
        description:
          "To democratize access to professional career tools and help job seekers stand out in a competitive market using the power of artificial intelligence.",
      },
      {
        icon: Sparkles,
        title: "Our Vision",
        description:
          "A world where every job seeker has access to the same high-quality tools and insights that were once only available to those with expensive career coaches.",
      },
      {
        icon: Users,
        title: "The Team",
        description:
          "Built with passion by Pritam Patra, a developer dedicated to creating tools that make a real difference in people's job search journey.",
      },
    ],
  },
  careers: {
    title: "Careers",
    subtitle: "Join our team and make an impact",
    icon: Briefcase,
    sections: [
      {
        icon: Briefcase,
        title: "We're Growing!",
        description:
          "We're always looking for talented individuals who are passionate about AI, career development, and making a difference.",
      },
      {
        icon: Star,
        title: "Current Openings",
        description:
          "Currently, we're a small team and don't have open positions. But feel free to reach out if you'd like to collaborate!",
      },
      {
        icon: Mail,
        title: "Get in Touch",
        description:
          "Interested in joining us? Send your resume and a brief introduction to pritampatra.fb@gmail.com.",
      },
    ],
  },
  contact: {
    title: "Contact Us",
    subtitle: "We'd love to hear from you",
    icon: Mail,
    sections: [
      {
        icon: Mail,
        title: "Email",
        description:
          "pritampatra.fb@gmail.com - We typically respond within 24 hours.",
      },
      {
        icon: Phone,
        title: "Phone",
        description:
          "+91 7318632266 - Available Monday to Friday, 9 AM - 6 PM IST.",
      },
      {
        icon: MapPin,
        title: "Location",
        description:
          "India - We're a remote-first company serving users worldwide.",
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    subtitle: "How we handle your data",
    icon: Shield,
    sections: [
      {
        icon: Shield,
        title: "Data Collection",
        description:
          "We collect only the information necessary to provide our services: your account details, uploaded resumes, and usage data to improve our platform.",
      },
      {
        icon: CheckCircle,
        title: "Data Usage",
        description:
          "Your data is used solely to provide resume analysis and related features. We never sell your personal information to third parties.",
      },
      {
        icon: Shield,
        title: "Data Security",
        description:
          "We use industry-standard encryption (SSL/TLS) and secure cloud infrastructure to protect your data. Access is restricted to authorized personnel only.",
      },
      {
        icon: CheckCircle,
        title: "Your Rights",
        description:
          "You can request to view, export, or delete your data at any time by contacting us at pritampatra.fb@gmail.com.",
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    subtitle: "Please read carefully before using our service",
    icon: FileText,
    sections: [
      {
        icon: CheckCircle,
        title: "Acceptance of Terms",
        description:
          "By accessing ResumeAI, you agree to be bound by these Terms of Service and our Privacy Policy.",
      },
      {
        icon: Shield,
        title: "User Responsibilities",
        description:
          "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.",
      },
      {
        icon: FileText,
        title: "Service Usage",
        description:
          "Our services are provided 'as is' for personal, non-commercial use. You may not use automated systems to access our platform without permission.",
      },
      {
        icon: CheckCircle,
        title: "Intellectual Property",
        description:
          "All content on ResumeAI, including logos, text, and software, is owned by us and protected by copyright laws.",
      },
    ],
  },
};

function InfoPage() {
  const location = useLocation();
  const page = location.pathname.slice(1); // Remove leading slash
  const data = pageData[page] || pageData.about;
  const PageIcon = data.icon;

  return (
    <div className="info-page page">
      <div className="container">
        <Link to="/" className="back-link">
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="info-header">
          <div className="info-icon-wrapper">
            <PageIcon size={32} />
          </div>
          <h1>{data.title}</h1>
          <p>{data.subtitle}</p>
        </div>

        <div className="info-grid">
          {data.sections.map((section, index) => {
            const SectionIcon = section.icon;
            return (
              <div key={index} className="info-card glass-card">
                <div className="info-card-icon">
                  <SectionIcon size={24} />
                </div>
                <h3>{section.title}</h3>
                <p>{section.description}</p>
              </div>
            );
          })}
        </div>

        <div className="info-cta">
          <Link to="/register" className="btn btn-primary btn-lg">
            Get Started Free
          </Link>
          <Link to="/contact" className="btn btn-secondary btn-lg">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

export default InfoPage;
