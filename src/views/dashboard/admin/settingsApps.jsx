import { useTranslation } from 'react-i18next';

import ActionPage from '../../../components/actions/ActionPage';
import { LIST_CHOICES, required, select, text } from '../../../components/actions/fields';
import { APP_FIELDS } from '../../../components/actions/forms';

const ID_FIELDS = [required(text('id', 'vm-id'))];

const ACTIONS = [
  { key: 'app-create', title: 'app-create', endpoint: '/apps/create', fields: APP_FIELDS },
  { key: 'app-create-shared', title: 'app-create-shared', endpoint: '/apps/create_shared', fields: APP_FIELDS },
  { key: 'app-update', title: 'app-update', endpoint: '/apps/update', fields: APP_FIELDS },
  { key: 'app-update-shared', title: 'app-update-shared', endpoint: '/apps/update_shared', fields: APP_FIELDS },
  { key: 'get-apps', title: 'app-get', endpoint: '/apps/get', fields: ID_FIELDS, result: 'data' },
  { key: 'app-delete', title: 'app-delete', endpoint: '/apps/delete', fields: ID_FIELDS },
  { key: 'app-delete-shared', title: 'app-delete-shared', endpoint: '/apps/delete_shared', fields: ID_FIELDS },
  {
    key: 'app-list',
    title: 'app-list',
    endpoint: '/apps/list',
    fields: [select('choice', 'choice-list', LIST_CHOICES, { translate: true })],
    result: 'data',
  },
];

function SettingsApps() {
  const { t } = useTranslation();
  return (
    <ActionPage id="settingsOverviewApps" title={t('app-configuration')} tabsId="all-config-apps" actions={ACTIONS} />
  );
}

export default SettingsApps;
