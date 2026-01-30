"""
Matching Engine Module
Calculate match scores between resumes and job descriptions
"""

import re
from typing import Dict, List, Set, Tuple
from collections import Counter
from ..extractors.skill_extractor import extract_skills, normalize_skill


def calculate_match_score(resume_text: str, job_description: str) -> Dict:
    """
    Calculate comprehensive match score between resume and job description
    
    Args:
        resume_text: Text content of the resume
        job_description: Text of the job description
        
    Returns:
        Dictionary containing match scores and analysis
    """
    # Extract skills from both documents
    resume_skills = extract_skills(resume_text)
    job_skills = extract_skills(job_description)
    
    # Normalize skills for comparison
    resume_tech = set(normalize_skill(s) for s in resume_skills['technical_skills'])
    job_tech = set(normalize_skill(s) for s in job_skills['technical_skills'])
    
    resume_soft = set(normalize_skill(s) for s in resume_skills['soft_skills'])
    job_soft = set(normalize_skill(s) for s in job_skills['soft_skills'])
    
    # Calculate technical skill match
    matched_tech = resume_tech.intersection(job_tech)
    missing_tech = job_tech - resume_tech
    
    # Calculate soft skill match
    matched_soft = resume_soft.intersection(job_soft)
    missing_soft = job_soft - resume_soft
    
    # Calculate scores
    tech_score = calculate_weighted_score(matched_tech, job_tech, weight=0.7)
    soft_score = calculate_weighted_score(matched_soft, job_soft, weight=0.3)
    
    # Experience match score
    experience_score = calculate_experience_match(
        resume_skills['experience_keywords'],
        job_skills['experience_keywords']
    )
    
    # Calculate overall score with weights
    # Technical: 50%, Soft Skills: 20%, Experience: 30%
    skill_match_score = (tech_score * 0.7 + soft_score * 0.3)
    overall_score = (skill_match_score * 0.7 + experience_score * 0.3)
    
    # Format matched and missing skills for response
    all_matched = list(matched_tech.union(matched_soft))
    all_missing = list(missing_tech.union(missing_soft))
    
    # Categorize skills
    skill_categories = {
        "matched_technical": [s.title() for s in matched_tech],
        "missing_technical": [s.title() for s in missing_tech],
        "matched_soft": [s.title() for s in matched_soft],
        "missing_soft": [s.title() for s in missing_soft],
        "resume_technical": list(resume_skills['technical_skills']),
        "resume_soft": list(resume_skills['soft_skills']),
        "job_technical": list(job_skills['technical_skills']),
        "job_soft": list(job_skills['soft_skills'])
    }
    
    return {
        "overall_score": round(overall_score * 100, 1),
        "skill_match_score": round(skill_match_score * 100, 1),
        "experience_match_score": round(experience_score * 100, 1),
        "matched_skills": [s.title() for s in all_matched],
        "missing_skills": [s.title() for s in all_missing],
        "skill_categories": skill_categories
    }


def calculate_weighted_score(matched: Set[str], required: Set[str], weight: float = 1.0) -> float:
    """
    Calculate weighted match score
    
    Args:
        matched: Set of matched skills
        required: Set of required skills
        weight: Weight multiplier
        
    Returns:
        Weighted score between 0 and 1
    """
    if not required:
        return 1.0  # If no skills required, consider it a full match
    
    base_score = len(matched) / len(required)
    return min(base_score * weight * (1 / weight), 1.0)  # Normalize to max 1.0


def calculate_experience_match(resume_exp: List[str], job_exp: List[str]) -> float:
    """
    Calculate experience level match
    
    Args:
        resume_exp: Experience keywords from resume
        job_exp: Experience requirements from job
        
    Returns:
        Match score between 0 and 1
    """
    if not job_exp:
        return 1.0  # No specific experience required
    
    # Extract years if present
    resume_years = extract_years(resume_exp)
    job_years = extract_years(job_exp)
    
    if resume_years is not None and job_years is not None:
        if resume_years >= job_years:
            return 1.0
        else:
            # Partial score based on how close they are
            return max(0, resume_years / job_years)
    
    # Check for level keywords
    level_hierarchy = {
        'intern': 0, 'internship': 0, 'entry level': 1, 'entry-level': 1,
        'junior': 2, 'mid-level': 3, 'senior': 4, 'lead': 5,
        'principal': 6, 'staff': 6, 'architect': 7, 'director': 8
    }
    
    resume_level = get_highest_level(resume_exp, level_hierarchy)
    job_level = get_highest_level(job_exp, level_hierarchy)
    
    if resume_level is not None and job_level is not None:
        if resume_level >= job_level:
            return 1.0
        else:
            return max(0, (resume_level + 1) / (job_level + 1))
    
    # Default to partial match if can't determine
    return 0.7


def extract_years(keywords: List[str]) -> int:
    """Extract years of experience from keywords"""
    for keyword in keywords:
        match = re.search(r'(\d+)\+?\s*years?', keyword.lower())
        if match:
            return int(match.group(1))
    return None


def get_highest_level(keywords: List[str], level_hierarchy: Dict[str, int]) -> int:
    """Get highest experience level from keywords"""
    max_level = None
    for keyword in keywords:
        keyword_lower = keyword.lower()
        for level_name, level_value in level_hierarchy.items():
            if level_name in keyword_lower:
                if max_level is None or level_value > max_level:
                    max_level = level_value
    return max_level


def calculate_text_similarity(text1: str, text2: str) -> float:
    """
    Calculate text similarity using word frequency
    
    Args:
        text1: First text
        text2: Second text
        
    Returns:
        Similarity score between 0 and 1
    """
    # Simple word frequency based similarity
    words1 = set(re.findall(r'\b\w+\b', text1.lower()))
    words2 = set(re.findall(r'\b\w+\b', text2.lower()))
    
    # Remove common stop words
    stop_words = {
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
        'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
        'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need',
        'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it',
        'we', 'they', 'what', 'which', 'who', 'whom', 'whose', 'where',
        'when', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more',
        'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
        'same', 'so', 'than', 'too', 'very', 'just', 'also'
    }
    
    words1 = words1 - stop_words
    words2 = words2 - stop_words
    
    if not words1 or not words2:
        return 0.0
    
    intersection = words1.intersection(words2)
    union = words1.union(words2)
    
    return len(intersection) / len(union)
