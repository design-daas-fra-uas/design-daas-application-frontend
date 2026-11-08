import { daasClient, isDaasSuccess } from '../../../../api/client';
import { DaasRequestError } from '../../../../api/phases';

// POSTs to the DaaS backend; rejects with a DaasRequestError when it reports an error code.
const post = async (path, body) => {
  const response = await daasClient.post(path, body);
  if (!isDaasSuccess(response)) {
    throw new DaasRequestError(path, response);
  }
  return response;
};

// Objects are either environments or base images; their state tells which.
const ENVIRONMENT_STATES = ['environment-create', 'environment-final'];
const BASEIMAGE_STATES = ['baseimage-create', 'baseimage-final'];

const kindOf = (state) => {
  if (ENVIRONMENT_STATES.includes(state)) return 'environment';
  if (BASEIMAGE_STATES.includes(state)) return 'baseimage';
  throw new Error(`Unknown object state "${state}"`);
};

export const fetchDashboardInfo = async () =>
  (await post('/monitoring/dashboard_info', {})).data.response_data.dashboardinfo;

// `object` is an entry of `available_objects`: { id_object, id_user, object_state }.
// Resolves to { instanceId, viewerUrl } of the started instance.
export const startObject = async ({ id_object: id, id_user: env, object_state: state }) => {
  const response =
    kindOf(state) === 'environment'
      ? await post('/phases/environment_start', { id, name: env, connect: 'on' })
      : await post('/phases/baseimage_start', { id, connect: 'on' });
  return { instanceId: response.data.id_instance, viewerUrl: response.data.response_url };
};

// Environments are stopped by object id and environment name, base images by
// their running instance.
export const stopObject = ({ id_object: id, id_user: env, object_state: state }, instanceId) =>
  kindOf(state) === 'environment'
    ? post('/phases/environment_stop', { id, name: env, force: 'on' })
    : post('/phases/baseimage_stop', { id_instance: instanceId, force: 'on' });

// An environment object is removed with its environment first; that step may
// fail (e.g. already gone) without stopping the base image delete.
export const deleteObject = async ({ id_object: id, id_user: env, object_state: state }) => {
  if (kindOf(state) === 'environment') {
    await post('/phases/environment_delete', { id, name: env, connect: 'on' }).catch(() => undefined);
  }
  return post('/phases/baseimage_delete', { id, connect: 'on' });
};

// `environment` is an entry of `available_environments`: { id_object, name, ... }.
export const stopEnvironment = ({ id_object: id, name }) => post('/phases/environment_stop', { id, name, force: 'on' });

export const deleteEnvironment = ({ id_object: id, name }) => post('/phases/environment_delete', { id, name });

export const getFile = async (id) => (await post('/files/get', { id })).data.response_data;
