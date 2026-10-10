import apiClient from './client';

export const getDesktops = ({ signal } = {}) => apiClient.get('/desktops', { signal });

export const getDesktop = (id, { signal } = {}) => apiClient.get(`/desktop/${id}`, { signal });

// The API models the sub description as a single-entry groups list.
export const createDesktop = ({ description, subDescription }) =>
    apiClient.post('/desktop', { description, groups: [{ description: subDescription }] });
