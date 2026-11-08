import { Modal, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import ActionPanel from '../../../../components/actions/ActionPanel';
import {
  APP_FIELDS,
  BASEIMAGE_CLONE_FIELDS,
  BASEIMAGE_CREATE_FIELDS,
  FILE_FIELDS,
} from '../../../../components/actions/forms';
import ApplicationList from './ApplicationList';

const ACTIONS = [
  { key: 'create-new-object', endpoint: '/phases/baseimage_create', fields: BASEIMAGE_CREATE_FIELDS },
  { key: 'clone-new-object', endpoint: '/phases/baseimage_clone', fields: BASEIMAGE_CLONE_FIELDS },
  { key: 'app-create', endpoint: '/apps/create', fields: APP_FIELDS },
  { key: 'app-update', endpoint: '/apps/update', fields: APP_FIELDS },
  { key: 'file-create', endpoint: '/files/create', fields: FILE_FIELDS },
  { key: 'file-update', endpoint: '/files/update', fields: FILE_FIELDS },
];

// Shared applications plus the create/clone/upload forms; every successful
// form submit calls `onChanged` so the dashboard reloads.
function CreateModal({ show, onHide, sharedApps, onOpenApp, showRequestAlert, onChanged }) {
  const { t } = useTranslation();
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      aria-labelledby="user-app-complete-title"
      centered
      id="user-app-complete"
    >
      <Modal.Header closeButton>
        <Modal.Title id="user-app-complete-title">{t('create-update-share-data')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs defaultActiveKey="app-shared" id="user-app-view">
          <Tab eventKey="app-shared" title={t('app-shared')}>
            <ApplicationList apps={sharedApps} onOpen={onOpenApp} />
          </Tab>
          {ACTIONS.map((action) => (
            <Tab key={action.key} eventKey={action.key} title={t(action.key)}>
              <ActionPanel action={{ ...action, onSuccess: onChanged }} showRequestAlert={showRequestAlert} />
            </Tab>
          ))}
        </Tabs>
      </Modal.Body>
    </Modal>
  );
}

export default CreateModal;
