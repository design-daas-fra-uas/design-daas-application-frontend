import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';

import '../../../i18n';
import { getSession } from '../../../api/session';
import { fetchDashboardInfo } from './dashboard/dashboardApi';
import MainUser from './mainUser';

vi.mock('../../../api/session', () => ({ getSession: vi.fn() }));
vi.mock('./dashboard/dashboardApi', () => ({ fetchDashboardInfo: vi.fn() }));
vi.mock('../../../components/header', () => ({ default: () => null }));

const app = (id, owner, name) => ({ id_app: id, id_owner: owner, name, os_type: 'l26', id_file: '', id_template: '' });

const info = {
  utilized_ressources: { object_vms: 1, object_images: 0, objects: 1 },
  available_ressources: { vm_max: 2, container_max: -1, obj_max: 5 },
  available_objects: [],
  available_environments: [],
  available_instances: [],
  available_connections: [],
  available_applications: [app('a1', 7, 'My editor'), app('a2', 0, 'Shared office'), app('a3', 9, 'Foreign app')],
  available_files: [],
};

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  getSession.mockResolvedValue({ user_id: 7, name: 'me' });
  fetchDashboardInfo.mockResolvedValue(info);
});

const renderDashboard = () =>
  render(
    <MemoryRouter>
      <MainUser />
    </MemoryRouter>,
  );

it('loads the session first, then shows usage and only the own applications', async () => {
  renderDashboard();

  expect(await screen.findByText('My editor')).toBeInTheDocument();
  expect(localStorage.getItem('userDataID')).toBe('7');
  expect(screen.getByText(/1\/2 \(Max\)/)).toBeInTheDocument();
  expect(screen.queryByText('Shared office')).not.toBeInTheDocument();
  expect(screen.queryByText('Foreign app')).not.toBeInTheDocument();
});

it('narrows the own applications by search and widens them again', async () => {
  renderDashboard();
  const search = await screen.findByRole('searchbox');

  await userEvent.type(search, 'zzz');
  expect(screen.queryByText('My editor')).not.toBeInTheDocument();

  await userEvent.clear(search);
  expect(screen.getByText('My editor')).toBeInTheDocument();
});

it('reloads the dashboard from the toolbar', async () => {
  renderDashboard();
  await screen.findByText('My editor');

  await userEvent.click(screen.getByRole('button', { name: 'Refresh' }));
  expect(fetchDashboardInfo).toHaveBeenCalledTimes(2);
});
