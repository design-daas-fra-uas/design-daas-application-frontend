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