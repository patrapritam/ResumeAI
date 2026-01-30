"""
AI Recommender Module
Generate personalized improvement suggestions based on resume analysis
"""

from typing import Dict, List
from ..extractors.skill_extractor import extract_skills, normalize_skill
from ..matchers.matching_engine import calculate_match_score


# Skill learning resources and priorities
SKILL_PRIORITIES = {
    # High priority - most in-demand skills
    'python': 10, 'javascript': 10, 'react': 9, 'typescript': 9,
    'aws': 9, 'docker': 9, 'kubernetes': 8, 'sql': 9,
    'node.js': 8, 'nodejs': 8, 'git': 8, 'api': 8,
    'machine learning': 9, 'ai': 9, 'data science': 8,
    
    # Medium priority
    'java': 7, 'go': 7, 'rust': 6, 'azure': 7, 'gcp': 7,
    'mongodb': 7, 'postgres': 7, 'redis': 6, 'graphql': 6,
    'vue': 6, 'angular': 6, 'next.js': 7, 'nextjs': 7,
    
    # Soft skills priority
    'leadership': 8, 'communication': 8, 'problem solving': 8,
    'teamwork': 7, 'project management': 7, 'agile': 7
}

SKILL_LEARNING_TIPS = {
    'python': "Consider taking advanced Python courses on platforms like Coursera or building projects using Django/FastAPI.",
    'javascript': "Strengthen your JavaScript skills through interactive platforms like freeCodeCamp or JavaScript30.",
    'react': "Build portfolio projects with React and learn state management with Redux or Zustand.",
    'typescript': "Start using TypeScript in your existing JavaScript projects to gradually learn the type system.",
    'aws': "Get AWS certified (Cloud Practitioner → Solutions Architect) and practice with free tier services.",
    'docker': "Containerize your personal projects and learn Docker Compose for multi-container applications.",
    'kubernetes': "Start with Minikube for local development and explore managed K8s services like EKS/GKE.",
    'sql': "Practice SQL on LeetCode Database problems and work with real databases in personal projects.",
    'machine learning': "Complete Andrew Ng's ML course on Coursera and build projects with scikit-learn.",
    'node.js': "Build REST APIs with Express.js and learn about async patterns and the event loop.",
    'git': "Learn advanced Git commands and contribute to open-source projects to practice collaboration.",
    'graphql': "Build a GraphQL API using Apollo Server and integrate it with a React frontend.",
    'leadership': "Seek opportunities to lead small projects or mentor junior developers.",
    'communication': "Practice writing technical documentation and presenting at team meetings.",
    'agile': "Get Scrum Master certification and actively participate in sprint ceremonies."
}


def generate_recommendations(resume_text: str, job_description: str) -> Dict:
    """
    Generate personalized improvement recommendations
    
    Args:
        resume_text: Text content of the resume
        job_description: Text of the job description
        
    Returns:
        Dictionary containing recommendations and suggestions
    """
    # Get match analysis
    match_result = calculate_match_score(resume_text, job_description)
    
    # Extract skills for detailed analysis
    resume_skills = extract_skills(resume_text)
    job_skills = extract_skills(job_description)
    
    # Get missing skills
    missing_skills = match_result['missing_skills']
    
    # Prioritize missing skills
    priority_skills = prioritize_skills(missing_skills)
    
    # Generate specific suggestions
    suggestions = generate_skill_suggestions(priority_skills, match_result)
    
    # Generate resume improvement tips
    resume_improvements = generate_resume_tips(resume_skills, job_skills, match_result)
    
    # Overall assessment
    overall_assessment = generate_assessment(match_result)
    
    return {
        "suggestions": suggestions,
        "priority_skills": priority_skills[:5],  # Top 5 priority skills
        "resume_improvements": resume_improvements,
        "overall_assessment": overall_assessment
    }


def prioritize_skills(missing_skills: List[str]) -> List[str]:
    """
    Prioritize missing skills by industry demand
    
    Args:
        missing_skills: List of missing skills
        
    Returns:
        Sorted list of skills by priority
    """
    def get_priority(skill: str) -> int:
        normalized = normalize_skill(skill)
        return SKILL_PRIORITIES.get(normalized, 5)  # Default priority of 5
    
    return sorted(missing_skills, key=get_priority, reverse=True)


def generate_skill_suggestions(priority_skills: List[str], match_result: Dict) -> List[Dict[str, str]]:
    """
    Generate specific suggestions for skill improvement
    
    Args:
        priority_skills: Prioritized list of missing skills
        match_result: Match analysis result
        
    Returns:
        List of suggestion dictionaries
    """
    suggestions = []
    
    for skill in priority_skills[:5]:  # Top 5 skills
        normalized = normalize_skill(skill)
        
        # Get specific tip or generate generic one
        tip = SKILL_LEARNING_TIPS.get(
            normalized,
            f"Consider learning {skill} through online courses, tutorials, or hands-on projects."
        )
        
        priority = "High" if SKILL_PRIORITIES.get(normalized, 5) >= 8 else "Medium"
        
        suggestions.append({
            "skill": skill,
            "priority": priority,
            "suggestion": tip,
            "category": "technical" if is_technical_skill(skill) else "soft"
        })
    
    return suggestions


def is_technical_skill(skill: str) -> bool:
    """Check if a skill is technical or soft skill"""
    soft_keywords = {
        'leadership', 'communication', 'teamwork', 'management',
        'problem solving', 'analytical', 'creativity', 'adaptability'
    }
    return not any(keyword in skill.lower() for keyword in soft_keywords)


def generate_resume_tips(resume_skills: Dict, job_skills: Dict, match_result: Dict) -> List[str]:
    """
    Generate resume-specific improvement tips
    
    Args:
        resume_skills: Extracted resume skills
        job_skills: Required job skills
        match_result: Match analysis result
        
    Returns:
        List of resume improvement tips
    """
    tips = []
    
    overall_score = match_result['overall_score']
    
    # Score-based tips
    if overall_score < 50:
        tips.append("🎯 Focus on acquiring the core technical skills required for this role before applying.")
        tips.append("📝 Consider tailoring your resume to highlight transferable skills from your experience.")
    elif overall_score < 70:
        tips.append("✨ You have a good foundation! Focus on the top 3 missing skills to significantly improve your match.")
        tips.append("📊 Quantify your achievements with metrics (e.g., 'Improved performance by 40%').")
    else:
        tips.append("🌟 Excellent match! Focus on showcasing your expertise in matched skills with specific examples.")
        tips.append("💡 Highlight any unique experiences that set you apart from other candidates.")
    
    # Skill gap tips
    missing_tech = match_result.get('skill_categories', {}).get('missing_technical', [])
    if len(missing_tech) > 5:
        tips.append("🔧 Consider adding a 'Skills' section that clearly lists your technical competencies.")
    
    # Experience tips
    if match_result['experience_match_score'] < 70:
        tips.append("📈 Emphasize relevant projects and achievements that demonstrate the required experience level.")
    
    # Soft skills tips
    missing_soft = match_result.get('skill_categories', {}).get('missing_soft', [])
    if missing_soft:
        tips.append("🤝 Include examples of soft skills like leadership and communication in your work experience bullet points.")
    
    # Format tips
    tips.append("📋 Use action verbs (Led, Developed, Implemented) to describe your accomplishments.")
    tips.append("🎨 Ensure your resume is ATS-friendly with clear section headers and standard formatting.")
    
    return tips[:6]  # Return top 6 tips


def generate_assessment(match_result: Dict) -> str:
    """
    Generate overall assessment summary
    
    Args:
        match_result: Match analysis result
        
    Returns:
        Assessment string
    """
    score = match_result['overall_score']
    matched_count = len(match_result['matched_skills'])
    missing_count = len(match_result['missing_skills'])
    
    if score >= 85:
        assessment = f"🌟 Excellent Match ({score}%)! Your profile strongly aligns with this position. " \
                    f"You have {matched_count} matching skills. Focus on highlighting your expertise " \
                    f"and preparing for behavioral interviews."
    elif score >= 70:
        assessment = f"✨ Strong Match ({score}%)! You're a competitive candidate with {matched_count} matching skills. " \
                    f"Acquiring {min(3, missing_count)} key missing skills would make you an ideal candidate."
    elif score >= 50:
        assessment = f"👍 Moderate Match ({score}%)! You have foundational skills for this role. " \
                    f"Focus on bridging the gap in {missing_count} areas to strengthen your application."
    else:
        assessment = f"📚 Development Needed ({score}%)! While you have {matched_count} relevant skills, " \
                    f"this role requires significant skill development. Consider this as a growth target " \
                    f"and focus on building the core technical skills first."
    
    return assessment
