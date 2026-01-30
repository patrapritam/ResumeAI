"""
Skill Extractor Module
Extract technical skills, soft skills, and other relevant information from text using NLP
"""

import re
from typing import Dict, List, Set


# Comprehensive skill databases
TECHNICAL_SKILLS = {
    # Programming Languages
    'python', 'javascript', 'typescript', 'java', 'c++', 'c#', 'ruby', 'go', 'golang',
    'rust', 'php', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl', 'shell', 'bash',
    'powershell', 'sql', 'nosql', 'html', 'css', 'sass', 'less',
    
    # Frontend Frameworks
    'react', 'reactjs', 'react.js', 'angular', 'angularjs', 'vue', 'vuejs', 'vue.js',
    'svelte', 'next.js', 'nextjs', 'nuxt', 'nuxtjs', 'gatsby', 'ember', 'backbone',
    'jquery', 'bootstrap', 'tailwind', 'tailwindcss', 'material-ui', 'mui', 'chakra',
    
    # Backend Frameworks
    'node.js', 'nodejs', 'express', 'expressjs', 'fastapi', 'flask', 'django',
    'spring', 'spring boot', 'springboot', 'asp.net', '.net', 'rails', 'ruby on rails',
    'laravel', 'symfony', 'gin', 'echo', 'fastify', 'nest.js', 'nestjs', 'koa',
    
    # Databases
    'mongodb', 'mysql', 'postgresql', 'postgres', 'redis', 'elasticsearch', 'cassandra',
    'dynamodb', 'firebase', 'firestore', 'oracle', 'sql server', 'sqlite', 'mariadb',
    'neo4j', 'couchdb', 'memcached', 'supabase',
    
    # Cloud & DevOps
    'aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'heroku', 'vercel',
    'netlify', 'digitalocean', 'docker', 'kubernetes', 'k8s', 'terraform', 'ansible',
    'jenkins', 'ci/cd', 'github actions', 'gitlab ci', 'circleci', 'travis ci',
    'prometheus', 'grafana', 'nginx', 'apache', 'linux', 'unix',
    
    # Data Science & ML
    'machine learning', 'deep learning', 'artificial intelligence', 'ai', 'ml',
    'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'sklearn', 'pandas', 'numpy',
    'scipy', 'matplotlib', 'seaborn', 'plotly', 'jupyter', 'opencv', 'nlp',
    'natural language processing', 'computer vision', 'hugging face', 'transformers',
    'bert', 'gpt', 'llm', 'langchain', 'openai',
    
    # Mobile Development
    'react native', 'flutter', 'ios', 'android', 'swift', 'objective-c', 'xamarin',
    'ionic', 'cordova', 'phonegap', 'expo',
    
    # Testing
    'jest', 'mocha', 'chai', 'jasmine', 'cypress', 'selenium', 'puppeteer',
    'playwright', 'pytest', 'unittest', 'rspec', 'junit', 'testng', 'enzyme',
    'testing library', 'vitest',
    
    # Version Control & Tools
    'git', 'github', 'gitlab', 'bitbucket', 'svn', 'mercurial', 'jira', 'confluence',
    'trello', 'asana', 'slack', 'notion', 'figma', 'sketch', 'adobe xd', 'postman',
    'swagger', 'graphql', 'rest', 'restful', 'api', 'microservices', 'webpack',
    'vite', 'babel', 'eslint', 'prettier',
    
    # Security
    'oauth', 'jwt', 'ssl', 'tls', 'https', 'encryption', 'authentication',
    'authorization', 'cyber security', 'penetration testing', 'owasp',
    
    # Other Technologies
    'blockchain', 'ethereum', 'solidity', 'web3', 'iot', 'raspberry pi', 'arduino',
    'mqtt', 'websocket', 'socket.io', 'rabbitmq', 'kafka', 'celery', 'redis queue'
}

SOFT_SKILLS = {
    # Communication
    'communication', 'written communication', 'verbal communication', 'presentation',
    'public speaking', 'storytelling', 'negotiation', 'persuasion', 'listening',
    
    # Leadership
    'leadership', 'team leadership', 'mentoring', 'coaching', 'delegation',
    'decision making', 'strategic thinking', 'vision', 'motivation',
    
    # Collaboration
    'teamwork', 'collaboration', 'cross-functional', 'stakeholder management',
    'relationship building', 'networking', 'interpersonal skills',
    
    # Problem Solving
    'problem solving', 'critical thinking', 'analytical', 'analytical skills',
    'troubleshooting', 'debugging', 'root cause analysis', 'research',
    
    # Management
    'project management', 'time management', 'resource management', 'risk management',
    'change management', 'conflict resolution', 'performance management',
    'agile', 'scrum', 'kanban', 'waterfall', 'lean',
    
    # Personal Attributes
    'adaptability', 'flexibility', 'creativity', 'innovation', 'initiative',
    'self-motivated', 'detail-oriented', 'attention to detail', 'organization',
    'multitasking', 'work ethic', 'reliability', 'accountability', 'integrity',
    'emotional intelligence', 'empathy', 'patience', 'resilience', 'curiosity'
}

EXPERIENCE_KEYWORDS = {
    'years experience', 'years of experience', 'year experience',
    'senior', 'junior', 'mid-level', 'lead', 'principal', 'staff',
    'architect', 'manager', 'director', 'vp', 'vice president', 'cto', 'ceo',
    'head of', 'team lead', 'tech lead', 'engineering manager',
    'intern', 'internship', 'entry level', 'entry-level', 'experienced'
}

EDUCATION_KEYWORDS = {
    'bachelor', 'bachelors', "bachelor's", 'bs', 'ba', 'bsc', 'btech', 'be',
    'master', 'masters', "master's", 'ms', 'msc', 'ma', 'mba', 'mtech',
    'phd', 'ph.d', 'doctorate', 'doctoral',
    'computer science', 'software engineering', 'information technology',
    'electrical engineering', 'mathematics', 'physics', 'statistics',
    'data science', 'artificial intelligence', 'machine learning',
    'university', 'college', 'institute', 'certification', 'certified',
    'degree', 'diploma', 'coursework', 'bootcamp'
}


def extract_skills(text: str) -> Dict[str, List[str]]:
    """
    Extract skills and relevant information from text
    
    Args:
        text: Resume or job description text
        
    Returns:
        Dictionary containing extracted skills and information
    """
    text_lower = text.lower()
    
    # Extract technical skills
    technical_skills = find_skills_in_text(text_lower, TECHNICAL_SKILLS)
    
    # Extract soft skills
    soft_skills = find_skills_in_text(text_lower, SOFT_SKILLS)
    
    # Extract experience keywords
    experience_keywords = find_skills_in_text(text_lower, EXPERIENCE_KEYWORDS)
    
    # Extract education
    education = find_skills_in_text(text_lower, EDUCATION_KEYWORDS)
    
    # Extract years of experience
    years_pattern = r'(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)?'
    years_matches = re.findall(years_pattern, text_lower)
    if years_matches:
        max_years = max(int(y) for y in years_matches)
        experience_keywords.append(f"{max_years}+ years")
    
    return {
        "technical_skills": sorted(list(set(technical_skills))),
        "soft_skills": sorted(list(set(soft_skills))),
        "experience_keywords": sorted(list(set(experience_keywords))),
        "education": sorted(list(set(education)))
    }


def find_skills_in_text(text: str, skill_set: Set[str]) -> List[str]:
    """
    Find skills from a skill set that appear in the text
    
    Args:
        text: Text to search in (lowercase)
        skill_set: Set of skills to look for
        
    Returns:
        List of found skills
    """
    found_skills = []
    
    for skill in skill_set:
        # Create a pattern that matches the skill as a whole word
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text):
            found_skills.append(skill.title() if len(skill) > 3 else skill.upper())
    
    return found_skills


def normalize_skill(skill: str) -> str:
    """
    Normalize skill name for consistent matching
    
    Args:
        skill: Skill name to normalize
        
    Returns:
        Normalized skill name
    """
    # Common normalizations
    normalizations = {
        'react.js': 'react',
        'reactjs': 'react',
        'vue.js': 'vue',
        'vuejs': 'vue',
        'node.js': 'nodejs',
        'angular.js': 'angular',
        'angularjs': 'angular',
        'next.js': 'nextjs',
        'nest.js': 'nestjs',
        'typescript': 'typescript',
        'javascript': 'javascript',
        'golang': 'go',
        'amazon web services': 'aws',
        'google cloud': 'gcp',
        'postgresql': 'postgres',
        'k8s': 'kubernetes'
    }
    
    skill_lower = skill.lower().strip()
    return normalizations.get(skill_lower, skill_lower)
