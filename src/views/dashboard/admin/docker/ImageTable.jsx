import { Fragment, useMemo, useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { getImages } from '../../../../api/docker';
import AsyncContent from '../../../../components/AsyncContent';
import useResource from '../../../../hooks/useResource';
import { formatBytes } from '../../status/format';
import { formatDate, toImageRows } from './dockerFormat';

// What a developer looks for when opening one image; the raw inspect output is not shown.
function ImageDetails({ row }) {
  const { t } = useTranslation();
  const config = row.attrs.Config ?? {};
  const facts = [
    ['docker-image-id', row.attrs.Id],
    ['docker-image-command', [...(config.Entrypoint ?? []), ...(config.Cmd ?? [])].join(' ')],
    ['docker-image-ports', Object.keys(config.ExposedPorts ?? {}).join(', ')],
    ['docker-image-workdir', config.WorkingDir],
    ['docker-image-platform', row.platform],
    ['docker-image-built-with', row.attrs.DockerVersion],
  ].filter(([, value]) => value);

  return (
    <dl className="detail-list">
      {facts.map(([key, value]) => (
        <Fragment key={key}>
          <dt>{t(key)}</dt>
          <dd>{value}</dd>
        </Fragment>
      ))}
    </dl>
  );
}

function ImageTable() {
  const { t } = useTranslation();
  const { data, status, reload } = useResource(getImages);
  const [query, setQuery] = useState('');
  const [openKey, setOpenKey] = useState(null);

  const rows = useMemo(() => toImageRows(data), [data]);
  const visible = rows.filter((row) => row.fullTag.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <AsyncContent status={status} onRetry={reload}>
      {() => (
        <>
          <div className="section-toolbar">
            <Form.Control
              type="search"
              placeholder={t('docker-search-images')}
              aria-label={t('docker-search-images')}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="search-input"
            />
            <span className="text-muted small">{t('docker-count', { shown: visible.length, total: rows.length })}</span>
            <Button variant="outline-primary" size="sm" onClick={() => reload()}>
              <i className="fa-solid fa-arrows-rotate me-2" aria-hidden="true" />
              {t('refresh')}
            </Button>
          </div>
          {visible.length === 0 ? (
            <p className="empty-state">{t('no-data-available')}</p>
          ) : (
            <Table hover responsive className="data-table">
              <thead>
                <tr>
                  <th>{t('docker-image-name')}</th>
                  <th>{t('docker-image-tag')}</th>
                  <th className="text-end">{t('docker-image-size')}</th>
                  <th>{t('docker-image-created')}</th>
                  <th>{t('docker-id')}</th>
                  <th aria-label={t('information')} />
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => (
                  <Fragment key={row.key}>
                    <tr>
                      <td className="fw-medium">{row.name}</td>
                      <td>{row.tag && <span className="tag-pill">{row.tag}</span>}</td>
                      <td className="text-end text-nowrap">{formatBytes(row.size)}</td>
                      <td className="text-nowrap">{formatDate(row.created)}</td>
                      <td>
                        <code>{row.id}</code>
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="icon-button"
                          aria-expanded={openKey === row.key}
                          aria-label={`${t('information')} ${row.fullTag}`}
                          onClick={() => setOpenKey(openKey === row.key ? null : row.key)}
                        >
                          <i
                            className={`fa-solid ${openKey === row.key ? 'fa-chevron-up' : 'fa-chevron-down'}`}
                            aria-hidden="true"
                          />
                        </button>
                      </td>
                    </tr>
                    {openKey === row.key && (
                      <tr className="detail-row">
                        <td colSpan={6}>
                          <ImageDetails row={row} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}
    </AsyncContent>
  );
}

export default ImageTable;
