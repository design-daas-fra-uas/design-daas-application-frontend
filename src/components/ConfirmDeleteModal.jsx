import { useState } from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { describeError } from '../api/errors';

import { createLogger } from '../utils/logger';
const log = createLogger('ConfirmDeleteModal');

// Asks "are you sure?" before a delete. `onConfirm()` should throw when the
// delete fails: the error stays in the modal (a 409 shows the backend's reason,
// e.g. "The last admin cannot be deleted"; other errors add the reason after the
// generic text). After success the modal closes and `onDeleted` runs.
function ConfirmDeleteModal({ show, onHide, title, message, onConfirm, onDeleted }) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleHide = () => {
    if (busy) {
      return;
    }
    setError('');
    onHide();
  };

  const confirm = async () => {
    setBusy(true);
    setError('');
    try {
      await onConfirm();
    } catch (e) {
      log.error('Deleting failed', e);
      const conflictMessage = e?.response?.status === 409 ? e.response.data?.message : '';
      const reason = describeError(e);
      const failed = t('request-failed', 'The request failed. Please try again.');
      setError(conflictMessage || (reason ? `${failed} ${reason}` : failed));
      setBusy(false);
      return;
    }
    setBusy(false);
    onHide();
    onDeleted?.();
  };

  return (
    <Modal show={show} onHide={handleHide} size="md" aria-labelledby="confirm-delete-title" centered>
      <Modal.Header closeButton>
        <Modal.Title id="confirm-delete-title">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" role="alert">
            {error}
          </Alert>
        )}
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="secondary" onClick={handleHide} disabled={busy}>
          {t('no')}
        </Button>
        <Button type="button" variant="danger" onClick={confirm} disabled={busy}>
          {busy ? t('loading', 'Loading...') : t('delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmDeleteModal;
