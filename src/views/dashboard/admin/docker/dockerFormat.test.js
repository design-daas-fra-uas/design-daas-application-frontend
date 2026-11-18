import { cpuPercent, shortId, statusVariant, toContainerRows, toImageRows } from './dockerFormat';

describe('dockerFormat', () => {
  it('shortens image and container ids', () => {
    expect(shortId('sha256:c0842c1d245aa1f426f2')).toBe('c0842c1d245a');
    expect(shortId('5e8e8601616002d95541')).toBe('5e8e86016160');
    expect(shortId(undefined)).toBe('');
  });

  it('turns image list entries into table rows, newest first', () => {
    const rows = toImageRows([
      { name: 'old', tag: 'old:1.0', attrs: { Id: 'sha256:aaa', Size: 10, Created: '2025-01-01T00:00:00Z' } },
      {
        name: 'new',
        tag: 'new:latest',
        attrs: { Id: 'sha256:bbb', Size: 20, Created: '2026-01-01T00:00:00Z', Os: 'linux', Architecture: 'amd64' },
      },
    ]);
    expect(rows.map((r) => r.name)).toEqual(['new', 'old']);
    expect(rows[0]).toMatchObject({
      tag: 'latest',
      fullTag: 'new:latest',
      id: 'bbb',
      size: 20,
      platform: 'linux / amd64',
    });
  });

  it('turns containers into rows with the image tags joined', () => {
    const rows = toContainerRows([
      { name: 'web', id_container: 'abc', status: 'running', info_image: { tag: ['web:latest'] }, stats_mem: {} },
    ]);
    expect(rows[0]).toMatchObject({ name: 'web', status: 'running', image: 'web:latest', cpu: null, memUsed: null });
  });

  it('computes CPU percent from two Docker samples', () => {
    const raw = {
      cpu_stats: { cpu_usage: { total_usage: 300 }, system_cpu_usage: 2000, online_cpus: 4 },
      precpu_stats: { cpu_usage: { total_usage: 100 }, system_cpu_usage: 1000 },
    };
    expect(cpuPercent(raw)).toBe(80);
    expect(cpuPercent({})).toBeNull();
  });

  it('colours the status badge', () => {
    expect(statusVariant('running')).toBe('success');
    expect(statusVariant('paused')).toBe('warning');
    expect(statusVariant('exited')).toBe('secondary');
  });
});
