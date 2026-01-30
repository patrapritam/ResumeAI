/**
 * Analysis Model
 * Schema for storing analysis history and analytics data
 */

const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    resumeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume',
        required: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    },
    jobTitle: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    matchScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    skillMatchScore: {
        type: Number,
        min: 0,
        max: 100
    },
    experienceMatchScore: {
        type: Number,
        min: 0,
        max: 100
    },
    matchedSkills: [String],
    missingSkills: [String],
    skillCategories: {
        matchedTechnical: [String],
        missingTechnical: [String],
        matchedSoft: [String],
        missingSoft: [String]
    },
    recommendations: [{
        skill: String,
        priority: String,
        suggestion: String,
        category: String
    }],
    resumeImprovements: [String],
    overallAssessment: String,
    metadata: {
        processingTime: Number,
        nlpServiceVersion: String
    }
}, {
    timestamps: true
});

// Indexes for analytics queries
analysisSchema.index({ userId: 1, createdAt: -1 });
analysisSchema.index({ matchScore: -1 });
analysisSchema.index({ createdAt: -1 });
analysisSchema.index({ 'missingSkills': 1 });

// Static method for analytics aggregation
analysisSchema.statics.getTopMissingSkills = async function(limit = 10, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return this.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $unwind: '$missingSkills' },
        { $group: { _id: '$missingSkills', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
        { $project: { skill: '$_id', count: 1, _id: 0 } }
    ]);
};

analysisSchema.statics.getAverageMatchScore = async function(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const result = await this.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: null, avgScore: { $avg: '$matchScore' }, count: { $sum: 1 } } }
    ]);
    
    return result[0] || { avgScore: 0, count: 0 };
};

analysisSchema.statics.getAnalysisTrends = async function(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return this.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                count: { $sum: 1 },
                avgScore: { $avg: '$matchScore' }
            }
        },
        { $sort: { _id: 1 } },
        { $project: { date: '$_id', count: 1, avgScore: { $round: ['$avgScore', 1] }, _id: 0 } }
    ]);
};

module.exports = mongoose.model('Analysis', analysisSchema);
