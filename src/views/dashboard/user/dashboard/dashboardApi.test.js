import { daasClient } from '../../../../api/client';
import { DaasRequestError } from '../../../../api/phases';
import { deleteObject, startObject, stopObject } from './dashboardApi';

vi.mock('../../../../api/client', () => ({
  daasClient: { post: vi.fn() },
  isDaasSuccess: (response) => response?.status === 200 && response?.data?.response_code === 200,
}));

const ok = (data = {}) => ({ status: 200, data: { response_code: 200, ...data } });
const environment = { id_object: 'o1', id_user: 'env1', object_state: 'environment-final' };
const baseImage = { id_object: 'o2', id_user: 'img', object_state: 'baseimage-create' };

beforeEach(() => vi.clearAllMocks());

it('starts environments and base images through their own endpoints', async () => {
  daasClient.post.mockResolvedValue(ok({ id_instance: 'i1', response_url: 'http://viewer' }));

  await expect(startObject(environment)).resolves.toEqual({ instanceId: 'i1', viewerUrl: 'http://viewer' });
  expect(daasClient.post).toHaveBeenLastCalledWith('/phases/environment_start', {
    id: 'o1',
    name: 'env1',
    connect: 'on',
  });

  await startObject(baseImage);
  expect(daasClient.post).toHaveBeenLastCalledWith('/phases/baseimage_start', { id: 'o2', connect: 'on' });
});

it('stops base images by instance and environments by object id', async () => {
  daasClient.post.mockResolvedValue(ok());
  await stopObject(baseImage, 'i9');
  expect(daasClient.post).toHaveBeenLastCalledWith('/phases/baseimage_stop', { id_instance: 'i9', force: 'on' });

  await stopObject(environment, 'i9');
  expect(daasClient.post).toHaveBeenLastCalledWith('/phases/environment_stop', {
    id: 'o1',
    name: 'env1',
    force: 'on',
  });
});

it('deletes the base image even when deleting the environment fails', async () => {
  daasClient.post.mockResolvedValueOnce({ status: 200, data: { response_code: 404 } }).mockResolvedValueOnce(ok());
  await deleteObject(environment);
  expect(daasClient.post).toHaveBeenNthCalledWith(1, '/phases/environment_delete', {
    id: 'o1',
    name: 'env1',
    connect: 'on',
  });
  expect(daasClient.post).toHaveBeenNthCalledWith(2, '/phases/baseimage_delete', { id: 'o1', connect: 'on' });
});

it('rejects backend error codes and unknown object states', async () => {
  daasClient.post.mockResolvedValue({ status: 200, data: { response_code: 500 } });
  await expect(startObject(baseImage)).rejects.toBeInstanceOf(DaasRequestError);
  await expect(startObject({ ...baseImage, object_state: 'weird' })).rejects.toThrow('Unknown object state');
});
