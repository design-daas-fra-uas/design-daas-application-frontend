import { useState } from 'react';
import { Button, Col, Modal, Row, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { getFile } from './dashboardApi';

const DETAIL_FIELDS = [
  ['details-files-id', 'id'],
  ['details-files-localpath', 'localpath', 'text-detail-path'],
  ['details-files-name', 'name'],
  ['details-files-os-type', 'os_type'],
  ['details-files-remotepath', 'remotepath', 'text-detail-path'],
  ['details-files-version', 'version'],
];

function FileList({ files, onDetails }) {
  const { t } = useTranslation();
  if (files.length === 0) {
    return <p className="text-left">{t('no-data-available')}</p>;
  }
  return files.map((file) => (
    <Row key={file.id}>
      <Col xs={12} className="text-left">
        {t('details-files-name') + ': ' + file.id}
      </Col>
      <Col xs={12}>
        <Button variant="primary" onClick={() => onDetails(file.id)}>
          {t('details-files')}
        </Button>
      </Col>
    </Row>
  ));
}

// The user's own and the shared files, each with a details dialog.
function FilesModal({ show, onHide, ownFiles, sharedFiles, run }) {
  const { t } = useTranslation();
  // null: details closed; {}: loading or failed; otherwise the file.
  const [details, setDetails] = useState(null);

  const showDetails = async (id) => {
    setDetails({});
    setDetails((await run('Loading file details', () => getFile(id))) ?? {});
  };

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" aria-labelledby="all-files-title" centered id="all-files-view">
        <Modal.Header closeButton>
          <Modal.Title id="all-files-title">{t('all-available-files')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="own-files" id="files-view">
            <Tab eventKey="own-files" title={t('own-files')}>
              <FileList files={ownFiles} onDetails={showDetails} />
            </Tab>
            <Tab eventKey="shared-files" title={t('shared-files')}>
              <FileList files={sharedFiles} onDetails={showDetails} />
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
      <Modal
        show={details !== null}
        onHide={() => setDetails(null)}
        size="md"
        aria-labelledby="file-details-title"
        centered
        id="all-files-details-view"
      >
        <Modal.Header closeButton>
          <Modal.Title id="file-details-title">{t('details-files')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {details && Object.keys(details).length > 0 ? (
            <Row>
              {DETAIL_FIELDS.map(([label, key, className = '']) => (
                <Col key={key} xs={12} className={`text-left ${className}`.trim()}>
                  {t(label) + ': ' + details[key]}
                </Col>
              ))}
            </Row>
          ) : (
            <p className="text-left">{t('no-data-available')}</p>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default FilesModal;
