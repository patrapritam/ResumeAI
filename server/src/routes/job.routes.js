/**
 * Job Routes
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const Job = require('../models/Job');

// All routes require authentication
router.use(authenticate);

// Create new job
router.post('/', async (req, res) => {
    try {
        const { title, company, description, location, jobType, salary, experienceRequired } = req.body;
        
        if (!title || !description) {
            return res.status(400).json({
                error: true,
                message: 'Job title and description are required.'
            });
        }
        
        const job = new Job({
            userId: req.userId,
            title,
            company,
            description,
            location,
            jobType,
            salary,
            experienceRequired
        });
        
        await job.save();
        
        res.status(201).json({
            success: true,
            message: 'Job saved successfully',
            data: { job }
        });
    } catch (error) {
        console.error('Create job error:', error);
        res.status(500).json({
            error: true,
            message: 'Failed to save job.'
        });
    }
});

// Get all jobs for user
router.get('/', async (req, res) => {
    try {
        const { limit = 20, offset = 0 } = req.query;
        
        const jobs = await Job.find({ userId: req.userId, isActive: true })
            .select('-description')
            .sort({ createdAt: -1 })
            .skip(parseInt(offset))
            .limit(parseInt(limit));
        
        const total = await Job.countDocuments({ userId: req.userId, isActive: true });
        
        res.json({
            success: true,
            data: {
                jobs,
                pagination: {
                    total,
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    hasMore: parseInt(offset) + jobs.length < total
                }
            }
        });
    } catch (error) {
        console.error('Get jobs error:', error);
        res.status(500).json({
            error: true,
            message: 'Failed to get jobs.'
        });
    }
});

// Get job by ID
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.id, userId: req.userId });
        
        if (!job) {
            return res.status(404).json({
                error: true,
                message: 'Job not found.'
            });
        }
        
        res.json({
            success: true,
            data: { job }
        });
    } catch (error) {
        console.error('Get job error:', error);
        res.status(500).json({
            error: true,
            message: 'Failed to get job.'
        });
    }
});

// Update job
router.put('/:id', async (req, res) => {
    try {
        const { title, company, description, location, jobType, salary, experienceRequired } = req.body;
        
        const job = await Job.findOne({ _id: req.params.id, userId: req.userId });
        
        if (!job) {
            return res.status(404).json({
                error: true,
                message: 'Job not found.'
            });
        }
        
        if (title) job.title = title;
        if (company !== undefined) job.company = company;
        if (description) job.description = description;
        if (location !== undefined) job.location = location;
        if (jobType !== undefined) job.jobType = jobType;
        if (salary !== undefined) job.salary = salary;
        if (experienceRequired !== undefined) job.experienceRequired = experienceRequired;
        
        await job.save();
        
        res.json({
            success: true,
            message: 'Job updated successfully',
            data: { job }
        });
    } catch (error) {
        console.error('Update job error:', error);
        res.status(500).json({
            error: true,
            message: 'Failed to update job.'
        });
    }
});

// Delete job
router.delete('/:id', async (req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.id, userId: req.userId });
        
        if (!job) {
            return res.status(404).json({
                error: true,
                message: 'Job not found.'
            });
        }
        
        job.isActive = false;
        await job.save();
        
        res.json({
            success: true,
            message: 'Job deleted successfully.'
        });
    } catch (error) {
        console.error('Delete job error:', error);
        res.status(500).json({
            error: true,
            message: 'Failed to delete job.'
        });
    }
});

module.exports = router;
