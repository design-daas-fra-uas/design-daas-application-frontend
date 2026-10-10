import React, { useRef } from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

// Shows the details of the selected user/admin ({ name, email }).
// `user === null` means the modal is closed.
function UserInfoModal({ user: currentUser, onHide }) {
  const { t } = useTranslation();
  // Keep showing the last user while the modal fades out.
  const lastUser = useRef(null);
  if (currentUser) {
    lastUser.current = currentUser;
  }
  const user = currentUser ?? lastUser.current;

  return (
    <Modal show={Boolean(currentUser)} onHide={onHide} size="lg" aria-labelledby="user-info-modal-title" centered>
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