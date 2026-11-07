import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../../../routes';
import { deleteEnvironment, stopEnvironment } from './dashboardApi';
import { navigateLater, storeJson } from './navigation';

const keyOf = (environment) => `${environment.id_object}-${environment.id_env}`;

// Remembers the environment for the viewer and setup pages.
const storeEnvironment = (environment, mode) => {
  localStorage.setItem('env-object-id', environment.id_object);
  localStorage.setItem('env-name', environment.name);
  if (mode) {
    localStorage.setItem('environment-type-mode', mode);
  }
};

// Pick one of the user's environments and start, run, stop, edit or delete it.
function EnvironmentControls({ environments, run, reload }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState('');
  const selected = environments.find((environment) => keyOf(environment) === selectedKey);

  const open = (mode) => {
    storeEnvironment(selected, mode);
    navigateLater(navigate, ROUTES.user.environmentRun);
  };

  const stop = async () => {
    storeEnvironment(selected);
    await run('Stopping the environment', () => stopEnvironment(selected));
    reload();
  };

  const edit = () => {
    storeEnvironment(selected, 'edit');
    storeJson('env-apps', selected.env_apps?.[0]);
    storeJson('env-tasks', selected.env_tasks?.[0]);
    storeJson('env-target', selected.env_target);
    navigateLater(navigate, ROUTES.user.expertEnvironmentEdit, () =>
      localStorage.setItem('expert-mode-baseimage', 'true'),
    );
  };

  const remove = async () => {
    if (await run('Deleting the environment', () => deleteEnvironment(selected))) {
      setSelectedKey('');
      reload();
    }
  };

  if (environments.length === 0) {
    return <p className="empty-state">{t('no-data-available')}</p>;
  }

  return (
    <>
      <select
        id="available-environments"
        className="form-select"
        aria-label={t('available_environments')}
        value={selectedKey}
        onChange={(event) => setSelectedKey(event.target.value)}
      >
        <option value="">{t('no-environment')}</option>
        {environments.map((environment) => (
          <option key={keyOf(environment)} value={keyOf(environment)}>
            {`${t('id-text')}${environment.id_env}, ${t('name-text')}${environment.name}, ${t('object-text')}${environment.id_object}`}
          </option>
        ))}
      </select>
      <div className="control-buttons">
        <Button variant="primary" disabled={!selected} onClick={() => open('start')}>
          {t('start-headline')}
        </Button>
        <Button variant="primary" disabled={!selected} onClick={() => open('run')}>
          {t('run-headline')}
        </Button>
        <Button variant="outline-primary" disabled={!selected} onClick={stop}>
          {t('stop-headline')}
        </Button>
        <Button variant="outline-primary" disabled={!selected} onClick={edit}>
          {t('edit-headline')}
        </Button>
        <Button variant="outline-danger" disabled={!selected} onClick={remove}>
          {t('delete-headline')}
        </Button>
      </div>
    </>
  );
}

export default EnvironmentControls;
