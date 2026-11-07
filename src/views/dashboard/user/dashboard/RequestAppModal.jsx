import { useState } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { requestApplication } from '../../../../api/users';

// Lets the user ask the administrators for a new application.
function RequestAppModal({ show, onHide, run }) {
  const { t, i18n } = useTranslation();
  const [message, setMessage] = useState('');

  const close = () => {
    setMessage('');
    onHide();
  };

  const submit = async (event) => {
    event.preventDefault();
    if (await run('Requesting an application', () => requestApplication(message, i18n.language).then(() => true))) {
      close();
    }
  };

  return (
    <Modal show={show} onHide={close} size="md" aria-labelledby="request-app-title" centered id="request-app-complete">
      <Modal.Header closeButton>
        <Modal.Title id="request-app-title">{t('request-app')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={submit} id="form-main-user-request">
          <Row>
            <Col xs={12}>
              <label htmlFor="request-message">{t('request-message')}</label>
            </Col>
            <Col xs={12}>
              <input
                type="text"
                id="request-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Button type="submit" variant="primary" disabled={!message.trim()}>
                {t('submit')}
              </Button>
            </Col>
          </Row>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default RequestAppModal;
