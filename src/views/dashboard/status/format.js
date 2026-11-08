const UNITS = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];

// 28884901888 -> "26.9 GiB"
export const formatBytes = (bytes) => {
  let value = Number(bytes) || 0;
  let unit = 0;
  while (value >= 1024 && unit < UNITS.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${unit === 0 ? value : value.toFixed(1)} ${UNITS[unit]}`;
};

export const formatAmount = (value, unit) => (unit === 'bytes' ? formatBytes(value) : String(value));

// Share of the limit in percent (0..100); 0 without a limit.
export const usagePercent = (used, limit) => (limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0);

// Bootstrap colour of a usage bar.
export const usageVariant = (percent) => {
  if (percent >= 100) {
    return 'danger';
  }
  return percent >= 80 ? 'warning' : 'success';
};
