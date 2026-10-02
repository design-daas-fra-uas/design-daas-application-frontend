import apiClient from './client';

export const getUserGroups = () => apiClient.get('/user_groups').then((response) => response.data);

export const createUserGroup = (payload) =>
    apiClient.post('/user_group', payload).then((response) => response.data);

export const updateUserGroup = (id, payload) =>
    apiClient.patch(`/user_group/${id}`, payload).then((response) => response.data);
