import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';

import '../i18n';
import { reportPermissionDenied } from '../api/denied';
import PermissionDenied from './PermissionDenied';
import PermissionDeniedModal from './PermissionDeniedModal';

const deniedError = (url, data = {}, status = 401) => ({ response: { status }, config: { url, data } });

it('says which action is not permitted and offers retry', async () => {
  const onRetry = vi.fn();
  render(
    <MemoryRouter>
      <PermissionDenied error={deniedError('/phases/baseimage_create', { obj_type: 'vm' }, 403)} onRetry={onRetry} />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { name: 'No permission' })).toBeInTheDocument();
  expect(screen.getByText('You have no permission to create VMs.')).toBeInTheDocument();
  expect(screen.getByText('403 · /phases/baseimage_create')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Back to the dashboard' })).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
  expect(onRetry).toHaveBeenCalledTimes(1);
});

it('uses a given action instead of the request', () => {
  render(
    <MemoryRouter>
      <PermissionDenied actionKey="monitoring" showHome={false} />
    </MemoryRouter>,
  );
  expect(screen.getByText('You have no permission to view the monitoring data.')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Back to the dashboard' })).not.toBeInTheDocument();
});

it('opens the modal for a reported denied action', async () => {
  render(
    <MemoryRouter>
      <PermissionDeniedModal />
    </MemoryRouter>,
  );
  expect(screen.queryByText(/no permission to/)).not.toBeInTheDocument();

  act(() => reportPermissionDenied(deniedError('/phases/baseimage_delete')));

  expect(await screen.findByText('You have no permission to delete this object.')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'OK' }));
});
