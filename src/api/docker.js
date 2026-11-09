import { daasClient, isDaasSuccess } from './client';
import { DaasRequestError } from './phases';

// Read-only Docker views of the DaaS backend (admins only). Each resolves to `response_data`.
const fetchDocker = (path, body = {}, { signal } = {}) =>
  daasClient.post(path, body, { signal }).then((response) => {
    if (!isDaasSuccess(response)) {
      throw new DaasRequestError(path, response);
    }
    return response.data.response_data;
  });

// `docker info` of the daemon DaaS uses, e.g. { ServerVersion, ContainersRunning, NCPU, MemTotal, ... }.
export const getDaemonInfo = (options) => fetchDocker('/container/daemon_info', {}, options);

// One entry per image tag: { name, tag, attrs } where attrs is `docker image inspect`.
export const getImages = (options) => fetchDocker('/container/image_list', {}, options);

// Running containers: { name, id_container, status, info_image: { tag: [..] }, stats_* }.
// With `withStats` the backend also asks Docker for CPU and memory usage (slower).
export const getContainers = ({ withStats = false, ...options } = {}) =>
  fetchDocker('/container/container_list', withStats ? { detailed: 'on' } : {}, options);
