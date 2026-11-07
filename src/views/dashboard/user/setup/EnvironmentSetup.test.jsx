import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';

import '../../../../i18n';
import { daasClient } from '../../../../api/client';
import EnvironmentSetup from './EnvironmentSetup';

vi.mock('../../../../api/client', () => ({
  daasClient: { post: vi.fn(), get: vi.fn() },
  isDaasSuccess: (response) => response?.status === 200 && response?.data?.response_code === 200,
}));
vi.mock('../../../../components/header', () => ({ default: () => null }));

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  localStorage.setItem('object-id', 'obj1');
});

const renderSetup = () =>
  render(
    <MemoryRouter>
      <EnvironmentSetup />
    </MemoryRouter>,
  );

it('creates the environment before unlocking the finalize step', async () => {
  daasClient.post.mockResolvedValue({ status: 200, data: { response_code: 200 } });
  renderSetup();

  const finalize = screen.getByRole('button', { name: 'Submit and start' });
  expect(finalize).toBeDisabled();

  // The create form comes first; the configuration steps below also use "Submit".
  await userEvent.click(screen.getAllByRole('button', { name: 'Submit' })[0]);

  expect(daasClient.post).toHaveBeenCalledWith('/phases/environment_create', {
    id: 'obj1',
    name: 'obj1-env',
    dockerfile: '',
  });
  expect(finalize).toBeEnabled();
});
