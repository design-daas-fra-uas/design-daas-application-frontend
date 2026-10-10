import apiClient from './client';

export const getUserGroups = ({ signal } = {}) => apiClient.get('/user_groups', { signal });

export const createUserGroup = (payload) =>
    apiClient.post('/user_group', payload);

export const updateUserGroup = (id, payload) =>
    apiClient.patch(`/user_group/${id}`, payload);
