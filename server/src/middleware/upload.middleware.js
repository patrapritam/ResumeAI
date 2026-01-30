/**
 * File Upload Middleware
 * Multer configuration for handling file uploads
 * Uses memory storage for serverless compatibility (Vercel)
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Check if running in serverless environment
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

// For local development, use disk storage
const uploadsDir = path.join(__dirname, '../../uploads');

// Only create uploads directory in non-serverless environment
if (!isServerless) {
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
}

// Configure storage based on environment
const storage = isServerless
    ? multer.memoryStorage() // Use memory for serverless
    : multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadsDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname).toLowerCase();
            cb(null, `resume-${uniqueSuffix}${ext}`);
        }
    });

// File filter for PDF and DOCX
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    const allowedExtensions = ['.pdf', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'), false);
    }
};

// Create multer instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max file size
        files: 1 // Only 1 file per request
    }
});

// Error handling middleware
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: true,
                message: 'File too large. Maximum size is 10MB.'
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                error: true,
                message: 'Too many files. Only 1 file allowed per upload.'
            });
        }
        return res.status(400).json({
            error: true,
            message: `Upload error: ${err.message}`
        });
    }
    
    if (err) {
        return res.status(400).json({
            error: true,
            message: err.message || 'File upload failed.'
        });
    }
    
    next();
};

module.exports = {
    upload,
    handleUploadError,
    uploadsDir,
    isServerless
};
