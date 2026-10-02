import apiClient from './client';

export const getDesktopGroups = () => apiClient.get('/desktop_groups').then((response) => response.data);

export const createDesktopGroup = (payload) =>
    apiClient.post('/desktop_group', payload).then((response) => response.data);

export const addUserGroupToDesktopGroup = (desktopGroupId, userGroupId) =>
    apiClient
        .post(`/desktop_group/${desktopGroupId}/user_group/${userGroupId}`, {})
        .then((response) => response.data);
