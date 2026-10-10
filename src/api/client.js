import axios from 'axios';

import { DEVELOPMENT_INTERN } from '../constants/constants';
import { clearSession, refreshSession } from '../auth/tokenManager';
import { getAuthHeaders } from '../utils/apiHeaders';

const unwrapData = (response) => response.data;

// Shared axios instance for authenticated backend calls. Responses resolve to
// `response.data`.
const apiClient = axios.create({
    baseURL: DEVELOPMENT_INTERN,
});

// Same base URL, but without auth headers or the 401 refresh flow.
export const publicClient = axios.create({
    baseURL: DEVELOPMENT_INTERN,
});
publicClient.interceptors.response.use(unwrapData);

apiClient.interceptors.request.use((config) => {
    Object.entries(getAuthHeaders()).forEach(([key, value]) => {
        if (!config.headers.has(key)) {
            config.headers.set(key, value);
        }
    });

    return config;
});

// Only a rejected refresh token (or a missing session) ends the session;
// transient network/server errors must not log the user out.
const isSessionInvalid = (refreshError) => {
    const status = refreshError?.response?.status;
    return status === 400 || status === 401 || refreshError?.message === 'No session';
};

apiClient.interceptors.response.use(unwrapData, async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || !original || original._retried) {
        return Promise.reject(error);
    }
    original._retried = true;
    try {
        const token = await refreshSession();
        original.headers.set('Authorization', token);
        return apiClient(original);
    } catch (refreshError) {
        if (isSessionInvalid(refreshError)) {
            clearSession();
        }
        return Promise.reject(error);
    }
});

export default apiClient;
