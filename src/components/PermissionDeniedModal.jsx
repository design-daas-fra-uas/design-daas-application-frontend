import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { subscribePermissionDenied } from '../api/denied';
import PermissionDenied from './PermissionDenied';

// Shows the last denied button action (reported with reportPermissionDenied)
// in a modal, on whatever page the user is. Mounted once in App.
function PermissionDeniedModal() {
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  // Keep the content while the modal fades out
  const [lastError, setLastError] = useState(null);

  useEffect(
    () =>
      subscribePermissionDenied((denied) => {
        setError(denied);
        setLastError(denied);
      }),
    [],
  );

  const close = () => setError(null);

  return (
    <Modal show={Boolean(error)} onHide={close} centered aria-label={t('permission-denied-title')}>
      <Modal.Body>
        <PermissionDenied
          error={error ?? lastError}
          className="error-state-in-modal"
          actions={
            <Button variant="primary" onClick={close}>
              {t('ok')}
            </Button>
          }
        />
      </Modal.Body>
    </Modal>
  );
}

export default PermissionDeniedModal;
