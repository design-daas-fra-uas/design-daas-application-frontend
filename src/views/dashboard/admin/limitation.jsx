import { useTranslation } from 'react-i18next';

import ActionPage from '../../../components/actions/ActionPage';
import { required, text } from '../../../components/actions/fields';

const owner = required(text('id_owner', 'vm-id-owner'));

const ACTIONS = [
  {
    key: 'put-limits',
    title: 'put-limits',
    endpoint: '/limits/put_limit',
    fields: [
      owner,
      required(text('vm_max', 'limit-max')),
      required(text('container_max', 'container-max')),
      required(text('obj_max', 'object-max')),
      required(text('cpu_max', 'cpu-max')),
      required(text('mem_max', 'memory-max')),
      required(text('dsk_max', 'disk-max')),
    ],
  },
  { key: 'get-limits', title: 'get-limits', endpoint: '/limits/get_limit', fields: [owner], result: 'data' },
  { key: 'remove-limits', title: 'remove-limits', endpoint: '/limits/remove_limit', fields: [owner] },
  { key: 'all-limits', title: 'all-limits', endpoint: '/limits/list_limits', result: 'data' },
];

function Limitation() {
  const { t } = useTranslation();
  return (
    <ActionPage id="settingsOverviewAdminAssign" title={t('limitation')} tabsId="all-config-limits" actions={ACTIONS} />
  );
}

export default Limitation;
