import { useMemo, useState } from 'react';
import { Badge, Button, Form, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { getContainers } from '../../../../api/docker';
import AsyncContent from '../../../../components/AsyncContent';
import useResource from '../../../../hooks/useResource';
import { formatBytes } from '../../status/format';
import { statusVariant, toContainerRows } from './dockerFormat';

const memoryText = ({ memUsed, memLimit }) =>
  memUsed == null ? '–' : `${formatBytes(memUsed)}${memLimit ? ` / ${formatBytes(memLimit)}` : ''}`;

function ContainerTable() {
  const { t } = useTranslation();
  // Asking Docker for usage takes about a second per container, so it is opt-in.
  const [withStats, setWithStats] = useState(false);
  const { data, status, reload } = useResource((options) => getContainers({ ...options, withStats }), [withStats]);
  const rows = useMemo(() => toContainerRows(data), [data]);

  return (
    <AsyncContent status={status} onRetry={reload}>
      {() => (
        <>
          <div className="section-toolbar">
            <Form.Check
              type="switch"
              id="docker-container-stats"
              label={t('docker-show-usage')}
              checked={withStats}
              onChange={(event) => setWithStats(event.target.checked)}
            />
            <span className="text-muted small">{t('docker-running-count', { count: rows.length })}</span>
            <Button variant="outline-primary" size="sm" onClick={() => reload()}>
              <i className="fa-solid fa-arrows-rotate me-2" aria-hidden="true" />
              {t('refresh')}
            </Button>
          </div>
          {rows.length === 0 ? (
            <p className="empty-state">{t('docker-no-containers')}</p>
          ) : (
            <Table hover responsive className="data-table">
              <thead>
                <tr>
                  <th>{t('docker-container-name')}</th>
                  <th>{t('status', 'Status')}</th>
                  <th>{t('docker-container-image')}</th>
                  <th>{t('docker-id')}</th>
                  {withStats && <th className="text-end">{t('docker-cpu')}</th>}
                  {withStats && <th className="text-end">{t('docker-memory')}</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.key}>
                    <td className="fw-medium">{row.name}</td>
                    <td>
                      <Badge bg={statusVariant(row.status)}>{row.status}</Badge>
                    </td>
                    <td>{row.image}</td>
                    <td>
                      <code>{row.id}</code>
                    </td>
                    {withStats && <td className="text-end">{row.cpu == null ? '–' : `${row.cpu} %`}</td>}
                    {withStats && <td className="text-end text-nowrap">{memoryText(row)}</td>}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}
    </AsyncContent>
  );
}

export default ContainerTable;
