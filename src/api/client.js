import axios from 'axios';

import { DEVELOPMENT_INTERN } from '../constants/constants';
import { clearSession, refreshSession } from '../auth/tokenManager';
import { getAuthHeaders } from '../utils/apiHeaders';

// Shared axios instance for every authenticated call to the backend API.
// Centralizing the base URL + auth headers here means individual views no
// longer need to import DEVELOPMENT_INTERN/getAuthHeaders themselves.
const apiClient = axios.create({
    baseURL: DEVELOPMENT_INTERN,
});

apiClient.interceptors.request.use((config) => {
    config.headers = {
        ...getAuthHeaders(),
        ...config.headers,
    };

    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;
        if (error.response?.status !== 401 || !original || original._retried) {
            return Promise.reject(error);
        }
        original._retried = true;
        try {
            const token = await refreshSession();
            original.headers = { ...original.headers, Authorization: token };
            return apiClient(original);
        } catch (refreshError) {
            clearSession();
            return Promise.reject(error);
        }
    },
);

export default apiClient;
