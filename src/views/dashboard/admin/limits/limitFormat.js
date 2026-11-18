import { formatBytes, isUnlimited } from '../../status/format';

const GIB = 1024 ** 3;

// The six limits in display order. Memory and disk are entered in GiB, stored in bytes.
export const LIMIT_FIELDS = [
  { key: 'vm_max', label: 'limit-vms', unit: 'count' },
  { key: 'container_max', label: 'limit-containers', unit: 'count' },
  { key: 'obj_max', label: 'limit-objects', unit: 'count' },
  { key: 'cpu_max', label: 'limit-cpus', unit: 'count' },
  { key: 'mem_max', label: 'limit-memory', unit: 'bytes' },
  { key: 'dsk_max', label: 'limit-disk', unit: 'bytes' },
];

// One limit as text: the "unlimited" text, "12.0 GiB" or "10".
export const formatLimit = (value, unit, unlimitedText) => {
  if (isUnlimited(value)) {
    return unlimitedText;
  }
  return unit === 'bytes' ? formatBytes(value) : String(value);
};

const toShownValue = (value, unit) => {
  if (isUnlimited(value)) {
    return '';
  }
  return unit === 'bytes' ? String(Math.round((value / GIB) * 10) / 10) : String(value);
};

// Stored limit -> form values: { vm_max: '10', vm_max_unlimited: false, mem_max: '12', ... }.
export const toFormValues = (limit) =>
  Object.fromEntries(
    LIMIT_FIELDS.flatMap(({ key, unit }) => [
      [key, toShownValue(limit?.[key], unit)],
      [`${key}_unlimited`, isUnlimited(limit?.[key])],
    ]),
  );

// Form values -> request body for /limits/put_limit.
export const toLimitRequest = (idOwner, values) => ({
  id_owner: Number(idOwner),
  ...Object.fromEntries(
    LIMIT_FIELDS.map(({ key, unit }) => {
      if (values[`${key}_unlimited`]) {
        return [key, -1];
      }
      const number = Number(values[key]);
      return [key, unit === 'bytes' ? Math.round(number * GIB) : Math.round(number)];
    }),
  ),
});
