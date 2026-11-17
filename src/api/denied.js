// Requests the endpoint permissions of the auth service did not allow.
//
// The DaaS backend answers 401 when a permission rule denies the route and 403
// for a denied typed permission (e.g. creating a VM) or an object of someone
// else. A 401 is only seen here after the client's session refresh, so it is
// not an expired login.

const DENIED_STATUS = [401, 403];

export const isPermissionDenied = (error) => DENIED_STATUS.includes(error?.response?.status);

// What a request wanted to do, as the suffix of a `denied-action-*` translation.
const ACTION_BY_PATH = {
  '/monitoring/dashboard_info': 'dashboard',
  '/monitoring/get_quota': 'quota',
  '/phases/object_list': 'objects',
  '/phases/baseimage_clone': 'clone-object',
  '/phases/baseimage_create_from_app': 'create-from-app',
  '/phases/baseimage_clone_from_app': 'create-from-app',
  '/phases/baseimage_delete': 'delete-object',
  '/phases/baseimage_start': 'start-object',
  '/phases/baseimage_stop': 'stop-object',
  '/phases/baseimage_finalize': 'finalize-object',
  '/phases/environment_create': 'create-environment',
  '/phases/environment_delete': 'delete-environment',
  '/phases/environment_start': 'start-environment',
  '/phases/environment_run': 'start-environment',
  '/phases/environment_stop': 'stop-environment',
  '/phases/environment_finalize': 'finalize-environment',
};

const ACTION_BY_PREFIX = [
  ['/monitoring/get_monitor_info', 'monitoring'],
  ['/viewer/', 'open-connection'],
  ['/phases/cfg_', 'edit-environment'],
  ['/vm/', 'manage-vms'],
  ['/container/', 'manage-containers'],
  ['/apps/', 'manage-apps'],
  ['/files/', 'manage-files'],
  ['/tasks/', 'tasks'],
  ['/limits/', 'limits'],
];

// Path of the request, without host and query ('' when unknown).
export const requestPath = (error) => {
  const url = error?.config?.url;
  if (!url) {
    return '';
  }
  return new URL(url, 'http://localhost').pathname;
};

// A field of the request body; axios may keep it as an object, FormData or JSON.
const bodyField = (error, name) => {
  const data = error?.config?.data;
  if (data instanceof FormData) {
    return data.get(name);
  }
  if (typeof data === 'string') {
    try {
      return JSON.parse(data)[name];
    } catch {
      return undefined;
    }
  }
  return data?.[name];
};

export const deniedActionKey = (error) => {
  const path = requestPath(error);
  // One route creates both kinds; the requested type tells which was denied.
  if (path === '/phases/baseimage_create') {
    const type = bodyField(error, 'obj_type');
    return type === 'vm' || type === 'container' ? `create-${type}` : 'create-object';
  }
  if (ACTION_BY_PATH[path]) {
    return ACTION_BY_PATH[path];
  }
  const prefix = ACTION_BY_PREFIX.find(([start]) => path.startsWith(start));
  return prefix ? prefix[1] : 'default';
};

// Denied button actions are shown in one modal (PermissionDeniedModal) instead
// of each page's request alert.
const listeners = new Set();

export const reportPermissionDenied = (error) => listeners.forEach((listener) => listener(error));

export const subscribePermissionDenied = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
