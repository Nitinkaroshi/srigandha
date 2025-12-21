import axios from 'axios';
import config from '../config/env';

const API_URL = config.apiUrl;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    try {
      if (typeof window !== 'undefined') {
        const storage = window.sessionStorage || window.localStorage;
        const token = storage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('Error accessing storage in request interceptor:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Don't log out if it's a login attempt failure
      const isLoginRequest = error.config.url.includes('/auth/login');
      const isChangePassword = error.config.url.includes('/auth/change-password');

      if (!isLoginRequest && !isChangePassword) {
        try {
          if (typeof window !== 'undefined') {
            const storage = window.sessionStorage || window.localStorage;
            storage.removeItem('token');
            storage.removeItem('user');
            window.location.href = '/admin/login';
          }
        } catch (storageError) {
          console.error('Error in 401 response handler:', storageError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const pagesAPI = {
  getAll: () => api.get('/pages'),
  getBySlug: (slug) => api.get(`/pages/${slug}`),
  create: (data) => api.post('/pages', data),
  update: (id, data) => api.put(`/pages/${id}`, data),
  delete: (id) => api.delete(`/pages/${id}`),
};

export const eventsAPI = {
  getAll: (type) => api.get(`/events${type ? `?type=${type}` : ''}`),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
};

export const committeeAPI = {
  getAll: (type) => api.get(`/committee${type ? `?type=${type}` : ''}`),
  getById: (id) => api.get(`/committee/${id}`),
  create: (data) => api.post('/committee', data),
  update: (id, data) => api.put(`/committee/${id}`, data),
  delete: (id) => api.delete(`/committee/${id}`),
};

export const galleryAPI = {
  getAll: () => api.get('/gallery'),
  getById: (id) => api.get(`/gallery/${id}`),
  create: (data) => api.post('/gallery', data),
  update: (id, data) => api.put(`/gallery/${id}`, data),
  delete: (id) => api.delete(`/gallery/${id}`),
};

export const contactAPI = {
  submit: (data) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
  delete: (id) => api.delete(`/contact/${id}`),
};

export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
};

export const carouselAPI = {
  getAll: () => api.get('/carousel'),
  getAllAdmin: () => api.get('/carousel/all'),
  getById: (id) => api.get(`/carousel/${id}`),
  create: (formData) => api.post('/carousel', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  update: (id, formData) => api.put(`/carousel/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  delete: (id) => api.delete(`/carousel/${id}`),
};

export const uploadAPI = {
  single: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  multiple: (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    return api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  delete: (filename) => api.delete(`/upload/${filename}`),
};

export default api;