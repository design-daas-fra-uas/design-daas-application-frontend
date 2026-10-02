import apiClient from './client';

export const getUsers = () => apiClient.get('/users').then((response) => response.data);

export const createUser = (payload) => apiClient.post('/user', payload).then((response) => response.data);

export const updateUser = (id, payload) =>
    apiClient.patch(`/user/${id}`, payload).then((response) => response.data);

export const enableUser = (id) => apiClient.post(`/user/${id}/enable`, {}).then((response) => response.data);

export const disableUser = (id) => apiClient.post(`/user/${id}/disable`, {}).then((response) => response.data);

export const validateEmail = (payload) =>
    apiClient
        .post('/user/validate_email', payload, { headers: { 'Content-Type': 'application/json' } })
        .then((response) => response);
