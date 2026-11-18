import { useCallback, useEffect, useMemo, useState } from 'react';

import { isPermissionDenied } from '../../../../api/denied';
import { getSession } from '../../../../api/session';
import { createLogger } from '../../../../utils/logger';
import { getCurrentUserId, ownedBy } from '../dashboardData';
import { fetchDashboardInfo } from './dashboardApi';

const log = createLogger('UserDashboard');

// Viewer selections of other pages that must not survive a visit to the dashboard.
const VIEWER_SELECTION_KEYS = ['application-viewer-id', 'environment-viewer-id', 'object-viewer-id'];

const EMPTY = [];

// Loads the session (the user id tells own and shared items apart) and then
// the dashboard info. `reload()` refetches the dashboard info.
export default function useUserDashboard() {
  const [info, setInfo] = useState(null);
  // Request error when the dashboard info itself is not permitted
  const [denied, setDenied] = useState(null);
  // False until the first dashboard info request has finished
  const [loaded, setLoaded] = useState(false);
  const [userId, setUserId] = useState(getCurrentUserId);

  const reload = useCallback(
    () =>
      fetchDashboardInfo()
        .then((loaded) => {
          setInfo(loaded);
          setDenied(null);
        })
        .catch((error) => {
          log.error('Loading dashboard info failed', error);
          setDenied(isPermissionDenied(error) ? error : null);
        })
        .finally(() => setLoaded(true)),
    [],
  );

  useEffect(() => {
    VIEWER_SELECTION_KEYS.forEach((key) => localStorage.setItem(key, ''));
    getSession()
      .then((session) => {
        localStorage.setItem('userDataID', session.user_id);
        setUserId(Number(session.user_id));
      })
      .catch((error) => log.error('Loading the user session failed', error))
      .finally(reload);
  }, [reload]);

  return useMemo(() => {
    const applications = info?.available_applications ?? EMPTY;
    const files = info?.available_files ?? EMPTY;
    return {
      info,
      loaded,
      denied,
      reload,
      objects: info?.available_objects ?? EMPTY,
      environments: info?.available_environments ?? EMPTY,
      instances: info?.available_instances ?? EMPTY,
      connections: info?.available_connections ?? EMPTY,
      ownApps: userId === null ? EMPTY : ownedBy(applications, userId),
      sharedApps: ownedBy(applications, 0),
      ownFiles: userId === null ? EMPTY : ownedBy(files, userId),
      sharedFiles: ownedBy(files, 0),
    };
  }, [info, loaded, denied, reload, userId]);
}
