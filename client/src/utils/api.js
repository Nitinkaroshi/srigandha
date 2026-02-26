import axios from 'axios';
import config from '../config/env';

const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const pagesAPI = {
  getAll: () => api.get('/pages'),
  getBySlug: (slug) => api.get(`/pages/${slug}`),
};

export const eventsAPI = {
  getAll: (type) => api.get(`/events${type ? `?type=${type}` : ''}`),
  getById: (id) => api.get(`/events/${id}`),
};

export const committeeAPI = {
  getAll: (type) => api.get(`/committee${type ? `?type=${type}` : ''}`),
};

export const galleryAPI = {
  getAll: () => api.get('/gallery'),
};

export const contactAPI = {
  submit: (data) => api.post('/contact', data),
};

export const settingsAPI = {
  get: () => api.get('/settings'),
};

export const carouselAPI = {
  getAll: () => api.get('/carousel'),
};

export default api;
