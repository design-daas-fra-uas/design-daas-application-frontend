import { daasClient } from './client';
import { DaasRequestError, startBaseImage, startEnvironment, withFallback } from './phases';

vi.mock('./client', () => ({
  daasClient: { post: vi.fn() },
  isDaasSuccess: (response) => response?.status === 200 && response?.data?.response_code === 200,
}));

const ok = (url) => ({ status: 200, data: { response_code: 200, response_url: url } });
const backendError = { status: 200, data: { response_code: 400 } };

beforeEach(() => vi.clearAllMocks());

describe('phase requests', () => {
  it('resolve to the viewer URL', async () => {
    daasClient.post.mockResolvedValue(ok('http://viewer/1'));
    await expect(startEnvironment('obj', 'env')).resolves.toBe('http://viewer/1');
    expect(daasClient.post).toHaveBeenCalledWith('/phases/environment_start', {
      id: 'obj',
      name: 'env',
      connect: 'on',
    });
  });

  it('reject with a DaasRequestError when the backend reports an error code', async () => {
    daasClient.post.mockResolvedValue(backendError);
    await expect(startBaseImage('obj')).rejects.toBeInstanceOf(DaasRequestError);
  });
});

describe('withFallback', () => {
  it('uses the fallback when the backend rejects the first request', async () => {
    daasClient.post.mockResolvedValueOnce(backendError).mockResolvedValueOnce(ok('http://viewer/2'));
    await expect(
      withFallback(
        () => startEnvironment('obj', 'env'),
        () => startBaseImage('obj'),
      ),
    ).resolves.toBe('http://viewer/2');
  });

  it('does not hide network errors behind the fallback', async () => {
    daasClient.post.mockRejectedValue(new Error('Network Error'));
    const fallback = vi.fn();
    await expect(withFallback(() => startEnvironment('obj', 'env'), fallback)).rejects.toThrow('Network Error');
    expect(fallback).not.toHaveBeenCalled();
  });
});
