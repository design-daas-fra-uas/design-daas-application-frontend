import { useTranslation } from 'react-i18next';

import ActionPage from '../../../components/actions/ActionPage';
import { cephFields, checkbox, file, required, select, text } from '../../../components/actions/fields';

const target = () => [required(text('id', 'vm-id')), text('id_env', 'vm-env')];

// The "invoke" endpoints all take a command and its arguments.
const invoke = (key, title, endpoint) => ({
  key,
  title,
  endpoint,
  fields: [...target(), required(text('cmd', 'vm-instance-command')), text('args', 'vm-instance-arguments')],
});

const ACTIONS = [
  invoke('instance-app', 'vm-instance-app', '/inst/vminvoke_app'),
  invoke('instance-cmd', 'vm-instance-command', '/inst/vminvoke_cmd'),
  invoke('instance-ssh', 'vm-instance-ssh', '/inst/vminvoke_ssh'),
  invoke('instance-status', 'vm-instance-status', '/inst/vminvoke_action'),
  invoke('instance-resize', 'vm-instance-resize', '/inst/vminvoke_resolution'),
  invoke('instance-os-package', 'vm-instance-os-package', '/inst/vminvoke_ospackage'),
  {
    key: 'instance-upload',
    title: 'vm-instance-upload',
    endpoint: '/inst/vminvoke_upload',
    fields: [...target(), file('file', 'vm-file'), checkbox('execute', 'vm-execute')],
  },
  {
    key: 'instance-mount',
    title: 'vm-instance-mount-ceph',
    endpoint: '/inst/vminvoke_cephfs',
    fields: [
      ...target(),
      select('cmd', 'vm-command', [
        ['mount', 'mount'],
        ['unmount', 'unmount'],
      ]),
      ...cephFields(),
    ],
  },
  { key: 'instance-list', title: 'vm-instance-list', endpoint: '/inst/list', result: 'data' },
  {
    key: 'instance-connection-icmp',
    title: 'vm-instance-connection-icmp',
    endpoint: '/inst/connection_test_icmp',
    fields: target(),
  },
  {
    key: 'instance-connection-ssh',
    title: 'vm-instance-connection-ssh',
    endpoint: '/inst/connection_test_ssh',
    fields: target(),
  },
  {
    key: 'instance-roundtrip',
    title: 'vm-instance-roundtrip',
    endpoint: '/tests/measure_rtt',
    fields: [
      ...target(),
      text('iter', 'vm-iteration'),
      text('name', 'vm-name'),
      text('cmd', 'vm-command'),
      text('args', 'vm-arguments'),
    ],
  },
];

function SettingsInstances() {
  const { t } = useTranslation();
  return (
    <ActionPage
      id="settingsOverviewInstanceVirtualEnvironment"
      title={t('vm-instance')}
      tabsId="all-config-instance"
      actions={ACTIONS}
    />
  );
}

export default SettingsInstances;
