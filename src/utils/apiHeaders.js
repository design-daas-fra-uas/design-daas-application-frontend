// Shared helper for building the headers used by the admin settings views
// when talking to the backend API.
import { getAccessToken } from '../auth/tokenManager';

export const getAuthHeaders = () => ({
    Authorization: getAccessToken(),
});
