import { daasClient, isDaasSuccess } from './client';
import { DaasRequestError } from './phases';

// POSTs to a DaaS monitoring endpoint and resolves to its `response_data`.
const fetchData = (path, { signal } = {}) =>
  daasClient.post(path, {}, { signal }).then((response) => {
    if (!isDaasSuccess(response)) {
      throw new DaasRequestError(path, response);
    }
    return response.data.response_data;
  });

// The logged-in user's limits next to their current usage:
// `{ source, overcommit, items: [{ key, used, limit, unit }] }`.
export const getQuota = (options) => fetchData('/monitoring/get_quota', options);

// Health of the whole stack (admins only):
// `{ state, components: [{ name, kind, state, detail }] }`.
export const getSystemStatus = (options) => fetchData('/monitoring/get_system_status', options);
