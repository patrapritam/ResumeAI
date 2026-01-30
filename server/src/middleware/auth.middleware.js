/**
 * Authentication Middleware
 * JWT verification and user authentication
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

/**
 * Verify JWT token and attach user to request
 */
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: true,
                message: 'Access denied. No token provided.'
            });
        }
        
        const token = authHeader.split(' ')[1];
        
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Find user
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({
                error: true,
                message: 'User not found. Token may be invalid.'
            });
        }
        
        if (!user.isActive) {
            return res.status(401).json({
                error: true,
                message: 'User account is deactivated.'
            });
        }
        
        // Attach user to request
        req.user = user;
        req.userId = user._id;
        
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: true,
                message: 'Invalid token.'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: true,
                message: 'Token expired. Please login again.'
            });
        }
        
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            error: true,
            message: 'Authentication error.'
        });
    }
};

/**
 * Check if user is admin
 */
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            error: true,
            message: 'Access denied. Admin privileges required.'
        });
    }
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (user && user.isActive) {
            req.user = user;
            req.userId = user._id;
        }
        
        next();
    } catch (error) {
        // Silently continue without auth
        next();
    }
};

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

module.exports = {
    authenticate,
    isAdmin,
    optionalAuth,
    generateToken,
    JWT_SECRET
};
