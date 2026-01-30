/**
 * Analytics Routes
 */

const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/auth.middleware');
const {
    getDashboardStats,
    getTopMissingSkills,
    getAnalysisTrends,
    getScoreDistribution,
    getTopJobTitles,
    getUserGrowth,
    getFullAnalytics
} = require('../controllers/analyticsController');

// All routes require authentication
router.use(authenticate);

// Dashboard stats (available to all authenticated users for their own data)
router.get('/dashboard', getDashboardStats);

// Top missing skills
router.get('/top-skills', getTopMissingSkills);

// Analysis trends over time
router.get('/trends', getAnalysisTrends);

// Score distribution
router.get('/distribution', getScoreDistribution);

// Top job titles
router.get('/top-jobs', getTopJobTitles);

// User growth (admin only)
router.get('/user-growth', isAdmin, getUserGrowth);

// Full analytics data
router.get('/full', getFullAnalytics);

module.exports = router;
