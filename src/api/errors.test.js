import { describeError, describeResponse } from './errors';

describe('describeError', () => {
  it('uses the DaaS reason and HTTP status', () => {
    const error = { response: { status: 403, data: { sys_log: 'Only admins may change system objects' } } };
    expect(describeError(error)).toBe('Only admins may change system objects (403)');
  });

  it('uses the response code of a DaaS error inside an HTTP 200', () => {
    const response = { status: 200, data: { response_code: 400, sys_log: 'Object deletion failed' } };
    expect(describeResponse(response)).toBe('Object deletion failed (400)');
  });

  it('falls back to the exception message, then to the status alone', () => {
    expect(describeError({ response: { status: 500, data: { sys_log: '', error_message: 'KeyError! x' } } })).toBe(
      'KeyError! x (500)',
    );
    expect(describeError({ response: { status: 502, data: '<html>' } })).toBe('Error 502');
  });

  it('reads the Java backend reasons', () => {
    expect(describeError({ response: { status: 409, data: { message: 'Email already in use' } } })).toBe(
      'Email already in use (409)',
    );
  });

  it('reports an unreachable backend', () => {
    expect(describeError({ message: 'Network Error' })).toBe('Backend not reachable');
  });
});
