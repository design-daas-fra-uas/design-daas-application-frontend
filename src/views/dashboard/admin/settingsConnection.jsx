import { useTranslation } from 'react-i18next';

import ActionPage from '../../../components/actions/ActionPage';
import { required, select, text } from '../../../components/actions/fields';

const CONTYPES = [
  ['sysvnc', 'System VNC'],
  ['instvnc', 'Instance VNC'],
  ['rdp', 'RDP'],
];

const ACTIONS = [
  {
    key: 'viewer-connection',
    title: 'viewer-connection',
    endpoint: '/viewer/connect',
    fields: [required(text('id', 'vm-id')), text('id_env', 'vm-env'), select('contype', 'viewer-contype', CONTYPES)],
    result: 'viewer',
  },
  {
    key: 'viewer-disconnection',
    title: 'viewer-disconnection',
    endpoint: '/viewer/disconnect',
    fields: [required(text('id', 'vm-id')), text('id_env', 'vm-env')],
  },
];

function SettingsConnection() {
  const { t } = useTranslation();
  return (
    <ActionPage
      id="settingsOverviewConnectionViewer"
      title={t('viewer-check')}
      tabsId="all-connection-types"
      actions={ACTIONS}
    />
  );
}

export default SettingsConnection;
