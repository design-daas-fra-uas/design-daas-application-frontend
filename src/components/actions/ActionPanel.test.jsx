import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../i18n';
import { daasClient } from '../../api/client';
import ActionPanel from './ActionPanel';
import { checkbox, required, text } from './fields';

vi.mock('../../api/client', () => ({
  daasClient: { post: vi.fn(), get: vi.fn() },
  isDaasSuccess: (response) => response?.status === 200 && response?.data?.response_code === 200,
}));

const action = {
  key: 'test',
  endpoint: '/vm/status',
  fields: [required(text('id', 'vm-id')), checkbox('connect', 'vm-connect')],
  params: { onlyuser: 'on' },
  result: 'data',
};

const mountPanel = (overrides = {}) => {
  const showRequestAlert = vi.fn();
  render(<ActionPanel action={{ ...action, ...overrides }} showRequestAlert={showRequestAlert} />);
  return showRequestAlert;
};

beforeEach(() => vi.clearAllMocks());

it('keeps submit disabled until the required fields are filled', async () => {
  mountPanel();
  const submit = screen.getByRole('button', { name: 'Submit' });
  expect(submit).toBeDisabled();

  await userEvent.type(screen.getByLabelText('ID'), '101');
  expect(submit).toBeEnabled();
});

it('posts the form, reports success and shows the returned data', async () => {
  daasClient.post.mockResolvedValue({ status: 200, data: { response_code: 200, response_data: { state: 'running' } } });
  const showRequestAlert = mountPanel();

  await userEvent.type(screen.getByLabelText('ID'), '101');
  await userEvent.click(screen.getByRole('checkbox'));
  await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

  expect(daasClient.post).toHaveBeenCalledWith('/vm/status', { onlyuser: 'on', id: '101', connect: 'on' });
  expect(showRequestAlert).toHaveBeenCalledWith(true, '/vm/status');
  expect(await screen.findByText('running')).toBeInTheDocument();
});

it('reports a rejected request and shows no result', async () => {
  daasClient.post.mockResolvedValue({ status: 200, data: { response_code: 500 } });
  const onSuccess = vi.fn();
  const showRequestAlert = mountPanel({ onSuccess });

  await userEvent.type(screen.getByLabelText('ID'), '101');
  await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

  expect(showRequestAlert).toHaveBeenCalledWith(false, '/vm/status: Error 500');
  expect(onSuccess).not.toHaveBeenCalled();
});

it('uses a custom body when the action defines one', async () => {
  daasClient.post.mockResolvedValue({ status: 200, data: { response_code: 200 } });
  mountPanel({ body: ({ id }) => ({ id_object: id }) });

  await userEvent.type(screen.getByLabelText('ID'), '7');
  await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

  expect(daasClient.post).toHaveBeenCalledWith('/vm/status', { id_object: '7' });
});
