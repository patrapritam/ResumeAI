/**
 * AI Resume Analyzer - Node.js Backend
 * Vercel Build Trigger: v2.0.4 - Fixed middleware order
 * Express server with MongoDB and NLP service integration
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// Import database connection
const connectDB = require("./config/db");

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

// Health check endpoint (no DB needed)
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", service: "resume-analyzer-api" });
});

// Root endpoint (no DB needed)
app.get("/", (req, res) => {
  res.json({
    message: "AI Resume Analyzer API",
    version: "2.0.4",
    endpoints: {
      auth: "/api/auth",
      resume: "/api/resume",
      job: "/api/job",
      analytics: "/api/analytics",
    },
  });
});

// *** DATABASE MIDDLEWARE - MUST BE BEFORE ROUTES ***
// Ensures DB is connected for every API request
app.use("/api", async (req, res, next) => {
  // Skip health check (already handled above)
  if (req.path === '/health') {
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

// *** API Routes - AFTER database middleware ***
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/analytics", analyticsRoutes);

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
