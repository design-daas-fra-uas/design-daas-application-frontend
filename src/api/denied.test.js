import { deniedActionKey, isPermissionDenied, reportPermissionDenied, subscribePermissionDenied } from './denied';

const deniedError = (url, data, status = 401) => ({ response: { status }, config: { url, data } });

it('treats 401 and 403 as a missing permission', () => {
  expect(isPermissionDenied(deniedError('/vm/list', {}, 401))).toBe(true);
  expect(isPermissionDenied(deniedError('/vm/list', {}, 403))).toBe(true);
  expect(isPermissionDenied(deniedError('/vm/list', {}, 500))).toBe(false);
  expect(isPermissionDenied(new Error('Network Error'))).toBe(false);
});

it('names the denied action after the request', () => {
  expect(deniedActionKey(deniedError('/monitoring/get_quota'))).toBe('quota');
  expect(deniedActionKey(deniedError('/monitoring/get_monitor_info_host'))).toBe('monitoring');
  expect(deniedActionKey(deniedError('/phases/baseimage_delete'))).toBe('delete-object');
  expect(deniedActionKey(deniedError('https://pve.cluster.local:443/viewer/template/abc'))).toBe('open-connection');
  expect(deniedActionKey(deniedError('/unknown/route'))).toBe('default');
  expect(deniedActionKey({})).toBe('default');
});

it('tells creating a VM and a Docker container apart', () => {
  const form = new FormData();
  form.append('obj_type', 'container');
  expect(deniedActionKey(deniedError('/phases/baseimage_create', { obj_type: 'vm' }, 403))).toBe('create-vm');
  expect(deniedActionKey(deniedError('/phases/baseimage_create', form, 403))).toBe('create-container');
  expect(deniedActionKey(deniedError('/phases/baseimage_create', '{"obj_type":"vm"}', 403))).toBe('create-vm');
  expect(deniedActionKey(deniedError('/phases/baseimage_create', {}, 403))).toBe('create-object');
});

it('passes reported errors to the subscribers until they unsubscribe', () => {
  const listener = vi.fn();
  const unsubscribe = subscribePermissionDenied(listener);
  const error = deniedError('/vm/list');
  reportPermissionDenied(error);
  unsubscribe();
  reportPermissionDenied(error);
  expect(listener).toHaveBeenCalledTimes(1);
  expect(listener).toHaveBeenCalledWith(error);
});
