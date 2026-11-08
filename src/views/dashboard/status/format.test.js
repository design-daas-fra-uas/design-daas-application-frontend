import { formatAmount, formatBytes, usagePercent, usageVariant } from './format';

describe('format', () => {
  it('formats bytes with binary units', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(2048)).toBe('2.0 KiB');
    expect(formatBytes(28884901888)).toBe('26.9 GiB');
    expect(formatBytes('x')).toBe('0 B');
  });

  it('formats counts as they are', () => {
    expect(formatAmount(3, 'count')).toBe('3');
    expect(formatAmount(1024, 'bytes')).toBe('1.0 KiB');
  });

  it('computes the share of the limit, capped at 100', () => {
    expect(usagePercent(1, 4)).toBe(25);
    expect(usagePercent(9, 4)).toBe(100);
    expect(usagePercent(1, 0)).toBe(0);
  });

  it('colours the bar by usage', () => {
    expect(usageVariant(10)).toBe('success');
    expect(usageVariant(80)).toBe('warning');
    expect(usageVariant(100)).toBe('danger');
  });
});
