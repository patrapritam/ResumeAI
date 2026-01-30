/**
 * Resume Routes
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { upload, handleUploadError } = require('../middleware/upload.middleware');
const {
    uploadResume,
    analyzeResume,
    getResumes,
    getResumeById,
    deleteResume,
    getAnalysis,
    getAnalysisHistory
} = require('../controllers/resumeUploadController');

// All routes require authentication
router.use(authenticate);

// Upload resume
router.post('/upload', upload.single('resume'), handleUploadError, uploadResume);

// Analyze resume against job description
router.post('/analyze', analyzeResume);

// Get all resumes for user
router.get('/', getResumes);

// Get analysis history
router.get('/history', getAnalysisHistory);

// Get specific resume
router.get('/:id', getResumeById);

// Delete resume
router.delete('/:id', deleteResume);

// Get specific analysis
router.get('/analysis/:id', getAnalysis);

module.exports = router;
