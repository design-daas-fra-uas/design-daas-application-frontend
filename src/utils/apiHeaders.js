// Builds the auth headers injected by the shared API client (api/client.js).
import { getAccessToken } from '../auth/tokenManager';

export const getAuthHeaders = () => ({
    Authorization: getAccessToken(),
});
