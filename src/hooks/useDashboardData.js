import { useCallback } from 'react';

import { getAdmins } from '../api/admins';
import { getUsers } from '../api/users';
import { getUserGroups } from '../api/userGroups';

import useResource from './useResource';

// The API returns oldest first; the dashboard previews show the newest entries.
const newestFirst = (items) => [...items].reverse();

const fetchAdmins = async (options) => newestFirst(await getAdmins(options));
const fetchUsers = async (options) => newestFirst(await getUsers(options));

// Admin dashboard data, built from one `useResource` per section so one failing
// request does not blank the others. `loadErrors` lists the failed sections and
// `loading` is true until every section has settled. `refreshX` reloads one
// section silently and throws when that fails.
export default function useDashboardData() {
  const admins = useResource(fetchAdmins);
  const users = useResource(fetchUsers);
  const groups = useResource(getUserGroups);
  const sections = [
    ['admins', admins],
    ['users', users],
    ['groups', groups],
  ];

  const loadErrors = sections.filter(([, section]) => section.status === 'error').map(([name]) => name);
  const loading = sections.some(([, section]) => section.status === 'loading');

  const reloadAdmins = admins.reload;
  const reloadUsers = users.reload;
  const reloadGroups = groups.reload;

  const reload = useCallback(
    () => Promise.all([reloadAdmins(), reloadUsers(), reloadGroups()]),
    [reloadAdmins, reloadUsers, reloadGroups]
  );

  const silentRefresh = (reloadSection) => async () => {
    if (!(await reloadSection({ silent: true }))) {
      throw new Error('Refresh failed');
    }
  };

  return {
    admins: admins.data ?? [],
    users: users.data ?? [],
    groups: groups.data ?? [],
    loading,
    loadErrors,
    reload,
    refreshAdmins: silentRefresh(reloadAdmins),
    refreshUsers: silentRefresh(reloadUsers),
    refreshGroups: silentRefresh(reloadGroups),
  };
}
