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

// /phases/object_list mixes VMs, every Docker image (id "sha256:...") and the DaaS
// container objects; only the last have their object id as `daas_id`.
export const toContainerObjects = (entries) =>
  entries
    .filter((entry) => entry.daas_object && entry.daas_type === 'docker-image' && !/^sha256:/.test(entry.daas_id))
    .map((entry) => ({ id: entry.daas_id, name: entry.daas_name, owner: entry.daas_owner }))
    .sort((a, b) => a.id.localeCompare(b.id));

// DaaS container objects `{ id, name, owner }` (owner 0 = shared). Every form on the Docker page asks, so one
// answer is shared for a few seconds.
const OBJECTS_TTL_MS = 10_000;
let objectsRequest = null;
let objectsRequestedAt = 0;
export const getContainerObjects = () => {
  if (!objectsRequest || Date.now() - objectsRequestedAt > OBJECTS_TTL_MS) {
    objectsRequestedAt = Date.now();
    objectsRequest = fetchDocker('/phases/object_list', {})
      .then(toContainerObjects)
      .catch((error) => {
        objectsRequest = null;
        throw error;
      });
  }
  return objectsRequest;
};
