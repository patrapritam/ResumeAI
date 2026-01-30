/**
 * Resume Model
 * Schema for storing resume data and analysis results
 */

const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
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
    filePath: {
        type: String,
        default: null
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
        matchScore: Number,
        skillMatchScore: Number,
        experienceMatchScore: Number,
        matchedSkills: [String],
        missingSkills: [String],
        recommendations: [{
            skill: String,
            priority: String,
            suggestion: String,
            category: String
        }],
        resumeImprovements: [String],
        overallAssessment: String,
        analyzedAt: {
            type: Date,
            default: Date.now
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for faster queries
resumeSchema.index({ userId: 1, createdAt: -1 });
resumeSchema.index({ 'analyses.matchScore': -1 });

module.exports = mongoose.model('Resume', resumeSchema);
