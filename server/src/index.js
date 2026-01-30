/**
 * AI Resume Analyzer - Node.js Backend
 * Express server with MongoDB and NLP service integration
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

// Import routes
const authRoutes = require("./routes/auth.routes");
const resumeRoutes = require("./routes/resume.routes");
const jobRoutes = require("./routes/job.routes");
const analyticsRoutes = require("./routes/analytics.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - CORS must be before other middleware
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/analytics", analyticsRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", service: "resume-analyzer-api" });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "AI Resume Analyzer API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      resume: "/api/resume",
      job: "/api/job",
      analytics: "/api/analytics",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: true,
    message: "Endpoint not found",
  });
});

// MongoDB connection
const connectDB = require("./config/db");

// Database middleware - ensures DB is connected for every request
app.use(async (req, res, next) => {
  // Skip DB connection for simple health checks and static files if needed
  if (req.path === '/api/health' || req.path === '/') {
    return next();
  }
  
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ 
      error: true, 
      message: "Database connection failed",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Start server (only for local development)
if (require.main === module) {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(
          `📊 NLP Service URL: ${
            process.env.NLP_SERVICE_URL || "http://localhost:8000"
          }`
        );
      });
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err);
    });
}

module.exports = app;
