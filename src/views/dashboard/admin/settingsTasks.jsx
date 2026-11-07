import { useTranslation } from 'react-i18next';

import ActionPage from '../../../components/actions/ActionPage';
import { required, select, text } from '../../../components/actions/fields';

const TASK_STATES = [
  ['all', 'all-tasks'],
  ['running', 'running-tasks'],
  ['final', 'final-tasks'],
];

const ACTIONS = [
  {
    key: 'get-tasks',
    title: 'get-tasks',
    endpoint: '/tasks/get',
    fields: [required(text('id_task', 'vm-id-task'))],
    result: 'data',
  },
  {
    key: 'stop-tasks',
    title: 'stop-tasks',
    endpoint: '/tasks/stop',
    fields: [
      required(text('id_task', 'vm-id-task')),
      required(text('id_object', 'vm-id-object')),
      required(text('id_instance', 'vm-id-instance')),
    ],
  },
  // The response holds the `current` and `finalized` task lists.
  { key: 'status-tasks', title: 'status-tasks', endpoint: '/tasks/status', result: 'data' },
  {
    key: 'list-tasks',
    title: 'list-tasks',
    endpoint: '/tasks/list',
    fields: [
      text('id_object', 'vm-id-object'),
      text('id_instance', 'vm-id-instance'),
      select('state', 'state-task', TASK_STATES, { translate: true }),
    ],
    result: 'data',
  },
];

function SettingsTasks() {
  const { t } = useTranslation();
  return <ActionPage id="monitoring" title={t('tasks')} tabsId="all-tasks-types" actions={ACTIONS} />;
}

export default SettingsTasks;
