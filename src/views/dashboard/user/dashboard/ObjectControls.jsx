import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../../../routes';
import { deleteObject, startObject, stopObject } from './dashboardApi';
import { navigateLater } from './navigation';

// Pick one of the user's objects and start, stop, edit (expert mode) or delete it.
function ObjectControls({ objects, instances, run, reload }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState('');
  // Instance of the selected object, if it is running.
  const [instanceId, setInstanceId] = useState('');
  const selected = objects.find((object) => String(object.id_object) === selectedId);

  const select = (event) => {
    const id = event.target.value;
    setSelectedId(id);
    const instance = instances.find((item) => String(item.id_object) === id);
    setInstanceId(instance ? instance.id_instance : '');
  };

  const start = async () => {
    const started = await run('Starting the object', () => startObject(selected));
    if (started) {
      setInstanceId(started.instanceId);
      localStorage.setItem('connection-env', started.viewerUrl);
      reload();
      navigateLater(navigate, ROUTES.user.connectionRun);
    }
  };

  const stop = async () => {
    if (await run('Stopping the object', () => stopObject(selected, instanceId))) {
      setInstanceId('');
      reload();
    }
  };

  const remove = async () => {
    await run('Deleting the object', () => deleteObject(selected));
    reload();
  };

  const editInExpertMode = () => {
    localStorage.setItem('object-id', selected.id_object);
    navigateLater(navigate, ROUTES.user.expertBaseImage);
  };

  if (objects.length === 0) {
    return <p className="empty-state">{t('no-data-available')}</p>;
  }

  return (
    <>
      <select
        id="available-object"
        className="form-select"
        aria-label={t('available_objects')}
        value={selectedId}
        onChange={select}
      >
        <option value="">{t('no-object')}</option>
        {objects.map((object) => (
          <option key={object.id_object} value={object.id_object}>
            {t('name-text') + object.id_user}
          </option>
        ))}
      </select>
      <div className="control-buttons">
        <Button variant="primary" disabled={!selected} onClick={start}>
          {t('start-mode')}
        </Button>
        <Button variant="outline-primary" disabled={!selected || !instanceId} onClick={stop}>
          {t('stop-mode')}
        </Button>
        <Button variant="outline-primary" disabled={!selected} onClick={editInExpertMode}>
          {t('edit-headline')} ({t('expert-mode')})
        </Button>
        <Button variant="outline-danger" disabled={!selected} onClick={remove}>
          {t('delete-mode')}
        </Button>
      </div>
    </>
  );
}

export default ObjectControls;
