import { daasClient } from './client';
import { clearSession, refreshSession } from '../auth/tokenManager';

vi.mock('../auth/tokenManager', () => ({
  getAccessToken: () => 'Bearer expired',
  refreshSession: vi.fn(),
  clearSession: vi.fn(),
  isSessionInvalid: (error) => error?.response?.status === 400,
}));

// Answers with the given statuses in order and records the Authorization header of each request.
const fakeBackend = (...statuses) => {
  const seen = [];
  daasClient.defaults.adapter = async (config) => {
    seen.push(config.headers.get('Authorization'));
    const status = statuses[seen.length - 1];
    const response = { status, data: { response_code: status }, headers: {}, config };
    if (status >= 400) {
      throw Object.assign(new Error(`HTTP ${status}`), { config, response });
    }
    return response;
  };
  return seen;
};

beforeEach(() => vi.clearAllMocks());

describe('daasClient', () => {
  it('refreshes the session on a 401 and retries with the new token', async () => {
    refreshSession.mockResolvedValue('Bearer fresh');
    const seen = fakeBackend(401, 200);

    const response = await daasClient.post('/monitoring/dashboard_info', {});

    expect(response.status).toBe(200);
    expect(seen).toEqual(['Bearer expired', 'Bearer fresh']);
    expect(clearSession).not.toHaveBeenCalled();
  });

  it('retries only once', async () => {
    refreshSession.mockResolvedValue('Bearer fresh');
    const seen = fakeBackend(401, 401);

    await expect(daasClient.post('/vm/list', {})).rejects.toMatchObject({ response: { status: 401 } });
    expect(seen).toHaveLength(2);
    expect(refreshSession).toHaveBeenCalledTimes(1);
  });

  it('ends the session when the refresh token is rejected', async () => {
    refreshSession.mockRejectedValue({ response: { status: 400 } });
    fakeBackend(401);

    await expect(daasClient.post('/vm/list', {})).rejects.toMatchObject({ response: { status: 401 } });
    expect(clearSession).toHaveBeenCalledTimes(1);
  });

  it('does not refresh on a 403 (ownership denied)', async () => {
    fakeBackend(403);

    await expect(daasClient.post('/vm/list', {})).rejects.toMatchObject({ response: { status: 403 } });
    expect(refreshSession).not.toHaveBeenCalled();
  });
});
