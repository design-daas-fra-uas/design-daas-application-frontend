import apiClient from './client';

export const getDesktops = () => apiClient.get('/desktops').then((response) => response.data);

export const getDesktop = (id) => apiClient.get(`/desktop/${id}`).then((response) => response.data);

export const createDesktop = (payload) => apiClient.post('/desktop', payload).then((response) => response.data);
