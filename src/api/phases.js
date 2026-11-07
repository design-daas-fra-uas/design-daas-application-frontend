import { daasClient, isDaasSuccess } from './client';

// The DaaS backend answered, but with an error code in the body.
export class DaasRequestError extends Error {
  constructor(path, response) {
    super(`${path} failed with response code ${response?.data?.response_code}`);
    this.name = 'DaasRequestError';
    this.response = response;
  }
}

// POSTs to a phase endpoint and resolves to the viewer URL it returns.
const requestViewer = (path, body) =>
  daasClient.post(path, body).then((response) => {
    if (!isDaasSuccess(response)) {
      throw new DaasRequestError(path, response);
    }
    return response.data.response_url;
  });

export const startEnvironment = (id, name) => requestViewer('/phases/environment_start', { id, name, connect: 'on' });

export const runEnvironment = (id, env) => requestViewer('/phases/environment_run', { id, env, connect: 'on' });

export const startBaseImage = (id) => requestViewer('/phases/baseimage_start', { id, connect: 'on' });

export const connectInstance = (id, envId) =>
  requestViewer('/viewer/connect', { id, id_env: envId, contype: 'instvnc' });

// New base image (or clone) built from an application and started right away.
export const createBaseImageFromApp = (appId) =>
  requestViewer('/phases/baseimage_create_from_app', {
    id: appId + Date.now(),
    appid: appId,
    env: `${appId}env`,
    name: `${appId}name`,
    run: 'on',
  });

export const cloneBaseImageFromApp = (appId) =>
  requestViewer('/phases/baseimage_clone_from_app', {
    id: '',
    appid: appId,
    newid: `${appId}new${Date.now()}`,
    env: `${appId}env`,
    name: `${appId}name`,
    run: 'on',
  });

// Runs `first`; if the backend rejects it with an error code, runs `fallback`.
export const withFallback = (first, fallback) =>
  first().catch((error) => {
    if (error instanceof DaasRequestError) {
      return fallback();
    }
    throw error;
  });

// JSON parameters of the cfg_* endpoints (JSON.stringify escapes quotes in user input).
export const tasklistParam = ({ type, cmd, args }) => JSON.stringify([{ type, cmd, args }]);

export const applistParam = ({ name, cmd, args }) => JSON.stringify([{ name, cmd, args }]);

export const targetParam = ({ name, cmd, args }) => JSON.stringify({ name, cmd, args });
