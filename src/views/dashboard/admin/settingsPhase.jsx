import { useTranslation } from 'react-i18next';

import ActionPage from '../../../components/actions/ActionPage';
import { TASK_TYPES, checkbox, file, required, select, text } from '../../../components/actions/fields';
import { BASEIMAGE_CLONE_FIELDS, BASEIMAGE_CREATE_FIELDS } from '../../../components/actions/forms';
import { applistParam, targetParam, tasklistParam } from '../../../api/phases';

const id = () => required(text('id', 'vm-id'));

const ACTIONS = [
  {
    key: 'phases-baseimage-create',
    title: 'vm-phases-baseimage-create',
    endpoint: '/phases/baseimage_create',
    fields: BASEIMAGE_CREATE_FIELDS,
  },
  {
    key: 'phases-baseimage-clone',
    title: 'vm-phases-baseimage-clone',
    endpoint: '/phases/baseimage_clone',
    fields: BASEIMAGE_CLONE_FIELDS,
  },
  {
    key: 'phases-baseimage-create-from-app',
    title: 'vm-phases-baseimage-create-from-app',
    endpoint: '/phases/baseimage_create_from_app',
    fields: [
      id(),
      required(text('appid', 'vm-app-id')),
      required(text('name', 'vm-name')),
      required(text('env', 'vm-env')),
      checkbox('run', 'run-baseimage'),
    ],
  },
  {
    key: 'phases-baseimage-clone-from-app',
    title: 'vm-phases-baseimage-clone-from-app',
    endpoint: '/phases/baseimage_clone_from_app',
    fields: [
      id(),
      required(text('appid', 'vm-app-id')),
      required(text('newid', 'vm-new-id')),
      required(text('name', 'vm-name')),
      required(text('env', 'vm-env')),
      checkbox('run', 'run-baseimage'),
    ],
  },
  {
    key: 'phases-baseimage-finalize',
    title: 'vm-phases-baseimage-finalize',
    endpoint: '/phases/baseimage_finalize',
    fields: [id()],
  },
  {
    key: 'phases-baseimage-delete',
    title: 'vm-phases-baseimage-delete',
    endpoint: '/phases/baseimage_delete',
    fields: [id()],
  },
  {
    key: 'phases-baseimage-start',
    title: 'vm-phases-baseimage-start',
    endpoint: '/phases/baseimage_start',
    fields: [id(), checkbox('connect', 'vm-connect')],
    result: 'viewer',
    connectField: 'connect',
  },
  {
    key: 'phases-baseimage-stop',
    title: 'vm-phases-baseimage-stop',
    endpoint: '/phases/baseimage_stop',
    fields: [required(text('id_instance', 'vm-id-instance')), checkbox('force', 'vm-force')],
  },
  {
    key: 'phases-cfg-from-application',
    title: 'vm-phases-cfg-from-application',
    endpoint: '/phases/cfg_from_application',
    fields: [id(), required(text('appid', 'vm-app-id')), required(text('env', 'vm-env'))],
  },
  {
    key: 'phases-cfg-tasklist',
    title: 'vm-phases-cfg-tasklist',
    endpoint: '/phases/cfg_tasklist',
    fields: [
      id(),
      text('env', 'vm-env'),
      required(select('type', 'vm-type', TASK_TYPES, { translate: true })),
      required(text('cmd', 'vm-command')),
      text('args', 'vm-arguments'),
    ],
    body: (params) => ({ ...params, tasklist: tasklistParam(params) }),
  },
  {
    key: 'phases-cfg-applist',
    title: 'vm-phases-cfg-applist',
    endpoint: '/phases/cfg_applist',
    fields: [
      id(),
      text('env', 'vm-env'),
      required(text('name', 'vm-name')),
      required(text('cmd', 'vm-command')),
      text('args', 'vm-arguments'),
    ],
    // The backend reads the app from `applist`; only cmd/args are sent separately.
    body: ({ name, ...params }) => ({ ...params, applist: applistParam({ name, ...params }) }),
  },
  {
    key: 'phases-cfg-target',
    title: 'vm-phases-cfg-target',
    endpoint: '/phases/cfg_set_target',
    fields: [
      id(),
      text('env', 'vm-env'),
      required(text('name', 'vm-name')),
      required(text('cmd', 'vm-command')),
      text('args', 'vm-arguments'),
    ],
    body: (params) => ({ ...params, target: targetParam(params) }),
  },
  {
    key: 'phases-environment-create',
    title: 'vm-phases-environment-create',
    endpoint: '/phases/environment_create',
    fields: [id(), required(text('name', 'vm-name')), file('dockerfile', 'vm-dockerfile')],
    body: (params) => ({ ...params, dockerfile: params.dockerfile ?? '' }),
    result: 'data',
  },
  {
    key: 'phases-environment-finalize',
    title: 'vm-phases-environment-finalize',
    endpoint: '/phases/environment_finalize',
    fields: [id(), required(text('name', 'vm-name'))],
  },
  {
    key: 'phases-environment-delete',
    title: 'vm-phases-environment-delete',
    endpoint: '/phases/environment_delete',
    fields: [id(), required(text('name', 'vm-name'))],
  },
  {
    key: 'phases-environment-get',
    title: 'vm-phases-environment-get',
    endpoint: '/phases/environment_get',
    fields: [id(), required(text('name', 'vm-name'))],
    result: 'data',
  },
  {
    key: 'phases-environments-get',
    title: 'vm-phases-environments-get',
    endpoint: '/phases/environments_get',
    fields: [id()],
    result: 'data',
  },
  {
    key: 'phases-environment-start',
    title: 'vm-phases-environment-start',
    endpoint: '/phases/environment_start',
    fields: [id(), required(text('name', 'vm-name')), checkbox('connect', 'vm-connect')],
    result: 'viewer',
    connectField: 'connect',
  },
  {
    key: 'phases-environment-run',
    title: 'vm-phases-environment-run',
    endpoint: '/phases/environment_run',
    fields: [id(), required(text('env', 'vm-env')), checkbox('connect', 'vm-connect')],
    result: 'viewer',
    connectField: 'connect',
  },
  {
    key: 'phases-environment-stop',
    title: 'vm-phases-environment-stop',
    endpoint: '/phases/environment_stop',
    fields: [id(), required(text('name', 'vm-name')), checkbox('force', 'vm-force')],
  },
  {
    key: 'phases-object-status',
    title: 'vm-phases-object-status',
    endpoint: '/phases/object_status',
    fields: [id()],
    result: 'data',
  },
  {
    key: 'phases-object-list',
    title: 'vm-phases-object-list',
    endpoint: '/phases/object_list',
    fields: [
      checkbox('onlyuser', 'object-list-user'),
      checkbox('onlydaas', 'object-list-daas'),
      checkbox('detailed', 'object-list-detailed'),
    ],
    result: 'data',
  },
];

function SettingsPhases() {
  const { t } = useTranslation();
  return <ActionPage id="settingsOverviewPhases" title={t('vm-phases')} tabsId="all-config-phases" actions={ACTIONS} />;
}

export default SettingsPhases;
