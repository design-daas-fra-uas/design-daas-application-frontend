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
    <div className="usage-stats">
      {USAGE.map(([label, usedKey, maxKey]) => (
        <div key={label} className="usage-stat">
          <span className="usage-stat-label">{t(label)}</span>
          <span className="usage-stat-value">{formatUsage(utilized[usedKey], available[maxKey], t)}</span>
        </div>
      ))}
    </div>
  );
}

export default UsageSummary;
