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

import ContainerTable from './docker/ContainerTable';
import DaemonOverview from './docker/DaemonOverview';
import ImageTable from './docker/ImageTable';

const id = () => required(text('id', 'vm-id'));

// Operations that change something, grouped into two tabs.
const IMAGE_ACTIONS = [
  {
    key: 'docker-image-inspect',
    title: 'vm-docker-image-inspect',
    endpoint: '/container/image_inspect',
    fields: [id()],
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
];

const CONTAINER_ACTIONS = [
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
    key: 'docker-container-log',
    title: 'vm-docker-container-log',
    endpoint: '/container/container_logs',
    fields: [id()],
    result: 'log',
  },
];

// Read-only views first (loaded when their tab opens), then the operations.
const ACTIONS = [
  { key: 'docker-overview', title: 'docker-overview', content: <DaemonOverview /> },
  { key: 'docker-images', title: 'docker-images-tab', content: <ImageTable /> },
  { key: 'docker-containers', title: 'docker-containers-tab', content: <ContainerTable /> },
  { key: 'docker-manage-images', title: 'docker-manage-images', actions: IMAGE_ACTIONS },
  { key: 'docker-manage-containers', title: 'docker-manage-containers', actions: CONTAINER_ACTIONS },
];

function SettingsDocker() {
  const { t } = useTranslation();
  return <ActionPage id="settingsOverviewDocker" title={t('vm-docker')} tabsId="all-config-docker" actions={ACTIONS} />;
}

export default SettingsDocker;
