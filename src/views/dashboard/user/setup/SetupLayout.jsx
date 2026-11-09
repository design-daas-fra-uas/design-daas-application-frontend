import { Accordion, Col, Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import ActionPanel from '../../../../components/actions/ActionPanel';
import Header from '../../../../components/header';
import PageHeader from '../../../../components/PageHeader';
import RequestAlert from '../../../../components/RequestAlert';

// Accordion with one form per configuration step (see configSteps).
export function ConfigSteps({ title, steps, showRequestAlert, disabled }) {
  const { t } = useTranslation();
  return (
    <Row>
      <Col xs={12} className="text-left">
        <h3>{t(title)}</h3>
      </Col>
      <Accordion>
        {steps.map((step, index) => (
          <Accordion.Item key={step.key} eventKey={String(index)}>
            <Accordion.Header>{t(step.title)}</Accordion.Header>
            <Accordion.Body>
              <h4>{t(step.title)}</h4>
              <ActionPanel action={step} showRequestAlert={showRequestAlert} disabled={disabled} />
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Row>
  );
}

// Section heading, optional text and the form of one action.
export function SetupSection({ title, info, action, showRequestAlert, disabled }) {
  const { t } = useTranslation();
  return (
    <Row>
      {title && (
        <Col xs={12} className="text-left">
          <h3>{t(title)}</h3>
        </Col>
      )}
      {info && (
        <Col xs={12} className="text-left">
          {t(info)}
        </Col>
      )}
      <Col xs={12}>
        <ActionPanel action={action} showRequestAlert={showRequestAlert} disabled={disabled} />
      </Col>
    </Row>
  );
}

// Page frame of the expert-mode setup pages. The pages render their own title, so the
// header here only holds the Back button.
export function SetupLayout({ id, requestAlert, backTo, children }) {
  return (
    <>
      <Header />
      <Container id={id} className="page">
        <PageHeader backTo={backTo} />
        {children}
      </Container>
      <Container className="page-footer">
        <Row>
          <Col xs={12}>
            <RequestAlert alert={requestAlert} />
          </Col>
        </Row>
      </Container>
    </>
  );
}
