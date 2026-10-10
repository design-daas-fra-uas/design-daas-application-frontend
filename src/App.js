import React, { useEffect, useState } from 'react';
import './i18n';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { clearSession, getRole, scheduleTokenRefresh, subscribeToSession } from './auth/tokenManager';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/js/all.js';

import Login from './views/login';
import Error from './views/error';
import Registration from "./views/registration";
/* Dashboard */
import Dashboard from './views/dashboard/dashboard';
/* Admin */
import MainAdmin from "./views/dashboard/admin/mainAdmin";
import Monitoring from './views/dashboard/admin/monitoring';
import SettingsOverview from "./views/dashboard/admin/settingsOverview";
import SettingsUsers from "./views/dashboard/admin/settingsUsers";
import SettingsUsersDetail from "./views/dashboard/admin/settingsUsersDetail";
import SettingsAdmins from "./views/dashboard/admin/settingsAdmins";
import SettingsAdminsDetails from "./views/dashboard/admin/settingsAdminsDetails";
import SettingsVirtualEnvironment from "./views/dashboard/admin/settingsVirtualEnvironment";
import SettingsNode from "./views/dashboard/admin/settingsNode";
import SettingsInstances from "./views/dashboard/admin/settingsInstances";
import SettingsConnection from "./views/dashboard/admin/settingsConnection";
import SettingsDocker from "./views/dashboard/admin/settingsDocker";
import SettingsPhases from "./views/dashboard/admin/settingsPhase";
import Desktops from "./views/dashboard/admin/desktops";
import DesktopDetail from "./views/dashboard/admin/desktopDetail";
import DesktopGroups from "./views/dashboard/admin/desktopGroups";
import SettingsAdminAssign from "./views/dashboard/admin/settingsAdmin";
import SettingsApps from "./views/dashboard/admin/settingsApps";
import SettingsFiles from "./views/dashboard/admin/settingsFiles";
import SettingsTasks from "./views/dashboard/admin/settingsTasks";
import Limitation from "./views/dashboard/admin/limitation";
/* User */
import ApplicationRunning from "./views/dashboard/user/applicationRunning";
import EnvironmentRunning from "./views/dashboard/user/environmentRunning";
import ConnectionRunning from "./views/dashboard/user/connectionRunning";
import SharedRunning from "./views/dashboard/user/sharedRunning";
import ObjectBaseImageSetup from "./views/dashboard/user/objectBaseImageSetup";
import ObjectEnvironmentSetup from "./views/dashboard/user/objectEnvironmentSetup";
import ObjectEnvironmentSetupEdit from "./views/dashboard/user/objectEnvironmentSetupEdit";
import ObjectStartSetup from "./views/dashboard/user/objectStartSetup";
import MonitoringUser from "./views/dashboard/user/monitoringUser";
/* Expert */
import StartEnvironment from "./views/dashboard/expert/startEnvironment";

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
    <>
      <Router>
        <Routes>
          {
            userRole === "user"
              ?
                <>
                  <Route path="/dashboard/applicationRun" element={<ApplicationRunning/>} />
                  <Route path="/dashboard/environmentRun" element={<EnvironmentRunning/>} />
                  <Route path="/dashboard/connectionRun" element={<ConnectionRunning/>} />
                  <Route path="/dashboard/sharedRun" element={<SharedRunning/>} />
                  <Route path="/dashboard/expert-mode-base-image" element={<ObjectBaseImageSetup/> } />
                  <Route path="/dashboard/expert-mode-environment" element={<ObjectEnvironmentSetup/> } />
                  <Route path="/dashboard/expert-mode-environment-edit" element={<ObjectEnvironmentSetupEdit/> } />
                  <Route path="/dashboard/expert-mode-start-system" element={<ObjectStartSetup/> } />
                  <Route path="/dashboard/monitoring" element={<MonitoringUser/> } />
                </>
              :
                <Route path="*" element={<Navigate replace to="/" />} />
          }
          {
            userRole === "expert"
              ?
                <>
                  <Route path="/dashboard/startEnvironment" element={<StartEnvironment/>} />
                </>
              :
                <Route path="*" element={<Navigate replace to="/" />} />
          }
          {
            userRole === "admin"
              ?
                <>
                  <Route path="/dashboard/admin" element={<MainAdmin />} />
                  <Route path="/dashboard/admin/monitoring" element={<Monitoring />} />
                  <Route path="/dashboard/admin/limitation" element={<Limitation />} />
                  <Route path="/dashboard/admin/tasks" element={<SettingsTasks />}/>
                  <Route path="/dashboard/admin/settings" element={<SettingsOverview />}/>
                  <Route path="/dashboard/admin/settings/vm-environment" element={<SettingsVirtualEnvironment />}/>
                  <Route path="/dashboard/admin/settings/node-configuration" element={<SettingsNode />}/>
                  <Route path="/dashboard/admin/settings/instances" element={<SettingsInstances />}/>
                  <Route path="/dashboard/admin/settings/connections" element={<SettingsConnection />}/>
                  <Route path="/dashboard/admin/settings/docker" element={<SettingsDocker />}/>
                  <Route path="/dashboard/admin/settings/phases" element={<SettingsPhases />}/>
                  <Route path="/dashboard/admin/settings/users" element={<SettingsUsers />}/>
                  <Route path="/dashboard/admin/settings/users/:id" element={<SettingsUsersDetail />}/>
                  <Route path="/dashboard/admin/settings/admins" element={<SettingsAdmins />}/>
                  <Route path="/dashboard/admin/settings/admins/:id" element={<SettingsAdminsDetails />}/>
                  <Route path="/dashboard/admin/settings/desktops" element={<Desktops />}/>
                  <Route path="/dashboard/admin/settings/desktops/:id" element={<DesktopDetail />}/>
                  <Route path="/dashboard/admin/settings/desktop-groups" element={<DesktopGroups />}/>
                  <Route path="/dashboard/admin/settings/admin-assign" element={<SettingsAdminAssign />}/>
                  <Route path="/dashboard/admin/settings/apps" element={<SettingsApps />}/>
                  <Route path="/dashboard/admin/settings/files" element={<SettingsFiles />}/>

                  <Route path="/dashboard/applicationRun" element={<ApplicationRunning/>} />
                  <Route path="/dashboard/environmentRun" element={<EnvironmentRunning/>} />
                  <Route path="/dashboard/connectionRun" element={<ConnectionRunning/>} />
                  <Route path="/dashboard/sharedRun" element={<SharedRunning/>} />
                  <Route path="/dashboard/expert-mode-base-image" element={<ObjectBaseImageSetup/> } />
                  <Route path="/dashboard/expert-mode-environment" element={<ObjectEnvironmentSetup/> } />
                  <Route path="/dashboard/expert-mode-environment-edit" element={<ObjectEnvironmentSetupEdit/> } />
                  <Route path="/dashboard/expert-mode-start-system" element={<ObjectStartSetup/> } />
                </>
              :
                <Route path="*" element={<Navigate replace to="/" />} />
          }
          {
            userRole
              ?
                <Route path="/dashboard" element={<Dashboard />}/>
              :
                <Route path="*" element={<Navigate replace to="/" />} />
          }
          <Route path="/registration" element={<Registration />} />
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Error />}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
