import apiClient from './client';

export const getAdmins = ({ signal } = {}) => apiClient.get('/admins', { signal });

export const getAdmin = (id, { signal } = {}) => apiClient.get(`/admin/${id}`, { signal });

export const createAdmin = (payload) => apiClient.post('/admin', payload);

export const deleteAdmin = (id) => apiClient.delete(`/admin/${id}`);
