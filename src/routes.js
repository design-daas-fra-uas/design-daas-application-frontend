const ADMIN = '/dashboard/admin';
const ADMIN_SETTINGS = `${ADMIN}/settings`;

const detail = (base) => (id) => `${base}/${encodeURIComponent(id)}`;

// Central place for route paths so views never hard-code (or forget to
// encode) them.
export const ROUTES = {
  login: '/',
  registration: '/registration',
  dashboard: '/dashboard',
  user: {
    applicationRun: '/dashboard/applicationRun',
    environmentRun: '/dashboard/environmentRun',
    connectionRun: '/dashboard/connectionRun',
    sharedRun: '/dashboard/sharedRun',
    monitoring: '/dashboard/monitoring',
    quota: '/dashboard/quota',
    startApplication: '/dashboard/startApplication',
    instanceRun: '/dashboard/instanceRun',
    expertBaseImage: '/dashboard/expert-mode-base-image',
    expertEnvironment: '/dashboard/expert-mode-environment',
    expertEnvironmentEdit: '/dashboard/expert-mode-environment-edit',
    expertStartSystem: '/dashboard/expert-mode-start-system',
  },
  expert: {
    startEnvironment: '/dashboard/startEnvironment',
  },
  admin: {
    root: ADMIN,
    settings: ADMIN_SETTINGS,
    monitoring: `${ADMIN}/monitoring`,
    status: `${ADMIN}/status`,
    limitation: `${ADMIN}/limitation`,
    tasks: `${ADMIN}/tasks`,
    users: `${ADMIN_SETTINGS}/users`,
    userDetail: detail(`${ADMIN_SETTINGS}/users`),
    admins: `${ADMIN_SETTINGS}/admins`,
    adminDetail: detail(`${ADMIN_SETTINGS}/admins`),
    desktops: `${ADMIN_SETTINGS}/desktops`,
    desktopDetail: detail(`${ADMIN_SETTINGS}/desktops`),
    desktopGroups: `${ADMIN_SETTINGS}/desktop-groups`,
    permissions: `${ADMIN_SETTINGS}/permissions`,
    vmEnvironment: `${ADMIN_SETTINGS}/vm-environment`,
    nodeConfiguration: `${ADMIN_SETTINGS}/node-configuration`,
    connections: `${ADMIN_SETTINGS}/connections`,
    instances: `${ADMIN_SETTINGS}/instances`,
    docker: `${ADMIN_SETTINGS}/docker`,
    phases: `${ADMIN_SETTINGS}/phases`,
    adminAssign: `${ADMIN_SETTINGS}/admin-assign`,
    apps: `${ADMIN_SETTINGS}/apps`,
    files: `${ADMIN_SETTINGS}/files`,
  },
};

// Link groups of the admin dashboard: a title and an icon per group and per link
// (Font Awesome names, translation keys joined with ' / ').
export const ADMIN_SECTIONS = [
  {
    titleKey: 'admin-section-access',
    icon: 'fa-user-shield',
    links: [
      { to: ROUTES.admin.permissions, labelKeys: ['permissions'], icon: 'fa-key' },
      { to: ROUTES.admin.limitation, labelKeys: ['limitation'], icon: 'fa-gauge-high' },
    ],
  },
  {
    titleKey: 'admin-section-desktops',
    icon: 'fa-desktop',
    links: [
      { to: ROUTES.admin.desktops, labelKeys: ['desktops'], icon: 'fa-display' },
      { to: ROUTES.admin.desktopGroups, labelKeys: ['desktop-groups'], icon: 'fa-object-group' },
    ],
  },
  {
    titleKey: 'admin-section-monitoring',
    icon: 'fa-chart-line',
    links: [
      { to: ROUTES.admin.monitoring, labelKeys: ['monitoring'], icon: 'fa-chart-area' },
      { to: ROUTES.admin.status, labelKeys: ['status-title'], icon: 'fa-heart-pulse' },
      { to: ROUTES.user.quota, labelKeys: ['quota-title'], icon: 'fa-chart-pie' },
      { to: ROUTES.admin.tasks, labelKeys: ['tasks'], icon: 'fa-list-check' },
    ],
  },
  {
    titleKey: 'admin-section-infrastructure',
    icon: 'fa-server',
    links: [
      { to: ROUTES.admin.vmEnvironment, labelKeys: ['vm-setup'], icon: 'fa-computer' },
      { to: ROUTES.admin.nodeConfiguration, labelKeys: ['vm-node-dhcp', 'vm-node-iptables'], icon: 'fa-network-wired' },
      { to: ROUTES.admin.connections, labelKeys: ['viewer-check'], icon: 'fa-plug' },
      { to: ROUTES.admin.instances, labelKeys: ['vm-instance'], icon: 'fa-play' },
      { to: ROUTES.admin.docker, labelKeys: ['vm-docker'], icon: 'fa-cubes' },
      { to: ROUTES.admin.phases, labelKeys: ['vm-phases'], icon: 'fa-diagram-project' },
    ],
  },
  {
    titleKey: 'admin-section-content',
    icon: 'fa-box-open',
    links: [
      { to: ROUTES.admin.adminAssign, labelKeys: ['admin-assign-object-app'], icon: 'fa-user-tag' },
      { to: ROUTES.admin.apps, labelKeys: ['app-configuration'], icon: 'fa-window-restore' },
      { to: ROUTES.admin.files, labelKeys: ['file-configuration'], icon: 'fa-folder-open' },
    ],
  },
];
