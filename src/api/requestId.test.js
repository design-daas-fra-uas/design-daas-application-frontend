import { AxiosHeaders } from 'axios';
import { REQUEST_ID_HEADER, addRequestId, newRequestId, withRequestId } from './requestId';

const config = (headers = {}) => ({ headers: new AxiosHeaders(headers) });

describe('request id', () => {
  it('adds a new id to a request without one', () => {
    const result = addRequestId(config());
    expect(result.headers.get(REQUEST_ID_HEADER)).toMatch(/^[A-Za-z0-9-]{8,}$/);
  });

  it('keeps an id that is already set (a retried request keeps its id)', () => {
    const result = addRequestId(config({ [REQUEST_ID_HEADER]: 'abc' }));
    expect(result.headers.get(REQUEST_ID_HEADER)).toBe('abc');
  });

  it('creates a different id for every request', () => {
    expect(newRequestId()).not.toBe(newRequestId());
  });

  it('falls back when crypto.randomUUID is missing (plain http)', () => {
    vi.stubGlobal('crypto', undefined);
    expect(newRequestId()).toMatch(/^[a-z0-9]+-[a-z0-9]+$/);
    vi.unstubAllGlobals();
  });

  it('registers the interceptor on a client', () => {
    const use = vi.fn();
    const client = { interceptors: { request: { use } } };
    expect(withRequestId(client)).toBe(client);
    expect(use).toHaveBeenCalledWith(addRequestId);
  });
});
