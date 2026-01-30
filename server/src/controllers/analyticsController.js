/**
 * Analytics Controller
 * Handles admin analytics and reporting
 */

const Analysis = require('../models/Analysis');
const Resume = require('../models/ResumeV2');
const User = require('../models/User');
const Job = require('../models/Job');

/**
 * Get dashboard overview stats
 */
const getDashboardStats = async (req, res) => {
    try {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        
        // Get counts
        const [totalUsers, totalResumes, totalAnalyses, avgScoreData] = await Promise.all([
            User.countDocuments(),
            Resume.countDocuments({ isActive: true }),
            Analysis.countDocuments(),
            Analysis.getAverageMatchScore(30)
        ]);
        
        res.json({
            success: true,
            data: {
                totalUsers,
                totalResumes,
                totalAnalyses,
                averageMatchScore: Math.round(avgScoreData.avgScore * 10) / 10 || 0,
                analysesLast30Days: avgScoreData.count || 0
            }
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            error: true,
            message: 'Failed to get dashboard stats.'
        });
    }
};

/**
 * Get top missing skills across all analyses
 */
const getTopMissingSkills = async (req, res) => {
    try {
        const { limit = 10, days = 30 } = req.query;
        
        const topSkills = await Analysis.getTopMissingSkills(
            parseInt(limit),
            parseInt(days)
        );
        
        res.json({
            success: true,
            data: {
                topMissingSkills: topSkills,
                period: `Last ${days} days`
            }
        });
    } catch (error) {
        console.error('Get top missing skills error:', error);
        res.status(500).json({
            error: true,
            message: 'Failed to get top missing skills.'
        });
    }
};

/**
 * Get analysis trends over time
 */
const getAnalysisTrends = async (req, res) => {
    try {
        const { days = 30 } = req.query;
        
        const trends = await Analysis.getAnalysisTrends(parseInt(days));
        
        res.json({
            success: true,
            data: {
                trends,
                period: `Last ${days} days`
            }
        });
    } catch (error) {
        console.error('Get analysis trends error:', error);
        res.status(500).json({
            error: true,
            message: 'Failed to get analysis trends.'
        });
    }
};

/**
 * Get match score distribution
 */
const getScoreDistribution = async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));
        
        const distribution = await Analysis.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $bucket: {
                    groupBy: '$matchScore',
                    boundaries: [0, 25, 50, 75, 90, 101],
                    default: 'Other',
                    output: {
                        count: { $sum: 1 }
                    }
                }
            }
        ]);
        
        // Format the distribution
        const labels = ['0-24%', '25-49%', '50-74%', '75-89%', '90-100%'];
        const formattedDistribution = labels.map((label, index) => {
            const boundary = [0, 25, 50, 75, 90][index];
            const bucket = distribution.find(d => d._id === boundary);
            return {
                range: label,
                count: bucket ? bucket.count : 0
            };
        });
        
        res.json({
            success: true,
            data: {
                distribution: formattedDistribution,
                period: `Last ${days} days`
            }
        });
    } catch (error) {
        console.error('Get score distribution error:', error);
        res.status(500).json({
            error: true,
            message: 'Failed to get score distribution.'
        });
    }
};

/**
 * Get most analyzed job titles
 */
const getTopJobTitles = async (req, res) => {
    try {
        const { limit = 10, days = 30 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));
        
        const topJobs = await Analysis.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: '$jobTitle',
                    count: { $sum: 1 },
                    avgScore: { $avg: '$matchScore' }
                }
            },
            { $sort: { count: -1 } },
            { $limit: parseInt(limit) },
            {
                $project: {
                    title: '$_id',
                    count: 1,
                    avgScore: { $round: ['$avgScore', 1] },
                    _id: 0
                }
            }
        ]);
        
        res.json({
            success: true,
            data: {
                topJobTitles: topJobs,
                period: `Last ${days} days`
            }
        });
    } catch (error) {
        console.error('Get top job titles error:', error);
        res.status(500).json({
            error: true,
            message: 'Failed to get top job titles.'
        });
    }
};

/**
 * Get user growth trends
 */
const getUserGrowth = async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));
        
        const userGrowth = await User.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            { $project: { date: '$_id', count: 1, _id: 0 } }
        ]);
        
        res.json({
            success: true,
            data: {
                userGrowth,
                period: `Last ${days} days`
            }
        });
    } catch (error) {
        console.error('Get user growth error:', error);
        res.status(500).json({
            error: true,
            message: 'Failed to get user growth.'
        });
    }
};

/**
 * Get all analytics data for admin dashboard
 */
const getFullAnalytics = async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const daysNum = parseInt(days);
        
        const [
            stats,
            topMissingSkills,
            trends,
            topJobTitles
        ] = await Promise.all([
            getDashboardStatsData(),
            Analysis.getTopMissingSkills(10, daysNum),
            Analysis.getAnalysisTrends(daysNum),
            getTopJobTitlesData(10, daysNum)
        ]);
        
        res.json({
            success: true,
            data: {
                stats,
                topMissingSkills,
                trends,
                topJobTitles,
                period: `Last ${days} days`
            }
        });
    } catch (error) {
        console.error('Get full analytics error:', error);
        res.status(500).json({
            error: true,
            message: 'Failed to get analytics.'
        });
    }
};

// Helper functions
async function getDashboardStatsData() {
    const [totalUsers, totalResumes, totalAnalyses, avgScoreData] = await Promise.all([
        User.countDocuments(),
        Resume.countDocuments({ isActive: true }),
        Analysis.countDocuments(),
        Analysis.getAverageMatchScore(30)
    ]);
    
    return {
        totalUsers,
        totalResumes,
        totalAnalyses,
        averageMatchScore: Math.round(avgScoreData.avgScore * 10) / 10 || 0
    };
}

async function getTopJobTitlesData(limit, days) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return Analysis.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
            $group: {
                _id: '$jobTitle',
                count: { $sum: 1 },
                avgScore: { $avg: '$matchScore' }
            }
        },
        { $sort: { count: -1 } },
        { $limit: limit },
        {
            $project: {
                title: '$_id',
                count: 1,
                avgScore: { $round: ['$avgScore', 1] },
                _id: 0
            }
        }
    ]);
}

module.exports = {
    getDashboardStats,
    getTopMissingSkills,
    getAnalysisTrends,
    getScoreDistribution,
    getTopJobTitles,
    getUserGrowth,
    getFullAnalytics
};
