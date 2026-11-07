// Describes what the monitoring pages load and show, so the pages themselves
// stay free of per-category copy/paste.

const USAGE_FIELDS = ['amount', 'cpus', 'disk_in', 'disk_out', 'disk_size', 'mem_max', 'mem_use', 'net_in', 'net_out'];
const LIMIT_FIELDS = ['container_max', 'cpu_max', 'dsk_max', 'id_owner', 'mem_max', 'obj_max', 'vm_max'];

// Fields shown for each record; `json` values are stringified, `wrap` values
// may break anywhere (long paths).
export const RECORD_FIELDS = {
  tasks: [
    'id_instance',
    'id_object',
    'id_owner',
    'id_task',
    { name: 'result', json: true, wrap: true },
    'task_purpose',
    'task_state',
    'task_type',
  ],
  files: [
    'created_at',
    'filesize',
    'id',
    'id_owner',
    { name: 'localpath', wrap: true },
    'name',
    'os_type',
    'remotepath',
    'version',
  ],
  apps: [
    'created_at',
    'id',
    'id_file',
    'id_owner',
    'id_template',
    { name: 'installer', wrap: true },
    'installer_args',
    'installer_type',
    'name',
    'os_type',
    'target',
    'target_args',
    'version',
  ],
  hosts: [
    'available_cpus',
    'available_disk_ceph',
    'available_disk_images',
    'available_disk_iso',
    'available_disk_local',
    'available_memory',
    'inuse_cpus',
    'inuse_disk_ceph',
    'inuse_disk_images',
    'inuse_disk_iso',
    'inuse_disk_local',
    'inuse_memory',
  ],
  utilization: [
    'instance_images',
    'instance_vms',
    'instances',
    'max_cpus',
    'max_diskspace',
    'max_memory',
    'object_images',
    'object_vms',
    'objects',
    'utilized_cpus',
    'utilized_diskspace',
    'utilized_memory',
  ],
  usage: USAGE_FIELDS,
  limit: LIMIT_FIELDS,
};

// Object usage groups, in display order.
export const USAGE_GROUPS = ['both', 'container', 'vms'].flatMap((kind) =>
  ['offline', 'online', 'total'].map((state) => `${kind}_usage_${state}`),
);

// One entry per monitoring category: backend endpoint suffix, where the data
// sits in `response_data`, its empty value and the translation key of its title.
export const CATEGORIES = [
  { key: 'tasks', endpoint: 'get_monitor_info_tasks', path: 'all', empty: [], title: 'task-monitoring' },
  { key: 'files', endpoint: 'get_monitor_info_files', path: 'all', empty: [], title: 'file-monitoring' },
  { key: 'apps', endpoint: 'get_monitor_info_apps', path: 'app_list', empty: [], title: 'app-monitoring' },
  { key: 'sockets', endpoint: 'get_monitor_info_websockets', empty: {}, title: 'socket-monitoring' },
  // Host data is global, it is never filtered by owner.
  { key: 'hosts', endpoint: 'get_monitor_info_host', empty: {}, title: 'host-monitoring', global: true },
  { key: 'objects', endpoint: 'get_monitor_info_objects', empty: {}, title: 'object-monitoring' },
  { key: 'utilization', endpoint: 'get_monitor_info_utilization', empty: {}, title: 'utilization-monitoring' },
  { key: 'limits', endpoint: 'get_monitor_info_limits', empty: {}, title: 'limit-monitoring' },
];

export const EMPTY_MONITORING = Object.fromEntries(CATEGORIES.map(({ key, empty }) => [key, empty]));

// Scopes: the logged-in user's own data, all data (admin) or one owner (admin).
export const SCOPES = {
  user: { prefix: '/monitoring', body: () => ({}) },
  admin: { prefix: '/admin', body: () => ({ id_owner: '' }) },
  owner: { prefix: '/admin', body: (ownerId) => ({ id_owner: ownerId }) },
};
