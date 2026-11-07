import { useState } from 'react';
import { Button, Col } from 'react-bootstrap';
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
    return (
      <Col xs={12} className="text-left">
        {t('no-data-available')}
      </Col>
    );
  }

  return (
    <>
      <Col xs={12} className="text-left">
        <select id="available-object" aria-label={t('available_objects')} value={selectedId} onChange={select}>
          <option value="">{t('no-object')}</option>
          {objects.map((object) => (
            <option key={object.id_object} value={object.id_object}>
              {t('name-text') + object.id_user}
            </option>
          ))}
        </select>
      </Col>
      <Col xs={12} md={3} className="text-center">
        <Button variant="primary" disabled={!selected} onClick={start}>
          {t('start-mode')}
        </Button>
      </Col>
      <Col xs={12} md={3} className="text-center">
        <Button variant="primary" disabled={!selected || !instanceId} onClick={stop}>
          {t('stop-mode')}
        </Button>
      </Col>
      <Col xs={12} md={3} className="text-center">
        <Button variant="primary" disabled={!selected} onClick={editInExpertMode}>
          {t('edit-headline')} ({t('expert-mode')})
        </Button>
      </Col>
      <Col xs={12} md={3} className="text-center">
        <Button variant="primary" disabled={!selected} onClick={remove}>
          {t('delete-mode')}
        </Button>
      </Col>
    </>
  );
}

export default ObjectControls;
