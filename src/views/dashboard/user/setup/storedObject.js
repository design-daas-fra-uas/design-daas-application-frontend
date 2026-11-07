import { createLogger } from '../../../../utils/logger';

const log = createLogger('ExpertSetup');

const readJson = (key) => {
  const raw = localStorage.getItem(key);
  try {
    return raw ? JSON.parse(raw) : undefined;
  } catch (error) {
    log.warn(`Ignoring invalid ${key} in localStorage`, error);
    return undefined;
  }
};

// The mainUser dashboard stores the selected object before opening a setup page.
export const readNewEnvironment = () => {
  const objectId = localStorage.getItem('object-id') || '';
  return { objectId, env: `${objectId}-env`, targetName: `${objectId}-name`, saved: {} };
};

export const readEditedEnvironment = () => ({
  objectId: localStorage.getItem('env-object-id') || '',
  env: localStorage.getItem('env-name') || '',
  targetName: '',
  saved: { apps: readJson('env-apps'), tasks: readJson('env-tasks'), target: readJson('env-target') },
});

export const readBaseImage = () => ({ objectId: localStorage.getItem('object-id') || '' });

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
