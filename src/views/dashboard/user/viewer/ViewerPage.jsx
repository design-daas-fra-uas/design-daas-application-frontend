import { Col, Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import LoadingSpinner from '../../../../assets/animation/loadingspinner.svg';
import Header from '../../../../components/header';
import RequestAlert from '../../../../components/RequestAlert';
import ViewerFrame from '../../../../components/ViewerFrame';
import useViewerSession from './useViewerSession';

// Full-width page around a remote desktop viewer: loading spinner while the
// session starts, an error message if it fails, then the viewer itself.
function ViewerPage({ id, start }) {
  const { t } = useTranslation();
  const { status, viewerRequest, requestAlert } = useViewerSession(start);

  return (
    <>
      <Header />
      <Container fluid id={id}>
        {status === 'failed' && (
          <Row>
            <Col xs={12} className="text-center" role="alert">
              {t('error-message-user')}
            </Col>
          </Row>
        )}
        {status === 'loading' && (
          <Row>
            <Col xs={12}>
              <img src={LoadingSpinner} alt={t('loading')} className="loading-spinner" />
            </Col>
          </Row>
        )}
        <Row>
          <Col xs={12}>
            <ViewerFrame request={viewerRequest} />
          </Col>
        </Row>
      </Container>
      <Container className="user-app-env-view">
        <Row>
          <Col xs={12}>
            <RequestAlert alert={requestAlert} />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ViewerPage;
