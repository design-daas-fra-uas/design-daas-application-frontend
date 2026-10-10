import apiClient, { publicClient } from './client';

export const getUsers = ({ signal } = {}) => apiClient.get('/users', { signal });

export const createUser = (payload) => apiClient.post('/user', payload);

export const updateUser = (id, payload) =>
    apiClient.patch(`/user/${id}`, payload);

export const enableUser = (id) => apiClient.post(`/user/${id}/enable`, {});

export const disableUser = (id) => apiClient.post(`/user/${id}/disable`, {});

export const validateEmail = (payload) => publicClient.post('/user/validate_email', payload);
