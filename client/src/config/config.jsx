// Server URL Configuration
// For local development, use: 'http://localhost:5000'
// For production, use: 'https://collegeplacementmanagementsystembe.onrender.com'

// Check if we're in development mode (localhost)
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Use local server for development, remote server for production
// NOTE: backend in this workspace listens on port 8080 (see server/.env)
const SERVER_URL = isDevelopment 
  ? 'http://localhost:8080'  // Local development server (backend uses 8080)
  : 'https://collegeplacementmanagementsystembe.onrender.com';  // Production server

export const BASE_URL = `${SERVER_URL}/api/v1`;
export const SERVER_BASE_URL = SERVER_URL; // For static files (images, resumes, etc.)

// Log the server URL for debugging
console.log('[Config] Server URL:', SERVER_URL);
console.log('[Config] Base URL:', BASE_URL);
console.log('[Config] Is Development:', isDevelopment);