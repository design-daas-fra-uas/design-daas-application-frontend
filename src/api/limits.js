import { daasClient, isDaasSuccess } from './client';
import { DaasRequestError } from './phases';

// Resource limits of the DaaS backend (admins only). Memory and disk are in bytes,
// counts are plain numbers, and -1 means "no limit".

const post = (path, body, { signal } = {}) =>
  daasClient.post(path, body, { signal }).then((response) => {
    if (!isDaasSuccess(response)) {
      throw new DaasRequestError(path, response);
    }
    return response.data.response_data;
  });

// { limits: [RessourceInfo], syslimit: RessourceInfo, fallback: RessourceInfo }:
// every per-user limit, the system-wide maximum, and the default for users without one.
// An empty id_owner asks for all users.
export const getLimitOverview = (options) => post('/admin/get_monitor_info_limits', { id_owner: '' }, options);

// Creates or replaces the limit of one user.
export const putLimit = (limit) => post('/limits/put_limit', limit);

// Removes a user's own limit; afterwards the default limit applies to them.
export const removeLimit = (idOwner) => post('/limits/remove_limit', { id_owner: idOwner });
