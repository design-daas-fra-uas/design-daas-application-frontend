import { logoutRequest, refreshAccessToken } from '../api/auth';
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  getRole,
  isSessionInvalid,
  logout,
  refreshSession,
  setSession,
  subscribeToSession,
} from './tokenManager';

jest.mock('../api/auth', () => ({
  refreshAccessToken: jest.fn(),
  logoutRequest: jest.fn(),
}));

const login = () =>
  setSession({ tokenType: 'Bearer', accessToken: 'access-1', refreshToken: 'refresh-1', role: 'user' });

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

describe('session storage', () => {
  it('stores the access token with its type and the refresh token without', () => {
    login();
    expect(getAccessToken()).toBe('Bearer access-1');
    expect(getRefreshToken()).toBe('refresh-1');
    expect(getRole()).toBe('user');
  });

  it('reads refresh tokens stored with a type by older versions', () => {
    localStorage.setItem('userRefreshToken', 'Bearer legacy');
    expect(getRefreshToken()).toBe('legacy');
  });

  it('notifies subscribers on login and logout', () => {
    const listener = jest.fn();
    const unsubscribe = subscribeToSession(listener);
    login();
    clearSession();
    unsubscribe();
    login();
    expect(listener).toHaveBeenCalledTimes(2);
    expect(getRole()).toBe('user');
  });
});

describe('refreshSession', () => {
  it('rejects without a session', async () => {
    await expect(refreshSession()).rejects.toThrow('No session');
    expect(refreshAccessToken).not.toHaveBeenCalled();
  });

  it('sends the bare refresh token and stores the new tokens', async () => {
    login();
    refreshAccessToken.mockResolvedValue({
      data: { token_type: 'Bearer', access_token: 'access-2', refresh_token: 'refresh-2' },
    });

    await expect(refreshSession()).resolves.toBe('Bearer access-2');
    expect(refreshAccessToken).toHaveBeenCalledWith({ refreshToken: 'refresh-1' });
    expect(getRefreshToken()).toBe('refresh-2');
  });

  it('shares one request between concurrent callers', async () => {
    login();
    refreshAccessToken.mockResolvedValue({ data: { token_type: 'Bearer', access_token: 'a', refresh_token: 'r' } });
    await Promise.all([refreshSession(), refreshSession()]);
    expect(refreshAccessToken).toHaveBeenCalledTimes(1);
  });
});

describe('isSessionInvalid', () => {
  it('only treats rejected tokens or a missing session as invalid', () => {
    expect(isSessionInvalid({ response: { status: 401 } })).toBe(true);
    expect(isSessionInvalid({ response: { status: 400 } })).toBe(true);
    expect(isSessionInvalid(new Error('No session'))).toBe(true);
    expect(isSessionInvalid({ response: { status: 503 } })).toBe(false);
    expect(isSessionInvalid(new Error('Network Error'))).toBe(false);
  });
});

describe('logout', () => {
  const { location } = window;

  beforeAll(() => {
    delete window.location;
    window.location = { href: '' };
  });

  afterAll(() => {
    window.location = location;
  });

  it('wipes local data, ends the server session and redirects', async () => {
    login();
    localStorage.setItem('selected-object-id', '42');
    logoutRequest.mockResolvedValue({});

    await logout('/');

    expect(logoutRequest).toHaveBeenCalledWith({ accessToken: 'Bearer access-1', refreshToken: 'refresh-1' });
    expect(localStorage.length).toBe(0);
    expect(window.location.href).toBe('/');
  });

  it('still redirects when the server call fails', async () => {
    login();
    logoutRequest.mockRejectedValue(new Error('offline'));
    await logout('/');
    expect(window.location.href).toBe('/');
  });
});
