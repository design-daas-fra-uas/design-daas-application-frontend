import axios from 'axios';

import { DEVELOPMENT_INTERN } from '../constants/constants';
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

export default apiClient;
