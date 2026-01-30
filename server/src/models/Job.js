/**
 * Job Model
 * Schema for storing job descriptions
 */

const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true
    },
    company: {
        type: String,
        trim: true,
        default: ''
    },
    description: {
        type: String,
        required: [true, 'Job description is required']
    },
    location: {
        type: String,
        trim: true,
        default: ''
    },
    jobType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship', 'remote', 'hybrid', ''],
        default: ''
    },
    salary: {
        min: { type: Number, default: null },
        max: { type: Number, default: null },
        currency: { type: String, default: 'USD' }
    },
    skills: {
        technical: [String],
        soft: [String],
        experience: [String]
    },
    experienceRequired: {
        type: String,
        default: ''
    },
    analysisCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for faster queries
jobSchema.index({ userId: 1, createdAt: -1 });
jobSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Job', jobSchema);
