import { useTranslation } from 'react-i18next';

import ActionPage from '../../../components/actions/ActionPage';
import { LIST_CHOICES, required, select, text } from '../../../components/actions/fields';
import { FILE_FIELDS } from '../../../components/actions/forms';

const ID_FIELDS = [required(text('id', 'vm-id'))];

const ACTIONS = [
  { key: 'file-create', title: 'file-create', endpoint: '/files/create', fields: FILE_FIELDS },
  { key: 'file-create-shared', title: 'file-create-shared', endpoint: '/files/create_shared', fields: FILE_FIELDS },
  { key: 'file-update', title: 'file-update', endpoint: '/files/update', fields: FILE_FIELDS },
  { key: 'file-update-shared', title: 'file-update-shared', endpoint: '/files/update_shared', fields: FILE_FIELDS },
  { key: 'get-file', title: 'file-get', endpoint: '/files/get', fields: ID_FIELDS, result: 'data' },
  { key: 'file-delete', title: 'file-delete', endpoint: '/files/delete', fields: ID_FIELDS },
  { key: 'file-delete-shared', title: 'file-delete-shared', endpoint: '/files/delete_shared', fields: ID_FIELDS },
  {
    key: 'file-list',
    title: 'file-list',
    endpoint: '/files/list',
    fields: [select('choice', 'choice-list', LIST_CHOICES, { translate: true })],
    result: 'data',
  },
];

function SettingsFiles() {
  const { t } = useTranslation();
  return (
    <ActionPage id="settingsOverviewFiles" title={t('file-configuration')} tabsId="all-config-file" actions={ACTIONS} />
  );
}

export default SettingsFiles;
