import apiClient from './client';

export const getDesktopGroups = ({ signal } = {}) => apiClient.get('/desktop_groups', { signal });

export const createDesktopGroup = (payload) => apiClient.post('/desktop_group', payload);

export const deleteDesktopGroup = (id) => apiClient.delete(`/desktop_group/${id}`);

export const addUserGroupToDesktopGroup = (desktopGroupId, userGroupId) =>
  apiClient.post(`/desktop_group/${desktopGroupId}/user_group/${userGroupId}`, {});
