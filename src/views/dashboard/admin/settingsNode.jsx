import { useTranslation } from 'react-i18next';

import ActionPage from '../../../components/actions/ActionPage';
import { required, text } from '../../../components/actions/fields';

const target = [required(text('id', 'vm-id')), text('id_env', 'vm-env')];

const ACTIONS = [
  { key: 'node-dhcp', title: 'vm-node-dhcp', endpoint: '/node/vmconfigure_dhcp', fields: target },
  { key: 'node-iptables', title: 'vm-node-iptables', endpoint: '/node/vmconfigure_iptables', fields: target },
];

function SettingsNode() {
  const { t } = useTranslation();
  return (
    <ActionPage
      id="settingsOverviewConfigurationVirtualEnvironment"
      title={`${t('vm-node-dhcp')} / ${t('vm-node-iptables')}`}
      tabsId="all-config-node"
      actions={ACTIONS}
    />
  );
}

export default SettingsNode;
