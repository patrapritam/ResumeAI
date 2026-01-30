/**
 * Authentication Routes
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword
} = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/password', authenticate, changePassword);

module.exports = router;
