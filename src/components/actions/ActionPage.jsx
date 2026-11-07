import { Col, Container, Row, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import useRequestAlert from '../../hooks/useRequestAlert';
import { ROUTES } from '../../routes';
import BackLink from '../BackLink';
import Header from '../header';
import RequestAlert from '../RequestAlert';
import ActionPanel from './ActionPanel';

// Tab title: an i18n key, or [key, detailKey] for "Key (Detail)".
const tabTitle = (title, t) => (Array.isArray(title) ? `${t(title[0])} (${t(title[1])})` : t(title));

// Admin page with one tab per backend action. Each action is
// `{ key, title, endpoint, fields, ... }` (see useDaasAction and ./fields);
// an action with `content` shows that element instead of a form.
function ActionPage({ id, title, tabsId, actions, backTo = ROUTES.admin.root }) {
  const { t } = useTranslation();
  const { requestAlert, showRequestAlert } = useRequestAlert();

  return (
    <>
      <Header />
      <Container id={id} className="page">
        <Row>
          <Col xs={12} className="text-center">
            <h2 className="page-title">{title}</h2>
          </Col>
        </Row>
        <div className="panel panel-tabs">
          <Tabs defaultActiveKey={actions[0].key} id={tabsId}>
            {actions.map((action) => (
              <Tab key={action.key} eventKey={action.key} title={tabTitle(action.title, t)}>
                {action.content || <ActionPanel action={action} showRequestAlert={showRequestAlert} />}
              </Tab>
            ))}
          </Tabs>
        </div>
        <Row>
          <Col xs={12}>
            <RequestAlert alert={requestAlert} />
          </Col>
        </Row>
        <Row>
          <BackLink to={backTo} />
        </Row>
      </Container>
    </>
  );
}

export default ActionPage;
