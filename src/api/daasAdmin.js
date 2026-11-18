import { daasClient, isDaasSuccess } from './client';
import { DaasRequestError } from './phases';

// Admin calls to the DaaS backend that go with account management in the Java backend.

// Stops the user's running instances and tasks and deletes their VMs, containers
// (with their environments), files, apps and resource limit. Call it before
// deleting the account: afterwards nobody owns these resources any more.
export const deleteUserData = (userId) =>
  daasClient.post('/admin/delete_user_data', { id_owner: userId }).then((response) => {
    if (!isDaasSuccess(response)) {
      throw new DaasRequestError('/admin/delete_user_data', response);
    }
    return response.data.response_data;
  });
