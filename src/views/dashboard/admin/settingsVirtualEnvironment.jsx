import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { daasClient, isDaasSuccess } from '../../../api/client';
import ActionPage from '../../../components/actions/ActionPage';
import ResultView from '../../../components/actions/ResultView';
import { cephFields, checkbox, required, select, text, viewerFields } from '../../../components/actions/fields';
import useResource from '../../../hooks/useResource';

const OS_TYPES = [
  ['win10', 'Win 10'],
  ['win11', 'Win 11'],
  ['l26', 'Linux - Debian 12'],
];

const fetchUserVms = ({ signal }) =>
  daasClient
    .post('/vm/list', { onlyuser: 'on' }, { headers: { 'Content-Type': 'application/json' }, signal })
    .then((response) => (isDaasSuccess(response) ? response.data.response_data : []));

const id = () => required(text('id', 'vm-id'));

// `onVmsChanged` reloads the VM list after a VM was created, deleted or stopped.
const buildActions = (onVmsChanged) => [
  {
    key: 'create-vm',
    title: 'vm-create',
    endpoint: '/vm/create',
    fields: [
      id(),
      required(text('name', 'vm-name')),
      required(text('kb', 'vm-keyboard-language')),
      required(text('cores', 'vm-cores')),
      required(text('memsize', 'vm-memory-size')),
      required(text('disksize', 'vm-disk-size')),
      required(select('os_type', 'vm-os-type', OS_TYPES)),
      checkbox('ceph_pool', 'vm-ceph-pool'),
      ...cephFields(),
      ...viewerFields(),
    ],
    onSuccess: onVmsChanged,
  },
  { key: 'delete-vm', title: 'vm-delete', endpoint: '/vm/delete', fields: [id()], onSuccess: onVmsChanged },
  {
    key: 'start-vm',
    title: 'vm-start',
    endpoint: '/vm/start',
    fields: [id(), text('id_env', 'vm-env'), checkbox('connect', 'vm-connect')],
    result: 'viewer',
    connectField: 'connect',
  },
  {
    key: 'stop-vm',
    title: 'vm-stop',
    endpoint: '/vm/stop',
    fields: [required(text('id', 'vm-id-instance'))],
    onSuccess: onVmsChanged,
  },
  { key: 'list-vm', title: 'vm-list' },
  { key: 'status-vm', title: 'vm-status', endpoint: '/vm/status', fields: [id()], result: 'data' },
  { key: 'config-vm', title: 'vm-config', endpoint: '/vm/config_get', fields: [id()], result: 'data' },
  {
    key: 'config-pre-vm',
    title: ['vm-config', 'vm-config-pre'],
    endpoint: '/vm/config_set_pre_install',
    fields: [
      id(),
      required(text('name', 'vm-name')),
      required(text('cores', 'vm-cores')),
      required(text('memsize', 'vm-memory-size')),
      required(text('disksize', 'vm-disk-size')),
      required(text('ostype', 'vm-os-type')),
      required(text('iso_installer', 'vm-iso-installer')),
      required(text('keyboard_layout', 'vm-keyboard-language')),
    ],
  },
  {
    key: 'config-post-vm',
    title: ['vm-config', 'vm-config-post'],
    endpoint: '/vm/config_set_post_install',
    fields: [id(), required(text('name', 'vm-name')), required(text('keyboard_layout', 'vm-keyboard-language'))],
  },
  {
    key: 'snapshot-list-vm',
    title: ['vm-snapname', 'vm-list'],
    endpoint: '/vm/snapshot_list',
    fields: [id()],
    result: 'data',
  },
  {
    key: 'snapshot-create-vm',
    title: ['vm-snapname', 'vm-create'],
    endpoint: '/vm/snapshot_create',
    fields: [id(), required(text('snapname', 'vm-snapname')), required(text('desc', 'vm-desc'))],
  },
  {
    key: 'snapshot-rollback-vm',
    title: ['vm-snapname', 'vm-rollback'],
    endpoint: '/vm/snapshot_rollback',
    fields: [id(), required(text('snapname', 'vm-snapname'))],
  },
  {
    key: 'clone-vm',
    title: 'vm-clone',
    endpoint: '/vm/clone',
    fields: [
      id(),
      required(text('newid', 'vm-new-id')),
      required(text('name', 'vm-name')),
      required(text('kb', 'vm-keyboard-language')),
      text('snapname', 'vm-snapname'),
      ...cephFields(),
    ],
  },
  {
    key: 'convert-vm',
    title: 'vm-template-convert',
    endpoint: '/vm/template_convert',
    fields: [id(), required(text('disk', 'vm-disk'))],
  },
];

function SettingsVirtualEnvironment() {
  const { t } = useTranslation();
  const { data: vms, reload } = useResource(fetchUserVms);
  const actions = useMemo(() => buildActions(() => reload({ silent: true })), [reload]);

  const vmIds = (vms || []).map((vm) => ({ 'DaaS - ID': vm.daas_id }));
  const withList = actions.map((action) =>
    action.key === 'list-vm' ? { ...action, content: <ResultView data={vmIds} /> } : action,
  );

  return (
    <ActionPage id="settingsOverviewVirtualEnvironment" title={t('vm-setup')} tabsId="all-vm" actions={withList} />
  );
}

export default SettingsVirtualEnvironment;
