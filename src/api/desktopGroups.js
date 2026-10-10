import apiClient from './client';

export const getDesktopGroups = ({ signal } = {}) => apiClient.get('/desktop_groups', { signal });

export const createDesktopGroup = (payload) =>
    apiClient.post('/desktop_group', payload);

export const addUserGroupToDesktopGroup = (desktopGroupId, userGroupId) =>
    apiClient
        .post(`/desktop_group/${desktopGroupId}/user_group/${userGroupId}`, {});
