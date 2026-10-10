import { useCallback, useEffect, useState } from 'react';

import { getAdmins } from '../api/admins';
import { getUsers } from '../api/users';
import { getUserGroups } from '../api/userGroups';

// The API returns oldest first; the dashboard previews show the newest entries.
const newestFirst = (items) => [...items].reverse();

const fetchAdmins = async () => newestFirst(await getAdmins());
const fetchUsers = async () => newestFirst(await getUsers());

// Admin dashboard data. Each section loads independently so one failing
// request does not blank the others; `loadErrors` lists the failed sections.
export default function useDashboardData() {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loadErrors, setLoadErrors] = useState([]);

  const reload = useCallback(async () => {
    setLoadErrors([]);
    const sections = [
      ['admins', fetchAdmins, setAdmins],
      ['users', fetchUsers, setUsers],
      ['groups', getUserGroups, setGroups],
    ];
    const results = await Promise.allSettled(sections.map(([, fetcher]) => fetcher()));
    const failed = [];
    results.forEach((result, index) => {
      const [name, , setter] = sections[index];
      if (result.status === 'fulfilled') {
        setter(result.value);
      } else {
        console.error(result.reason);
        failed.push(name);
      }
    });
    setLoadErrors(failed);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const refreshAdmins = useCallback(async () => setAdmins(await fetchAdmins()), []);
  const refreshUsers = useCallback(async () => setUsers(await fetchUsers()), []);
  const refreshGroups = useCallback(async () => setGroups(await getUserGroups()), []);

  return { admins, users, groups, loadErrors, reload, refreshAdmins, refreshUsers, refreshGroups };
}