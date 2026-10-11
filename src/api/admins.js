import apiClient from './client';

export const getAdmins = ({ signal } = {}) => apiClient.get('/admins', { signal });

export const createAdmin = (payload) => apiClient.post('/admin', payload);
