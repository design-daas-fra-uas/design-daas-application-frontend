import { Col, Modal, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { ICON_LEGEND, Icon } from './AppIcons';

// Explains "clone", "create" and the application icons.
function InfoModal({ show, onHide }) {
  const { t } = useTranslation();
  return (
    <Modal show={show} onHide={onHide} size="md" aria-labelledby="info-details-title" centered id="info-details">
      <Modal.Header closeButton>
        <Modal.Title id="info-details-title">{t('info-detail')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          {['clone', 'create'].map((topic) => (
            <Col key={topic} xs={12} className="text-left">
              <h2>{t(`${topic}-headline`)}</h2>
              <div>{t(`${topic}-content`)}</div>
            </Col>
          ))}
          <Col xs={12} className="text-left">
            <h2>{t('icon-headline')}</h2>
          </Col>
          {ICON_LEGEND.map(([icon, text]) => (
            <Col key={icon} xs={12} className="text-left">
              <Icon name={icon} />
              <span className="info-text-space">{t(text)}</span>
            </Col>
          ))}
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default InfoModal;
