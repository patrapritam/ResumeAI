import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API URL:', API_URL);

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.baseURL + config.url, config.data);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data)
};

// Resume API
export const resumeAPI = {
  upload: (formData) => api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  analyze: (data) => api.post('/resume/analyze', data),
  getAll: () => api.get('/resume'),
  getById: (id) => api.get(`/resume/${id}`),
  delete: (id) => api.delete(`/resume/${id}`),
  getAnalysis: (id) => api.get(`/resume/analysis/${id}`),
  getHistory: (params) => api.get('/resume/history', { params })
};

// Job API
export const jobAPI = {
  create: (data) => api.post('/job', data),
  getAll: (params) => api.get('/job', { params }),
  getById: (id) => api.get(`/job/${id}`),
  update: (id, data) => api.put(`/job/${id}`, data),
  delete: (id) => api.delete(`/job/${id}`)
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getTopSkills: (params) => api.get('/analytics/top-skills', { params }),
  getTrends: (params) => api.get('/analytics/trends', { params }),
  getDistribution: (params) => api.get('/analytics/distribution', { params }),
  getTopJobs: (params) => api.get('/analytics/top-jobs', { params }),
  getUserGrowth: (params) => api.get('/analytics/user-growth', { params }),
  getFullAnalytics: (params) => api.get('/analytics/full', { params })
};

export default api;
