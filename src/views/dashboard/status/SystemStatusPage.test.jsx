import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';

import '../../../i18n';
import { getSystemStatus } from '../../../api/monitoring';
import SystemStatusPage from './SystemStatusPage';

vi.mock('../../../api/monitoring', () => ({ getSystemStatus: vi.fn() }));
vi.mock('../../../components/header', () => ({ default: () => null }));

const renderPage = () =>
  render(
    <MemoryRouter>
      <SystemStatusPage />
    </MemoryRouter>,
  );

beforeEach(() => vi.clearAllMocks());

it('lists every component with its state', async () => {
  getSystemStatus.mockResolvedValue({
    state: 'down',
    components: [
      { name: 'daas', kind: 'service', state: 'up', detail: 'version 2.0.0' },
      { name: 'auth', kind: 'service', state: 'up', detail: 'actuator health UP' },
      { name: 'daas-0-rabbit', kind: 'container', state: 'down', detail: 'not found' },
      { name: 'odd', kind: 'container', state: 'weird', detail: '' },
    ],
  });
  renderPage();

  await screen.findByText('daas-0-rabbit');
  const row = screen.getAllByRole('row').find((tr) => within(tr).queryByText('daas-0-rabbit'));
  expect(within(row).getByText('down')).toBeInTheDocument();
  expect(screen.getByText('actuator health UP')).toBeInTheDocument();
  expect(screen.getByText('weird')).toBeInTheDocument();
  expect(screen.getByText('Overall:')).toBeInTheDocument();
});

it('reloads with the refresh button', async () => {
  getSystemStatus.mockResolvedValue({ state: 'up', components: [] });
  renderPage();
  await screen.findByText('Overall:');

  await userEvent.click(screen.getByRole('button', { name: 'Refresh' }));

  expect(getSystemStatus).toHaveBeenCalledTimes(2);
});
