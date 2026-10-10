import apiClient from './client';

export const getDesktops = ({ signal } = {}) => apiClient.get('/desktops', { signal });

export const getDesktop = (id, { signal } = {}) => apiClient.get(`/desktop/${id}`, { signal });

export const createDesktop = (payload) => apiClient.post('/desktop', payload);
