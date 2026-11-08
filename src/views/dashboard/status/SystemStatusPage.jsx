import { Badge, Row, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { getSystemStatus } from '../../../api/monitoring';
import AsyncContent from '../../../components/AsyncContent';
import BackLink from '../../../components/BackLink';
import PageLayout from '../../../components/PageLayout';
import RefreshButton from '../../../components/RefreshButton';
import useResource from '../../../hooks/useResource';
import { ROUTES } from '../../../routes';

const STATE_VARIANT = { up: 'success', down: 'danger', disabled: 'secondary' };

function StateBadge({ state }) {
  const { t } = useTranslation();
  return <Badge bg={STATE_VARIANT[state] ?? 'secondary'}>{t(`status-${state}`, state)}</Badge>;
}

// Health of the whole stack for admins, the same parts as `make status`:
// DaaS backend, auth service (Spring actuator), service containers, frontend.
function SystemStatusPage() {
  const { t } = useTranslation();
  const { data, status, reload } = useResource(getSystemStatus);

  return (
    <PageLayout id="system-status" title={t('status-title')}>
      <AsyncContent status={status} onRetry={reload}>
        {() => (
          <>
            <p className="text-center">
              {t('status-overall')} <StateBadge state={data.state} />
            </p>
            <Table striped bordered responsive>
              <thead>
                <tr>
                  <th>{t('status-component')}</th>
                  <th>{t('status-kind')}</th>
                  <th>{t('status-state')}</th>
                  <th>{t('status-detail')}</th>
                </tr>
              </thead>
              <tbody>
                {data.components.map((component) => (
                  <tr key={component.name}>
                    <td>{component.name}</td>
                    <td>{component.kind}</td>
                    <td>
                      <StateBadge state={component.state} />
                    </td>
                    <td>{component.detail}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </AsyncContent>
      <Row>
        <BackLink to={ROUTES.admin.root} />
      </Row>
      <RefreshButton onClick={() => reload()} />
    </PageLayout>
  );
}

export default SystemStatusPage;
