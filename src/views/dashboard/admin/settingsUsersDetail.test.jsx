import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';

import '../../../i18n';
import { deleteUserData } from '../../../api/daasAdmin';
import { DaasRequestError } from '../../../api/phases';
import { deleteUser, getUser } from '../../../api/users';
import SettingsUsersDetail from './settingsUsersDetail';

vi.mock('../../../api/users', () => ({
  getUser: vi.fn(),
  deleteUser: vi.fn(),
  updateUser: vi.fn(),
  enableUser: vi.fn(),
  disableUser: vi.fn(),
}));
vi.mock('../../../api/daasAdmin', () => ({ deleteUserData: vi.fn() }));
vi.mock('../../../components/header', () => ({ default: () => null }));

beforeEach(() => {
  vi.clearAllMocks();
  getUser.mockResolvedValue({ id: 7, name: 'Alice', email: 'alice@example.com', enabled: true });
});

const mountPage = () =>
  render(
    <MemoryRouter initialEntries={['/dashboard/admin/settings/users/7']}>
      <Routes>
        <Route path="/dashboard/admin/settings/users/:id" element={<SettingsUsersDetail />} />
        <Route path="/dashboard/admin/settings/users" element={<p>User list</p>} />
      </Routes>
    </MemoryRouter>,
  );

const confirmDelete = async () => {
  await userEvent.click(await screen.findByRole('button', { name: 'Delete' }));
  const dialog = await screen.findByRole('dialog');
  await userEvent.click(within(dialog).getByRole('button', { name: 'Delete' }));
};

it('loads only the requested user', async () => {
  mountPage();
  expect(await screen.findByText(/alice@example.com/)).toBeInTheDocument();
  expect(getUser).toHaveBeenCalledWith('7', expect.anything());
});

it('deletes the DaaS data first, then the account, then returns to the list', async () => {
  deleteUserData.mockResolvedValue({});
  deleteUser.mockResolvedValue(undefined);
  mountPage();

  await confirmDelete();

  expect(await screen.findByText('User list')).toBeInTheDocument();
  expect(deleteUserData).toHaveBeenCalledWith(7);
  expect(deleteUser).toHaveBeenCalledWith(7);
  expect(deleteUserData.mock.invocationCallOrder[0]).toBeLessThan(deleteUser.mock.invocationCallOrder[0]);
});

it('keeps the account and shows the reason when the DaaS cleanup fails', async () => {
  deleteUserData.mockRejectedValue(
    new DaasRequestError('/admin/delete_user_data', {
      status: 200,
      data: { response_code: 400, sys_log: 'VM 105 could not be deleted' },
    }),
  );
  mountPage();

  await confirmDelete();

  expect(await screen.findByRole('alert')).toHaveTextContent('VM 105 could not be deleted');
  expect(deleteUser).not.toHaveBeenCalled();
});
