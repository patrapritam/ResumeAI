/**
 * Resume Controller
 * Handles resume upload, text extraction, and analysis
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const Resume = require('../models/Resume');
const Job = require('../models/Job');
const Analysis = require('../models/Analysis');
const User = require('../models/User');
const { isServerless } = require('../middleware/upload.middleware');

const NLP_SERVICE_URL = process.env.NLP_SERVICE_URL || 'http://localhost:8000';

/**
 * Upload resume and extract text
 */
const uploadResume = async (req, res) => {
    try {
        console.log('Upload request received, isServerless:', isServerless);
        console.log('NLP_SERVICE_URL:', NLP_SERVICE_URL);
        
        if (!req.file) {
            console.log('No file in request');
            return res.status(400).json({
                error: true,
                message: 'No file uploaded.'
            });
        }
        
        const file = req.file;
        console.log('File received:', {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            hasBuffer: !!file.buffer,
            hasPath: !!file.path
        });
        
        const fileExt = path.extname(file.originalname).toLowerCase().replace('.', '');
        
        // Extract text using NLP service (optional - won't fail the upload)
        let extractedText = '';
        let skills = { technical: [], soft: [], experience: [], education: [] };
        let nlpSuccess = false;
        
        try {
            // Create FormData to send to NLP service
            const formData = new FormData();
            
            // Handle both memory storage (serverless) and disk storage (local)
            if (file.buffer) {
                // Memory storage (Vercel serverless)
                console.log('Using memory storage - buffer size:', file.buffer.length);
                formData.append('file', file.buffer, {
                    filename: file.originalname,
                    contentType: file.mimetype
                });
            } else if (file.path) {
                // Disk storage (local development)
                console.log('Using disk storage - path:', file.path);
                formData.append('file', fs.createReadStream(file.path), {
                    filename: file.originalname,
                    contentType: file.mimetype
                });
            }
            
            console.log('Sending file to NLP service...');
            const extractResponse = await axios.post(
                `${NLP_SERVICE_URL}/extract-text`,
                formData,
                { 
                    headers: formData.getHeaders(),
                    timeout: 45000, // 45 second timeout
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity
                }
            );
            console.log('NLP extract-text response received');
            extractedText = extractResponse.data.text || '';
            
            if (extractedText) {
                // Extract skills only if we got text
                console.log('Extracting skills...');
                const skillsResponse = await axios.post(
                    `${NLP_SERVICE_URL}/extract-skills`,
                    { text: extractedText },
                    { timeout: 30000 }
                );
                skills = {
                    technical: skillsResponse.data.technical_skills || [],
                    soft: skillsResponse.data.soft_skills || [],
                    experience: skillsResponse.data.experience_keywords || [],
                    education: skillsResponse.data.education || []
                };
                nlpSuccess = true;
                console.log('Skills extracted successfully');
            }
        } catch (nlpError) {
            console.error('NLP service error:', nlpError.message);
            if (nlpError.response) {
                console.error('NLP response status:', nlpError.response.status);
                console.error('NLP response data:', nlpError.response.data);
            }
            // Continue without NLP - this is not a fatal error
        }
        
        // For serverless, we don't store the file path (there's no persistent disk)
        const filePath = isServerless ? null : file.path;
        const filename = isServerless ? `resume-${Date.now()}` : file.filename;
        
        console.log('Saving resume to database...');
        
        // Save resume to database
        const resume = new Resume({
            userId: req.userId,
            filename: filename,
            originalName: file.originalname,
            fileType: fileExt,
            fileSize: file.size,
            filePath: filePath,
            extractedText,
            skills
        });
        
        await resume.save();
        console.log('Resume saved with ID:', resume._id);
        
        // Update user's resume count
        await User.findByIdAndUpdate(req.userId, { $inc: { resumeCount: 1 } });
        
        res.status(201).json({
            success: true,
            message: nlpSuccess ? 'Resume uploaded and analyzed successfully' : 'Resume uploaded successfully (analysis pending)',
            data: {
                resume: {
                    id: resume._id,
                    filename: resume.originalName,
                    fileType: resume.fileType,
                    fileSize: resume.fileSize,
                    skills: resume.skills,
                    hasText: !!extractedText,
                    createdAt: resume.createdAt
                }
            }
        });
    } catch (error) {
        console.error('Upload resume error:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            error: true,
            message: error.message || 'Failed to upload resume.'
        });
    }
};

/**
 * Analyze resume against job description
 */
const analyzeResume = async (req, res) => {
    try {
        const { resumeId, jobDescription, jobTitle, jobId } = req.body;
        
        if (!resumeId || !jobDescription) {
            return res.status(400).json({
                error: true,
                message: 'Resume ID and job description are required.'
            });
        }
        
        // Get resume
        const resume = await Resume.findOne({ _id: resumeId, userId: req.userId });
        if (!resume) {
            return res.status(404).json({
                error: true,
                message: 'Resume not found.'
            });
        }
        
        if (!resume.extractedText) {
            return res.status(400).json({
                error: true,
                message: 'Resume has no extracted text. Please re-upload.'
            });
        }
        
        // Call NLP service for matching
        const matchResponse = await axios.post(`${NLP_SERVICE_URL}/match`, {
            resume_text: resume.extractedText,
            job_description: jobDescription
        });
        
        // Call NLP service for recommendations
        const recommendResponse = await axios.post(`${NLP_SERVICE_URL}/recommend`, {
            resume_text: resume.extractedText,
            job_description: jobDescription
        });
        
        const matchData = matchResponse.data;
        const recommendData = recommendResponse.data;
        
        // Save or update job if provided
        let savedJobId = jobId;
        if (jobTitle) {
            const job = new Job({
                userId: req.userId,
                title: jobTitle,
                description: jobDescription,
                skills: {
                    technical: matchData.skill_categories?.job_technical || [],
                    soft: matchData.skill_categories?.job_soft || []
                }
            });
            await job.save();
            savedJobId = job._id;
            
            // Increment analysis count
            await Job.findByIdAndUpdate(savedJobId, { $inc: { analysisCount: 1 } });
        }
        
        // Create analysis record
        const analysis = new Analysis({
            userId: req.userId,
            resumeId: resume._id,
            jobId: savedJobId,
            jobTitle: jobTitle || 'Untitled Position',
            jobDescription,
            matchScore: matchData.overall_score,
            skillMatchScore: matchData.skill_match_score,
            experienceMatchScore: matchData.experience_match_score,
            matchedSkills: matchData.matched_skills,
            missingSkills: matchData.missing_skills,
            skillCategories: {
                matchedTechnical: matchData.skill_categories?.matched_technical || [],
                missingTechnical: matchData.skill_categories?.missing_technical || [],
                matchedSoft: matchData.skill_categories?.matched_soft || [],
                missingSoft: matchData.skill_categories?.missing_soft || []
            },
            recommendations: recommendData.suggestions,
            resumeImprovements: recommendData.resume_improvements,
            overallAssessment: recommendData.overall_assessment
        });
        
        await analysis.save();
        
        // Add analysis to resume
        resume.analyses.push({
            jobId: savedJobId,
            jobTitle: jobTitle || 'Untitled Position',
            matchScore: matchData.overall_score,
            skillMatchScore: matchData.skill_match_score,
            experienceMatchScore: matchData.experience_match_score,
            matchedSkills: matchData.matched_skills,
            missingSkills: matchData.missing_skills,
            recommendations: recommendData.suggestions,
            resumeImprovements: recommendData.resume_improvements,
            overallAssessment: recommendData.overall_assessment
        });
        
        await resume.save();
        
        res.json({
            success: true,
            message: 'Analysis complete',
            data: {
                analysisId: analysis._id,
                matchScore: matchData.overall_score,
                skillMatchScore: matchData.skill_match_score,
                experienceMatchScore: matchData.experience_match_score,
                matchedSkills: matchData.matched_skills,
                missingSkills: matchData.missing_skills,
                skillCategories: matchData.skill_categories,
                recommendations: recommendData.suggestions,
                prioritySkills: recommendData.priority_skills,
                resumeImprovements: recommendData.resume_improvements,
                overallAssessment: recommendData.overall_assessment
            }
        });
    } catch (error) {
        console.error('Analyze resume error:', error);
        res.status(500).json({
            error: true,
            message: 'Failed to analyze resume. Please ensure the NLP service is running.'
        });
    }
};

/**
 * Get user's resumes
 */
const getResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.userId, isActive: true })
            .select('-extractedText -filePath')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: {
                resumes: resumes.map(r => ({
                    id: r._id,
                    filename: r.originalName,
                    fileType: r.fileType,
                    fileSize: r.fileSize,
                    skills: r.skills,
                    analysisCount: r.analyses?.length || 0,
                    lastAnalysis: r.analyses?.length > 0 ? r.analyses[r.analyses.length - 1] : null,
                    createdAt: r.createdAt
                }))
            }
        });
    } catch (error) {
        console.error('Get resumes error:', error);
        res.status(500).json({
            error: true,
            message: 'Failed to get resumes.'
        });
    }
};

/**
 * Get resume by ID with analysis history
 */
const getResumeById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const resume = await Resume.findOne({ _id: id, userId: req.userId })
            .select('-filePath');
        
        if (!resume) {
            return res.status(404).json({
                error: true,
                message: 'Resume not found.'
            });
        }
        
        res.json({
            success: true,
            data: {
                resume: {
                    id: resume._id,
                    filename: resume.originalName,
                    fileType: resume.fileType,
                    fileSize: resume.fileSize,
                    skills: resume.skills,
                    analyses: resume.analyses,
                    createdAt: resume.createdAt,
                    updatedAt: resume.updatedAt
                }
            }
        });
    } catch (error) {
        console.error('Get resume error:', error);
        res.status(500).json({
            error: true,
            message: 'Failed to get resume.'
        });
    }
};

/**
 * Delete resume
 */
const deleteResume = async (req, res) => {
    try {
        const { id } = req.params;
        
        const resume = await Resume.findOne({ _id: id, userId: req.userId });
        
        if (!resume) {
            return res.status(404).json({
                error: true,
                message: 'Resume not found.'
            });
        }
        
        // Delete file from disk
        if (resume.filePath && fs.existsSync(resume.filePath)) {
            fs.unlinkSync(resume.filePath);
        }
        
        // Mark as inactive instead of deleting
        resume.isActive = false;
        await resume.save();
        
        res.json({
            success: true,
            message: 'Resume deleted successfully.'
        });
    } catch (error) {
        console.error('Delete resume error:', error);
        res.status(500).json({
            error: true,
            message: 'Failed to delete resume.'
        });
    }
};

/**
 * Get analysis by ID
 */
const getAnalysis = async (req, res) => {
    try {
        const { id } = req.params;
        
        const analysis = await Analysis.findOne({ _id: id, userId: req.userId });
        
        if (!analysis) {
            return res.status(404).json({
                error: true,
                message: 'Analysis not found.'
            });
        }
        
        res.json({
            success: true,
            data: { analysis }
        });
    } catch (error) {
        console.error('Get analysis error:', error);
        res.status(500).json({
            error: true,
            message: 'Failed to get analysis.'
        });
    }
};

/**
 * Get user's analysis history
 */
const getAnalysisHistory = async (req, res) => {
    try {
        const { limit = 10, offset = 0 } = req.query;
        
        const analyses = await Analysis.find({ userId: req.userId })
            .select('jobTitle matchScore createdAt resumeId')
            .sort({ createdAt: -1 })
            .skip(parseInt(offset))
            .limit(parseInt(limit));
        
        const total = await Analysis.countDocuments({ userId: req.userId });
        
        res.json({
            success: true,
            data: {
                analyses,
                pagination: {
                    total,
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    hasMore: parseInt(offset) + analyses.length < total
                }
            }
        });
    } catch (error) {
        console.error('Get analysis history error:', error);
        res.status(500).json({
            error: true,
            message: 'Failed to get analysis history.'
        });
    }
};

module.exports = {
    uploadResume,
    analyzeResume,
    getResumes,
    getResumeById,
    deleteResume,
    getAnalysis,
    getAnalysisHistory
};
