import { Alert, Button, Collapse } from 'react-bootstrap';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getDaemonInfo } from '../../../../api/docker';
import AsyncContent from '../../../../components/AsyncContent';
import ResultView from '../../../../components/actions/ResultView';
import useResource from '../../../../hooks/useResource';
import { formatBytes } from '../../status/format';

// The facts an admin needs from `docker info`; the rest is behind "Show all details".
const FACTS = [
  { key: 'docker-version', icon: 'fa-brands fa-docker', value: (d) => d.ServerVersion },
  {
    key: 'docker-containers',
    icon: 'fa-solid fa-cubes',
    value: (d) => d.Containers,
    detail: (d, t) =>
      t('docker-containers-detail', {
        running: d.ContainersRunning,
        paused: d.ContainersPaused,
        stopped: d.ContainersStopped,
      }),
  },
  { key: 'docker-images', icon: 'fa-solid fa-layer-group', value: (d) => d.Images },
  { key: 'docker-cpus', icon: 'fa-solid fa-microchip', value: (d) => d.NCPU },
  { key: 'docker-memory', icon: 'fa-solid fa-memory', value: (d) => formatBytes(d.MemTotal) },
  { key: 'docker-os', icon: 'fa-brands fa-linux', value: (d) => d.OperatingSystem, detail: (d) => d.Architecture },
  { key: 'docker-kernel', icon: 'fa-solid fa-gears', value: (d) => d.KernelVersion },
  { key: 'docker-storage', icon: 'fa-solid fa-hard-drive', value: (d) => d.Driver, detail: (d) => d.DockerRootDir },
];

function DaemonOverview() {
  const { t } = useTranslation();
  const { data, status, reload } = useResource(getDaemonInfo);
  const [showAll, setShowAll] = useState(false);

  return (
    <AsyncContent status={status} onRetry={reload}>
      {() =>
        typeof data !== 'object' ? (
          <Alert variant="warning">{String(data)}</Alert>
        ) : (
          <>
            <div className="stat-grid">
              {FACTS.map(({ key, icon, value, detail }) => (
                <div key={key} className="stat-card">
                  <div className="stat-card-head">
                    <i className={icon} aria-hidden="true" />
                    <span>{t(key)}</span>
                  </div>
                  <div className="stat-card-value stat-card-value-sm">{value(data) ?? '–'}</div>
                  {detail && <p className="stat-card-note">{detail(data, t)}</p>}
                </div>
              ))}
            </div>
            {data.Warnings?.length > 0 && (
              <Alert variant="warning" className="mt-3">
                <strong>{t('docker-warnings')}</strong>
                <ul className="mb-0">
                  {data.Warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              </Alert>
            )}
            <div className="section-toolbar">
              <Button
                variant="link"
                className="px-0"
                onClick={() => setShowAll((open) => !open)}
                aria-expanded={showAll}
              >
                {showAll ? t('docker-hide-details') : t('docker-show-details')}
              </Button>
              <Button variant="outline-primary" size="sm" onClick={() => reload()}>
                <i className="fa-solid fa-arrows-rotate me-2" aria-hidden="true" />
                {t('refresh')}
              </Button>
            </div>
            <Collapse in={showAll}>
              <div>
                <ResultView data={data} />
              </div>
            </Collapse>
          </>
        )
      }
    </AsyncContent>
  );
}

export default DaemonOverview;
