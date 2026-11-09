import { useState } from 'react';
import { Nav, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import useRequestAlert from '../../hooks/useRequestAlert';
import { ROUTES } from '../../routes';
import PageLayout from '../PageLayout';
import RequestAlert from '../RequestAlert';
import ActionPanel from './ActionPanel';

// Tab title: an i18n key, or [key, detailKey] for "Key (Detail)".
const tabTitle = (title, t) => (Array.isArray(title) ? `${t(title[0])} (${t(title[1])})` : t(title));

// Several related actions in one tab: a row of pills picks the form shown below.
function ActionGroup({ actions, showRequestAlert }) {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState(actions[0].key);
  const active = actions.find((action) => action.key === activeKey) ?? actions[0];

  return (
    <>
      <Nav variant="pills" className="action-group-nav" activeKey={active.key} onSelect={setActiveKey}>
        {actions.map((action) => (
          <Nav.Item key={action.key}>
            <Nav.Link eventKey={action.key}>{tabTitle(action.title, t)}</Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      <ActionPanel key={active.key} action={active} showRequestAlert={showRequestAlert} />
    </>
  );
}

// Admin page with one tab per backend action. Each action is
// `{ key, title, endpoint, fields, ... }` (see useDaasAction and ./fields);
// an action with `content` shows that element instead of a form, and one with
// `actions` groups several actions in a single tab (see ActionGroup).
function ActionPage({ id, title, tabsId, actions, backTo = ROUTES.admin.root }) {
  const { t } = useTranslation();
  const { requestAlert, showRequestAlert } = useRequestAlert();

  const renderTab = (action) => {
    if (action.content) {
      return action.content;
    }
    if (action.actions) {
      return <ActionGroup actions={action.actions} showRequestAlert={showRequestAlert} />;
    }
    return <ActionPanel action={action} showRequestAlert={showRequestAlert} />;
  };

  return (
    <PageLayout id={id} title={title} backTo={backTo}>
      <RequestAlert alert={requestAlert} />
      <div className="panel panel-tabs">
        <Tabs defaultActiveKey={actions[0].key} id={tabsId} mountOnEnter>
          {actions.map((action) => (
            <Tab key={action.key} eventKey={action.key} title={tabTitle(action.title, t)}>
              {renderTab(action)}
            </Tab>
          ))}
        </Tabs>
      </div>
    </PageLayout>
  );
}

export default ActionPage;
