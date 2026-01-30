/**
 * Authentication Controller
 * Handles user registration, login, and profile management
 */

const User = require('../models/User');
const { generateToken } = require('../middleware/auth.middleware');

/**
 * Register a new user
 */
const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        // Validate input
        if (!email || !password || !name) {
            return res.status(400).json({
                error: true,
                message: 'Email, password, and name are required.'
            });
        }
        
        // Check if user exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                error: true,
                message: 'Email already registered.'
            });
        }
        
        // Create new user
        const user = new User({
            email: email.toLowerCase(),
            password,
            name
        });
        
        await user.save();
        
        // Generate token
        const token = generateToken(user._id);
        
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                user: user.toJSON(),
                token
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle duplicate key error (MongoDB E11000)
        if (error.code === 11000) {
            return res.status(400).json({
                error: true,
                message: 'Email already registered.'
            });
        }
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                error: true,
                message: messages.join(', ')
            });
        }
        
        res.status(500).json({
            error: true,
            message: error.message || 'Registration failed. Please try again.'
        });
    }
};

/**
 * Login user
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                error: true,
                message: 'Email and password are required.'
            });
        }
        
        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                error: true,
                message: 'Invalid email or password.'
            });
        }
        
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                error: true,
                message: 'Invalid email or password.'
            });
        }
        
        // Check if account is active
        if (!user.isActive) {
            return res.status(401).json({
                error: true,
                message: 'Account is deactivated. Please contact support.'
            });
        }
        
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        
        // Generate token
        const token = generateToken(user._id);
        
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: user.toJSON(),
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: true,
            message: 'Login failed. Please try again.'
        });
    }
};

/**
 * Get current user profile
 */
const getProfile = async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                user: req.user.toJSON()
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            error: true,
            message: 'Failed to get profile.'
        });
    }
};

/**
 * Update user profile
 */
const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = req.user;
        
        if (name) user.name = name;
        if (email && email !== user.email) {
            // Check if new email is already taken
            const existingUser = await User.findOne({ email: email.toLowerCase() });
            if (existingUser) {
                return res.status(400).json({
                    error: true,
                    message: 'Email already in use.'
                });
            }
            user.email = email.toLowerCase();
        }
        
        await user.save();
        
        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: user.toJSON()
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            error: true,
            message: 'Failed to update profile.'
        });
    }
};

/**
 * Change password
 */
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = req.user;
        
        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                error: true,
                message: 'Current password and new password are required.'
            });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({
                error: true,
                message: 'New password must be at least 6 characters.'
            });
        }
        
        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                error: true,
                message: 'Current password is incorrect.'
            });
        }
        
        // Update password
        user.password = newPassword;
        await user.save();
        
        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            error: true,
            message: 'Failed to change password.'
        });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword
};
