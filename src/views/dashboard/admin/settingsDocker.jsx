import { useTranslation } from 'react-i18next';

import ActionPage from '../../../components/actions/ActionPage';
import {
  ROOT_IMAGES,
  cephFields,
  checkbox,
  file,
  required,
  select,
  text,
  viewerFields,
} from '../../../components/actions/fields';

const id = () => required(text('id', 'vm-id'));

const ACTIONS = [
  { key: 'docker-daemon-info', title: 'vm-docker-daemon-info', endpoint: '/container/daemon_info', result: 'log' },
  {
    key: 'docker-image-inspect',
    title: 'vm-docker-image-inspect',
    endpoint: '/container/image_inspect',
    fields: [id()],
    result: 'data',
  },
  {
    key: 'docker-image-list',
    title: 'vm-docker-image-list',
    endpoint: '/container/image_list',
    params: { onlyuser: 'on' },
    result: 'data',
  },
  {
    key: 'docker-image-create',
    title: 'vm-docker-image-create',
    endpoint: '/container/image_create',
    fields: [
      id(),
      required(text('name', 'vm-name')),
      file('dockerfile', 'vm-dockerfile'),
      ...cephFields(),
      ...viewerFields(),
    ],
  },
  {
    key: 'docker-image-create-root',
    title: 'vm-docker-image-create-root',
    endpoint: '/container/image_create_root',
    fields: [
      id(),
      required(text('name', 'vm-name')),
      select('rootimage', 'vm-root-image', ROOT_IMAGES),
      ...cephFields(),
      ...viewerFields(),
    ],
  },
  {
    key: 'docker-image-clone',
    title: 'vm-docker-image-clone',
    endpoint: '/container/image_clone',
    fields: [id(), required(text('newid', 'vm-new-id')), required(text('name', 'vm-name'))],
  },
  { key: 'docker-image-delete', title: 'vm-docker-image-delete', endpoint: '/container/image_delete', fields: [id()] },
  { key: 'docker-image-build', title: 'vm-docker-image-build', endpoint: '/container/image_build', fields: [id()] },
  {
    key: 'docker-container-start',
    title: 'vm-docker-container-start',
    endpoint: '/container/container_start',
    fields: [id(), text('id_env', 'vm-env'), checkbox('connect', 'vm-connect')],
    result: 'viewer',
    connectField: 'connect',
  },
  {
    key: 'docker-container-stop',
    title: 'vm-docker-container-stop',
    endpoint: '/container/container_stop',
    fields: [required(text('id_instance', 'vm-id-instance')), checkbox('kill', 'vm-kill')],
  },
  {
    key: 'docker-container-list',
    title: 'vm-docker-container-list',
    endpoint: '/container/container_list',
    fields: [
      checkbox('onlyuser', 'object-list-user'),
      checkbox('onlydaas', 'object-list-daas'),
      checkbox('detailed', 'object-list-detailed'),
    ],
    result: 'data',
    // This endpoint reports success with response_code 0.
    isSuccess: (response) => response.status === 200 && response.data.response_code === 0,
  },
  {
    key: 'docker-container-log',
    title: 'vm-docker-container-log',
    endpoint: '/container/container_logs',
    fields: [id()],
    result: 'log',
  },
];

function SettingsDocker() {
  const { t } = useTranslation();
  return <ActionPage id="settingsOverviewDocker" title={t('vm-docker')} tabsId="all-config-docker" actions={ACTIONS} />;
}

export default SettingsDocker;
