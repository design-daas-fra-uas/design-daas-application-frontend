import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';

import '../../../i18n';
import { addUserGroupToDesktopGroup, getDesktopGroups } from '../../../api/desktopGroups';
import { getDesktops } from '../../../api/desktops';
import { getUserGroups } from '../../../api/userGroups';
import DesktopGroups from './desktopGroups';

vi.mock('../../../api/desktopGroups', () => ({
  getDesktopGroups: vi.fn(),
  createDesktopGroup: vi.fn(),
  addUserGroupToDesktopGroup: vi.fn(),
  deleteDesktopGroup: vi.fn(),
}));
vi.mock('../../../api/desktops', () => ({ getDesktops: vi.fn() }));
vi.mock('../../../api/userGroups', () => ({ getUserGroups: vi.fn() }));
vi.mock('../../../components/header', () => ({ default: () => null }));

beforeEach(() => {
  vi.clearAllMocks();
  getDesktopGroups.mockResolvedValue([
    { id: 1, description: 'Office', desktopIds: [10] },
    { id: 2, description: 'Lab', desktopIds: [] },
  ]);
  getDesktops.mockResolvedValue([{ id: 10, description: 'Win11 desktop', groups: [1] }]);
  getUserGroups.mockResolvedValue([{ id: 5, description: 'Students' }]);
  addUserGroupToDesktopGroup.mockResolvedValue({});
});

const mountPage = () =>
  render(
    <MemoryRouter>
      <DesktopGroups />
    </MemoryRouter>,
  );

it('lists each group with its desktops and named actions', async () => {
  mountPage();
  expect(await screen.findByText('Desktops: Win11 desktop')).toBeInTheDocument();
  expect(screen.getByText('No desktops yet')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Delete: Lab' })).toBeInTheDocument();
});

it('adds a user group only after one is chosen', async () => {
  mountPage();
  await userEvent.click(await screen.findByRole('button', { name: 'Add user group: Office' }));
  const dialog = await screen.findByRole('dialog');
  const select = within(dialog).getByLabelText('Select a user group');
  await within(dialog).findByRole('option', { name: 'Students' });
  expect(select).toHaveValue('');

  await userEvent.selectOptions(select, '5');
  await userEvent.click(within(dialog).getByRole('button', { name: 'Submit' }));
  expect(addUserGroupToDesktopGroup).toHaveBeenCalledWith(1, '5');
});
