import apiClient from './client';

// Current user's id and name; resolves to the response body.
export const getSession = () => apiClient.get('/oauth2/user/session');
