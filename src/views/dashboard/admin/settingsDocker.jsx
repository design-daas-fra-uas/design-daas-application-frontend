import { useTranslation } from 'react-i18next';

import { getContainerObjects } from '../../../api/docker';
import ActionPage from '../../../components/actions/ActionPage';
import {
  ROOT_IMAGES,
  cephFields,
  checkbox,
  file,
  number,
  required,
  select,
  text,
  viewerFields,
} from '../../../components/actions/fields';

import ContainerTable from './docker/ContainerTable';
import DaemonOverview from './docker/DaemonOverview';
import ImageTable from './docker/ImageTable';

// Every action finds its DaaS container object by its ID; the name is only a
// label for people (the object list shows it), so the two are labelled apart.
// The existing container objects are offered in a searchable list: ID, display name,
// and whether the object is shared (owner 0) or belongs to a user.
const suggestObjects = () =>
  getContainerObjects().then((objects) =>
    objects.map(({ id: objectId, name, owner }) => ({
      value: objectId,
      label: name,
      badge: owner === 0 ? { key: 'docker-object-shared' } : { key: 'docker-object-owner', values: { owner } },
    })),
  );
const id = () => required(text('id', 'docker-object-id', { hint: 'docker-object-id-hint', suggest: suggestObjects }));

// A new object's ID becomes its Docker image tag (daas.<id> in lower case),
// so it is limited to what a tag allows.
const OBJECT_ID_PATTERN = /^[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*$/;
const newId = (name, label) =>
  required(
    text(name, label, {
      hint: 'docker-new-object-id-hint',
      pattern: OBJECT_ID_PATTERN,
      invalid: 'docker-object-id-invalid',
    }),
  );
const displayName = () => required(text('name', 'docker-display-name', { hint: 'docker-display-name-hint' }));

// The backend requires the hardware of a new container object, memory and disk in KiB;
// people enter whole GiB.
const KIB_PER_GIB = 1024 ** 2;
const hardwareFields = () => [
  required(number('cores', 'vm-cores', { initial: '2' })),
  required(number('memsize', 'docker-memory-gib', { initial: '4', scale: KIB_PER_GIB })),
  required(number('disksize', 'docker-disk-gib', { initial: '8', scale: KIB_PER_GIB })),
];

// Containers are reached through their own VNC server, not the Proxmox one.
const containerViewerFields = () =>
  viewerFields().map((field) => (field.name === 'viewer_contype' ? { ...field, initial: 'instvnc' } : field));

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
      newId('id', 'docker-object-id'),
      displayName(),
      ...hardwareFields(),
      required(file('dockerfile', 'vm-dockerfile')),
      ...cephFields(),
      ...containerViewerFields(),
    ],
  },
  {
    key: 'docker-image-create-root',
    title: 'vm-docker-image-create-root',
    endpoint: '/container/image_create_root',
    fields: [
      newId('id', 'docker-object-id'),
      displayName(),
      select('rootimage', 'vm-root-image', ROOT_IMAGES),
      ...hardwareFields(),
      ...cephFields(),
      ...containerViewerFields(),
    ],
  },
  {
    key: 'docker-image-clone',
    title: 'vm-docker-image-clone',
    endpoint: '/container/image_clone',
    fields: [id(), newId('newid', 'docker-new-object-id'), displayName()],
  },
  { key: 'docker-image-delete', title: 'vm-docker-image-delete', endpoint: '/container/image_delete', fields: [id()] },
  {
    key: 'docker-image-build',
    title: 'vm-docker-image-build',
    endpoint: '/container/image_build',
    fields: [id()],
    result: 'log',
  },
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
