/**
 * Resume Model V2
 * Identical to Resume.js but forced refresh to bypass caching issues
 */

const mongoose = require('mongoose');

// Define schema directly - NO REQUIRED filePath
const resumeSchemaV2 = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    filename: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        enum: ['pdf', 'docx'],
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    // COMPLETELY OPTIONAL
    filePath: {
        type: String,
        default: "memory_storage" 
    },
    extractedText: {
        type: String,
        default: ''
    },
    skills: {
        technical: [String],
        soft: [String],
        experience: [String],
        education: [String]
    },
    analyses: [{
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job'
        },
        jobTitle: String,
        matchScore: Number
   }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: 'resumes' // Force it to use the same collection name
});

module.exports = mongoose.model('ResumeV2', resumeSchemaV2);
