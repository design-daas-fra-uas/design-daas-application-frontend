import apiClient, { publicClient } from './client';

export const getUsers = ({ signal } = {}) => apiClient.get('/users', { signal });

export const getUser = (id, { signal } = {}) => apiClient.get(`/user/${id}`, { signal });

export const createUser = (payload) => apiClient.post('/user', payload);

export const updateUser = (id, payload) => apiClient.patch(`/user/${id}`, payload);

export const enableUser = (id) => apiClient.patch(`/user/${id}/enable`);

export const disableUser = (id) => apiClient.patch(`/user/${id}/disable`);

export const deleteUser = (id) => apiClient.delete(`/user/${id}`);

export const validateEmail = (payload) => publicClient.post('/user/validate_email', payload);

// Always answers 202, whether or not the address has a pending registration.
export const resendRegistrationCode = (email) => publicClient.post('/user/resend_code', { email });

// Sends the user's request for a new application to the admins. The backend
// expects the language as an ISO 639-2 code.
const REQUEST_LANGUAGES = { de: 'deu', en: 'eng' };
export const requestApplication = (message, language) =>
  apiClient.post(
    `/user/request-application/${encodeURIComponent(message)}/${REQUEST_LANGUAGES[language] || 'eng'}`,
    {},
  );
