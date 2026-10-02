import { DEVELOPMENT_INTERN } from '../constants/constants';

// Unauthenticated axios calls used before a session exists (login/token
// refresh). These intentionally do NOT go through the shared `client.js`
// instance, since that instance injects an Authorization header that isn't
// available/relevant yet.
import axios from 'axios';

const FORM_URLENCODED_HEADERS = {
    'Content-Type': 'application/x-www-form-urlencoded',
};

const toFormBody = (fields) =>
    Object.entries(fields)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

export const loginWithPassword = ({ username, password }) => {
    const body = toFormBody({
        grant_type: 'password',
        username,
        password,
    });

    return axios.post(`${DEVELOPMENT_INTERN}/oauth2/user/token`, body, {
        headers: {
            ...FORM_URLENCODED_HEADERS,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
        },
    });
};

export const refreshAccessToken = ({ refreshToken, role }) => {
    const body = toFormBody({
        grant_type: 'refresh_token',
        client_id: 'test-client',
        scope: role,
        refresh_token: refreshToken,
    });

    return axios.post(`${DEVELOPMENT_INTERN}/oauth2/user/token`, body, {
        headers: FORM_URLENCODED_HEADERS,
    });
};
