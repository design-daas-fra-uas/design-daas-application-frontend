import axios from 'axios';

import { DEVELOPMENT_INTERN, OAUTH_CLIENT_ID } from '../constants/constants';

// Unauthenticated calls used before a session exists (login/token refresh).
// These intentionally bypass the shared `client.js` instance.
const TOKEN_URL = `${DEVELOPMENT_INTERN}/oauth2/user/token`;

const toFormBody = (fields) =>
    Object.entries(fields)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

const postToken = (fields) =>
    axios.post(TOKEN_URL, toFormBody({ ...fields, client_id: OAUTH_CLIENT_ID }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

export const loginWithPassword = ({ username, password, role }) =>
    postToken({ grant_type: 'password', username, password, scope: role });

export const refreshAccessToken = ({ refreshToken, role }) =>
    postToken({ grant_type: 'refresh_token', scope: role, refresh_token: refreshToken });
