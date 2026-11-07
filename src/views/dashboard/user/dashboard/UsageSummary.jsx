import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

// "used/max (Max)"; the backend stores "no limit" as a negative max (-1).
export const formatUsage = (used, max, t) => (Number(max) < 0 ? `${used} (${t('no-limit')})` : `${used}/${max} (Max)`);

const USAGE = [
  ['count-vm-max', 'object_vms', 'vm_max'],
  ['count-container-max', 'object_images', 'container_max'],
  ['count-objects-max', 'objects', 'obj_max'],
];

// Used vs. allowed VMs, containers and objects.
function UsageSummary({ utilized, available }) {
  const { t } = useTranslation();
  return (
    <Row>
      {USAGE.map(([label, usedKey, maxKey]) => (
        <Col key={label} xs={12} md={6} lg={4} className="text-center">
          {t(label)} {formatUsage(utilized[usedKey], available[maxKey], t)}
        </Col>
      ))}
    </Row>
  );
}

export default UsageSummary;
