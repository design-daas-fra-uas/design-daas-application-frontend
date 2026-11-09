// Turns raw Docker data (as returned by the DaaS backend) into what the Docker page shows.

// "sha256:c0842c1d245a..." -> "c0842c1d245a"
export const shortId = (id) =>
  String(id ?? '')
    .replace(/^sha256:/, '')
    .slice(0, 12);

// "2026-11-09T19:24:12.34Z" -> local date and time, or '' when missing/invalid.
export const formatDate = (iso) => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString();
};

// One row per image tag, newest first.
export const toImageRows = (images) =>
  (images ?? [])
    .map(({ name, tag, attrs = {} }) => ({
      key: `${attrs.Id}-${tag}`,
      name,
      tag: String(tag ?? '').includes(':') ? String(tag).split(':').pop() : '',
      fullTag: String(tag ?? ''),
      id: shortId(attrs.Id),
      size: attrs.Size ?? 0,
      created: attrs.Created ?? '',
      platform: [attrs.Os, attrs.Architecture].filter(Boolean).join(' / '),
      attrs,
    }))
    .sort((a, b) => String(b.created).localeCompare(String(a.created)));

// Percent of the host CPU a container used between Docker's two samples, or null.
export const cpuPercent = (raw) => {
  const cpu = raw?.cpu_stats;
  const pre = raw?.precpu_stats;
  if (!cpu?.cpu_usage || !pre?.cpu_usage) {
    return null;
  }
  const cpuDelta = cpu.cpu_usage.total_usage - pre.cpu_usage.total_usage;
  const systemDelta = cpu.system_cpu_usage - pre.system_cpu_usage;
  const cpus = cpu.online_cpus || cpu.cpu_usage.percpu_usage?.length || 1;
  if (!(systemDelta > 0) || cpuDelta < 0) {
    return null;
  }
  return Math.round((cpuDelta / systemDelta) * cpus * 1000) / 10;
};

export const toContainerRows = (containers) =>
  (containers ?? [])
    .map((c) => {
      const tags = c.info_image?.tag;
      return {
        key: c.id_container,
        name: c.name,
        status: c.status,
        image: Array.isArray(tags) ? tags.join(', ') : String(tags ?? ''),
        id: shortId(c.id_container),
        cpu: cpuPercent(c.stats_raw),
        memUsed: c.stats_mem?.usage ?? null,
        memLimit: c.stats_mem?.limit ?? null,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

// Bootstrap colour of a container status badge.
export const statusVariant = (status) => {
  if (status === 'running') {
    return 'success';
  }
  if (status === 'paused' || status === 'restarting') {
    return 'warning';
  }
  return 'secondary';
};
