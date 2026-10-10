import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/js/all.js';
import './App.css';

import './i18n';
import { clearSession, getRole, scheduleTokenRefresh, subscribeToSession } from './auth/tokenManager';
import { ROUTES } from './routes';

import Login from './views/login';
import NotFound from './views/error';
import Registration from './views/registration';

const Dashboard = lazy(() => import('./views/dashboard/dashboard'));

/* Admin */
const MainAdmin = lazy(() => import('./views/dashboard/admin/mainAdmin'));
const Monitoring = lazy(() => import('./views/dashboard/admin/monitoring'));
const SettingsOverview = lazy(() => import('./views/dashboard/admin/settingsOverview'));
const SettingsUsers = lazy(() => import('./views/dashboard/admin/settingsUsers'));
const SettingsUsersDetail = lazy(() => import('./views/dashboard/admin/settingsUsersDetail'));
const SettingsAdmins = lazy(() => import('./views/dashboard/admin/settingsAdmins'));
const SettingsAdminsDetails = lazy(() => import('./views/dashboard/admin/settingsAdminsDetails'));
const SettingsVirtualEnvironment = lazy(() => import('./views/dashboard/admin/settingsVirtualEnvironment'));
const SettingsNode = lazy(() => import('./views/dashboard/admin/settingsNode'));
const SettingsInstances = lazy(() => import('./views/dashboard/admin/settingsInstances'));
const SettingsConnection = lazy(() => import('./views/dashboard/admin/settingsConnection'));
const SettingsDocker = lazy(() => import('./views/dashboard/admin/settingsDocker'));
const SettingsPhases = lazy(() => import('./views/dashboard/admin/settingsPhase'));
const Desktops = lazy(() => import('./views/dashboard/admin/desktops'));
const DesktopDetail = lazy(() => import('./views/dashboard/admin/desktopDetail'));
const DesktopGroups = lazy(() => import('./views/dashboard/admin/desktopGroups'));
const SettingsAdminAssign = lazy(() => import('./views/dashboard/admin/settingsAdmin'));
const SettingsApps = lazy(() => import('./views/dashboard/admin/settingsApps'));
const SettingsFiles = lazy(() => import('./views/dashboard/admin/settingsFiles'));
const SettingsTasks = lazy(() => import('./views/dashboard/admin/settingsTasks'));
const Limitation = lazy(() => import('./views/dashboard/admin/limitation'));

/* User */
const ApplicationRunning = lazy(() => import('./views/dashboard/user/applicationRunning'));
const EnvironmentRunning = lazy(() => import('./views/dashboard/user/environmentRunning'));
const ConnectionRunning = lazy(() => import('./views/dashboard/user/connectionRunning'));
const SharedRunning = lazy(() => import('./views/dashboard/user/sharedRunning'));
const ObjectBaseImageSetup = lazy(() => import('./views/dashboard/user/objectBaseImageSetup'));
const ObjectEnvironmentSetup = lazy(() => import('./views/dashboard/user/objectEnvironmentSetup'));
const ObjectEnvironmentSetupEdit = lazy(() => import('./views/dashboard/user/objectEnvironmentSetupEdit'));
const ObjectStartSetup = lazy(() => import('./views/dashboard/user/objectStartSetup'));
const MonitoringUser = lazy(() => import('./views/dashboard/user/monitoringUser'));

/* Expert */
const StartEnvironment = lazy(() => import('./views/dashboard/expert/startEnvironment'));

// Pages shared by the "user" and "admin" roles.
const RUN_ROUTES = [
  [ROUTES.user.applicationRun, ApplicationRunning],
  [ROUTES.user.environmentRun, EnvironmentRunning],
  [ROUTES.user.connectionRun, ConnectionRunning],
  [ROUTES.user.sharedRun, SharedRunning],
  [ROUTES.user.expertBaseImage, ObjectBaseImageSetup],
  [ROUTES.user.expertEnvironment, ObjectEnvironmentSetup],
  [ROUTES.user.expertEnvironmentEdit, ObjectEnvironmentSetupEdit],
  [ROUTES.user.expertStartSystem, ObjectStartSetup],
];

const USER_ROUTES = [[ROUTES.user.monitoring, MonitoringUser]];

const EXPERT_ROUTES = [[ROUTES.expert.startEnvironment, StartEnvironment]];

const ADMIN_ROUTES = [
  [ROUTES.admin.root, MainAdmin],
  [ROUTES.admin.monitoring, Monitoring],
  [ROUTES.admin.limitation, Limitation],
  [ROUTES.admin.tasks, SettingsTasks],
  [ROUTES.admin.settings, SettingsOverview],
  [ROUTES.admin.vmEnvironment, SettingsVirtualEnvironment],
  [ROUTES.admin.nodeConfiguration, SettingsNode],
  [ROUTES.admin.instances, SettingsInstances],
  [ROUTES.admin.connections, SettingsConnection],
  [ROUTES.admin.docker, SettingsDocker],
  [ROUTES.admin.phases, SettingsPhases],
  [ROUTES.admin.users, SettingsUsers],
  [`${ROUTES.admin.users}/:id`, SettingsUsersDetail],
  [ROUTES.admin.admins, SettingsAdmins],
  [`${ROUTES.admin.admins}/:id`, SettingsAdminsDetails],
  [ROUTES.admin.desktops, Desktops],
  [`${ROUTES.admin.desktops}/:id`, DesktopDetail],
  [ROUTES.admin.desktopGroups, DesktopGroups],
  [ROUTES.admin.adminAssign, SettingsAdminAssign],
  [ROUTES.admin.apps, SettingsApps],
  [ROUTES.admin.files, SettingsFiles],
];

// Renders the nested routes only for a logged-in user whose role is allowed
// (any logged-in role when `roles` is omitted); everyone else goes to the login page.
function RequireRole({ role, roles }) {
  const allowed = Boolean(role) && (!roles || roles.includes(role));
  return allowed ? <Outlet /> : <Navigate replace to={ROUTES.login} />;
}

const renderRoutes = (routes) => routes.map(([path, Page]) => <Route key={path} path={path} element={<Page />} />);

function PageFallback() {
  const { t } = useTranslation();
  return <p role="status">{t('loading', 'Loading...')}</p>;
}

function App() {
  const [userRole, setUserRole] = useState(getRole);

  useEffect(() => subscribeToSession(() => setUserRole(getRole())), []);

  // Silent token refresh for the whole logged-in session. When it fails the
  // session is cleared, which updates userRole and the route guards redirect to login.
  useEffect(() => {
    if (!userRole) {
      return undefined;
    }
    return scheduleTokenRefresh(() => clearSession());
  }, [userRole]);

  return (
    <Router>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path={ROUTES.login} element={<Login />} />
          <Route path={ROUTES.registration} element={<Registration />} />

          <Route element={<RequireRole role={userRole} />}>
            <Route path={ROUTES.dashboard} element={<Dashboard />} />
          </Route>
          <Route element={<RequireRole role={userRole} roles={['user', 'admin']} />}>{renderRoutes(RUN_ROUTES)}</Route>
          <Route element={<RequireRole role={userRole} roles={['user']} />}>{renderRoutes(USER_ROUTES)}</Route>
          <Route element={<RequireRole role={userRole} roles={['expert']} />}>{renderRoutes(EXPERT_ROUTES)}</Route>
          <Route element={<RequireRole role={userRole} roles={['admin']} />}>{renderRoutes(ADMIN_ROUTES)}</Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
