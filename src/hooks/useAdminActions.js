import { useState } from 'react';

import { createAdmin } from '../api/admins';
import { createUser } from '../api/users';
import { createUserGroup, updateUserGroup } from '../api/userGroups';

// Create/update handlers of the admin dashboard. Saving and refreshing are
// reported separately: a failed save is shown inside the open modal (`saveError`),
// a failed refresh as a notice after the modal closed.
export default function useAdminActions({ showNotice, refreshGroups, refreshUsers, refreshAdmins, closeGroupModal, closeAccountModal }) {
  const [saveError, setSaveError] = useState(false);

  const saveThenRefresh = async ({ save, refresh, onSaved, closeModal }) => {
    setSaveError(false);
    try {
      await save();
    } catch (error) {
      console.error(error);
      setSaveError(true);
      return;
    }

    onSaved?.();
    try {
      await refresh();
      showNotice({ text: 'request-successful', success: true }, { autoHide: true });
    } catch (error) {
      console.error(error);
      showNotice({
        text: 'refresh-failed',
        fallback: 'Saved, but the list could not be refreshed. Please reload the data.',
        success: false,
      });
    }
    closeModal();
  };

  const createGroup = ({ description }, { resetForm }) =>
    saveThenRefresh({
      save: () => createUserGroup({ description }),
      refresh: refreshGroups,
      onSaved: resetForm,
      closeModal: closeGroupModal,
    });

  const updateGroup = (group, { description }) => {
    if (!group) {
      return undefined;
    }

    return saveThenRefresh({
      save: () => updateUserGroup(group.id, { description }),
      refresh: refreshGroups,
      closeModal: closeGroupModal,
    });
  };

  const createUserAccount = ({ name, email, password, group }, { resetForm }) =>
    saveThenRefresh({
      save: () => createUser({ name: name.trim(), email: email.trim(), password, groups: [Number(group)] }),
      refresh: refreshUsers,
      onSaved: resetForm,
      closeModal: closeAccountModal,
    });

  const createAdminAccount = ({ name, email, password }, { resetForm }) =>
    saveThenRefresh({
      save: () => createAdmin({ name: name.trim(), email: email.trim(), password }),
      refresh: refreshAdmins,
      onSaved: resetForm,
      closeModal: closeAccountModal,
    });

  return { saveError, clearSaveError: () => setSaveError(false), createGroup, updateGroup, createUserAccount, createAdminAccount };
}
