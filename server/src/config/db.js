/**
 * Database Connection with Caching for Serverless
 * Handles MongoDB connection re-use to prevent cold start timeouts
 */

const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // If connection exists and is ready (1 = connected)
  if (cached.conn && mongoose.connection.readyState === 1) {
    console.log('Using cached MongoDB connection (Ready)');
    return cached.conn;
  }

  // If we have a promise but connection is not ready, wait for it
  if (cached.promise && mongoose.connection.readyState === 2) {
    console.log('Waiting for existing connection attempt...');
    cached.conn = await cached.promise;
    return cached.conn;
  }

  // If disconnected or other state, create new connection
  const opts = {
    bufferCommands: false, // Disable buffering to fail fast
    serverSelectionTimeoutMS: 10000, 
    socketTimeoutMS: 45000,
    family: 4 // Force IPv4 to avoid potential IPv6 issues
  };

  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  console.log(`Creating new MongoDB connection (State: ${mongoose.connection.readyState})...`);
  
  // Create new connection promise
  cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
    console.log('New MongoDB connection established');
    return mongoose;
  }).catch(err => {
    console.error('MongoDB Connection Error:', err);
    cached.promise = null; // Reset promise on error
    throw err;
  });

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

module.exports = connectDB;
