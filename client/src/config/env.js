/**
 * Environment configuration
 * All environment variables should be accessed through this file
 */

const config = {
  // API Configuration
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',

  // Base URL for the API server (without /api suffix)
  baseUrl: (() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    // Remove /api suffix if present
    return apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
  })(),

  // Google OAuth Client ID
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',

  // Helper function to get full URL for uploaded images
  getImageUrl: (filename) => {
    if (!filename) return '';
    if (filename.startsWith('http')) return filename;
    const baseUrl = config.baseUrl;
    return `${baseUrl}/uploads/${filename}`;
  },

  // Environment check
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

export default config;
