"""
AI Resume Analyzer - NLP Microservice
FastAPI application for text extraction, skill matching, and recommendations
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import os
import tempfile

# Import local modules
from app.extractors.text_extractor import extract_text_from_pdf, extract_text_from_docx
from app.extractors.skill_extractor import extract_skills
from app.matchers.matching_engine import calculate_match_score
from app.recommendations.ai_recommender import generate_recommendations

app = FastAPI(
    title="Resume Analyzer NLP Service",
    description="NLP microservice for resume analysis and skill matching",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TextInput(BaseModel):
    text: str


class MatchRequest(BaseModel):
    resume_text: str
    job_description: str


class SkillExtractionResponse(BaseModel):
    technical_skills: List[str]
    soft_skills: List[str]
    experience_keywords: List[str]
    education: List[str]


class MatchResponse(BaseModel):
    overall_score: float
    skill_match_score: float
    experience_match_score: float
    matched_skills: List[str]
    missing_skills: List[str]
    skill_categories: Dict[str, List[str]]


class RecommendationResponse(BaseModel):
    suggestions: List[Dict[str, str]]
    priority_skills: List[str]
    resume_improvements: List[str]
    overall_assessment: str


@app.get("/")
async def root():
    return {"message": "Resume Analyzer NLP Service is running", "status": "healthy"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "nlp-service"}


@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    """Extract text from uploaded PDF or DOCX file"""
    
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    file_extension = file.filename.lower().split('.')[-1]
    
    if file_extension not in ['pdf', 'docx']:
        raise HTTPException(
            status_code=400, 
            detail="Unsupported file format. Please upload PDF or DOCX"
        )
    
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=f'.{file_extension}') as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_path = temp_file.name
        
        # Extract text based on file type
        if file_extension == 'pdf':
            text = extract_text_from_pdf(temp_path)
        else:
            text = extract_text_from_docx(temp_path)
        
        # Clean up temp file
        os.unlink(temp_path)
        
        return {"text": text, "filename": file.filename, "file_type": file_extension}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting text: {str(e)}")


@app.post("/extract-skills", response_model=SkillExtractionResponse)
async def extract_skills_endpoint(input_data: TextInput):
    """Extract skills from text using NLP"""
    
    if not input_data.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    try:
        skills = extract_skills(input_data.text)
        return skills
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting skills: {str(e)}")


@app.post("/match", response_model=MatchResponse)
async def match_resume_to_job(request: MatchRequest):
    """Calculate match score between resume and job description"""
    
    if not request.resume_text.strip() or not request.job_description.strip():
        raise HTTPException(status_code=400, detail="Both resume and job description are required")
    
    try:
        result = calculate_match_score(request.resume_text, request.job_description)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating match: {str(e)}")


@app.post("/recommend", response_model=RecommendationResponse)
async def get_recommendations(request: MatchRequest):
    """Generate AI-powered improvement recommendations"""
    
    if not request.resume_text.strip() or not request.job_description.strip():
        raise HTTPException(status_code=400, detail="Both resume and job description are required")
    
    try:
        recommendations = generate_recommendations(request.resume_text, request.job_description)
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
