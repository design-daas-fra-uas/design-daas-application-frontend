import { daasClient } from './client';
import { getQuota, getSystemStatus } from './monitoring';
import { DaasRequestError } from './phases';

vi.mock('./client', () => ({
  daasClient: { post: vi.fn() },
  isDaasSuccess: (response) => response?.status === 200 && response?.data?.response_code === 200,
}));

beforeEach(() => vi.clearAllMocks());

describe('monitoring requests', () => {
  it('resolve to the response data', async () => {
    daasClient.post.mockResolvedValue({ status: 200, data: { response_code: 200, response_data: { items: [] } } });

    await expect(getQuota()).resolves.toEqual({ items: [] });
    expect(daasClient.post).toHaveBeenCalledWith('/monitoring/get_quota', {}, { signal: undefined });
  });

  it('reject with DaasRequestError when the backend answers with an error code', async () => {
    daasClient.post.mockResolvedValue({ status: 200, data: { response_code: 403 } });

    await expect(getSystemStatus()).rejects.toBeInstanceOf(DaasRequestError);
  });
});
