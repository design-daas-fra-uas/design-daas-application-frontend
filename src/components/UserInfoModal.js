import React from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

// Shows the details of the selected user/admin ({ name, email }).
// `user === null` means the modal is closed.
function UserInfoModal({ user, onHide }) {
  const { t } = useTranslation();

  return (
    <Modal show={Boolean(user)} onHide={onHide} size="lg" aria-labelledby="user-info-modal-title" centered>
      <Modal.Header closeButton>
        <Modal.Title id="user-info-modal-title">
          {user?.name} - {t('information')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col xs={12} md={6}>
            {t('email')}
          </Col>
          <Col xs={12} md={6}>
            {user?.email}
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default UserInfoModal;