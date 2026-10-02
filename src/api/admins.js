import apiClient from './client';

export const getAdmins = () => apiClient.get('/admins').then((response) => response.data);

export const createAdmin = (payload) => apiClient.post('/admin', payload).then((response) => response.data);
