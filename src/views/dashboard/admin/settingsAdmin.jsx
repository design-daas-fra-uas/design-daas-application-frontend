import { useTranslation } from 'react-i18next';

import ActionPage from '../../../components/actions/ActionPage';
import { required, select, text } from '../../../components/actions/fields';

const TASK_STATES = [
  ['all', 'all-tasks'],
  ['running', 'running-task'],
  ['final', 'final-task'],
];

const ACTIONS = [
  {
    key: 'admin-assign-object-to-user',
    title: 'admin-assign-object-to-user',
    endpoint: '/admin/assign_obj_to_user',
    fields: [required(text('id', 'vm-id')), required(text('owner', 'owner'))],
  },
  {
    key: 'admin-assign-app',
    title: 'admin-assign-app',
    endpoint: '/admin/assign_app',
    fields: [required(text('appid', 'vm-id')), required(text('owner', 'owner'))],
  },
  {
    key: 'admin-task-list',
    title: 'admin-task-list',
    endpoint: '/admin/tasklist',
    fields: [
      text('id_owner', 'vm-id-owner'),
      text('id_object', 'vm-id-object'),
      text('id_instance', 'vm-id-instance'),
      select('state', 'vm-status', TASK_STATES, { translate: true }),
    ],
    result: 'data',
  },
  {
    key: 'admin-task-stop',
    title: 'admin-task-stop',
    endpoint: '/admin/taskstop',
    fields: [
      text('id_owner', 'vm-id-owner'),
      text('id_object', 'vm-id-object'),
      text('id_instance', 'vm-id-instance'),
      text('id_task', 'vm-id-task'),
    ],
  },
];

function SettingsAdmin() {
  const { t } = useTranslation();
  return (
    <ActionPage
      id="settingsOverviewAdminAssign"
      title={t('admin-assign-object-app')}
      tabsId="all-config-admins"
      actions={ACTIONS}
    />
  );
}

export default SettingsAdmin;
