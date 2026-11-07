import { daasClient } from '../../../api/client';
import { EMPTY_MONITORING } from './monitoringConfig';
import { fetchMonitoring } from './useMonitoring';

vi.mock('../../../api/client', () => ({
  daasClient: { post: vi.fn() },
  isDaasSuccess: (response) => response?.status === 200 && response?.data?.response_code === 200,
}));

const ok = (data) => ({ status: 200, data: { response_code: 200, response_data: data } });

beforeEach(() => vi.clearAllMocks());

it('loads every category of a scope and unwraps list payloads', async () => {
  daasClient.post.mockImplementation((path) => {
    if (path.endsWith('_tasks')) return Promise.resolve(ok({ all: [{ id_task: 't1' }] }));
    if (path.endsWith('_apps')) return Promise.resolve(ok({ app_list: [{ id: 'a1' }] }));
    if (path.endsWith('_host')) return Promise.resolve(ok({ available_cpus: 8 }));
    return Promise.resolve(ok(undefined));
  });

  const { data, ok: allOk } = await fetchMonitoring('user');

  expect(allOk).toBe(true);
  expect(data.tasks).toEqual([{ id_task: 't1' }]);
  expect(data.apps).toEqual([{ id: 'a1' }]);
  expect(data.hosts).toEqual({ available_cpus: 8 });
  expect(data.files).toEqual([]);
  expect(daasClient.post).toHaveBeenCalledWith('/monitoring/get_monitor_info_tasks', {});
});

it('filters by owner, except for the global host data', async () => {
  daasClient.post.mockResolvedValue(ok({}));
  await fetchMonitoring('owner', '42');
  expect(daasClient.post).toHaveBeenCalledWith('/admin/get_monitor_info_files', { id_owner: '42' });
  expect(daasClient.post).toHaveBeenCalledWith('/admin/get_monitor_info_host', {});
});

it('falls back to empty values for failing categories', async () => {
  daasClient.post.mockRejectedValue(new Error('offline'));
  const { data, ok: allOk } = await fetchMonitoring('admin');
  expect(allOk).toBe(false);
  expect(data).toEqual(EMPTY_MONITORING);
});
