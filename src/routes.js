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
    limitation: `${ADMIN}/limitation`,
    tasks: `${ADMIN}/tasks`,
    users: `${ADMIN_SETTINGS}/users`,
    userDetail: detail(`${ADMIN_SETTINGS}/users`),
    admins: `${ADMIN_SETTINGS}/admins`,
    adminDetail: detail(`${ADMIN_SETTINGS}/admins`),
    desktops: `${ADMIN_SETTINGS}/desktops`,
    desktopDetail: detail(`${ADMIN_SETTINGS}/desktops`),
    desktopGroups: `${ADMIN_SETTINGS}/desktop-groups`,
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

// Quick-link tiles of the admin dashboard (translation keys joined with ' / ').
export const ADMIN_QUICK_LINKS = [
  { to: ROUTES.admin.desktops, labelKeys: ['desktops'] },
  { to: ROUTES.admin.desktopGroups, labelKeys: ['desktop-groups'] },
  { to: ROUTES.admin.monitoring, labelKeys: ['monitoring'] },
  { to: ROUTES.admin.limitation, labelKeys: ['limitation'] },
  { to: ROUTES.admin.tasks, labelKeys: ['tasks'] },
  { to: ROUTES.admin.vmEnvironment, labelKeys: ['vm-setup'] },
  { to: ROUTES.admin.nodeConfiguration, labelKeys: ['vm-node-dhcp', 'vm-node-iptables'] },
  { to: ROUTES.admin.connections, labelKeys: ['viewer-check'] },
  { to: ROUTES.admin.instances, labelKeys: ['vm-instance'] },
  { to: ROUTES.admin.docker, labelKeys: ['vm-docker'] },
  { to: ROUTES.admin.phases, labelKeys: ['vm-phases'] },
  { to: ROUTES.admin.adminAssign, labelKeys: ['admin-assign-object-app'] },
  { to: ROUTES.admin.apps, labelKeys: ['app-configuration'] },
  { to: ROUTES.admin.files, labelKeys: ['file-configuration'] },
  { to: ROUTES.dashboard, labelKeys: ['dashboard-back'] },
];
