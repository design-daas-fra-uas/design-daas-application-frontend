import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';

import '../../../i18n';
import { getQuota } from '../../../api/monitoring';
import QuotaPage from './QuotaPage';

vi.mock('../../../api/monitoring', () => ({ getQuota: vi.fn() }));
vi.mock('../../../components/header', () => ({ default: () => null }));

const quota = {
  source: 'fallback',
  overcommit: false,
  items: [
    { key: 'vms', used: 2, limit: 4, unit: 'count' },
    { key: 'memory', used: 1073741824, limit: 4294967296, unit: 'bytes' },
    { key: 'disk', used: 0, limit: null, unit: 'bytes' },
  ],
};

const renderPage = () =>
  render(
    <MemoryRouter>
      <QuotaPage />
    </MemoryRouter>,
  );

beforeEach(() => vi.clearAllMocks());

it('shows each limit next to the usage', async () => {
  getQuota.mockResolvedValue(quota);
  renderPage();

  expect(await screen.findByText('Virtual machines')).toBeInTheDocument();
  expect(screen.getByText('Default limits for all users (limits.toml).')).toBeInTheDocument();
  expect(screen.getByLabelText('Virtual machines 50 %')).toBeInTheDocument();
  expect(screen.getByText('1.0 GiB')).toBeInTheDocument();
  expect(screen.getByText('4.0 GiB')).toBeInTheDocument();
  expect(screen.getByText('No limit')).toBeInTheDocument();
  expect(screen.queryByText(/Overcommit/)).not.toBeInTheDocument();
});

it('mentions overcommit when it is enabled', async () => {
  getQuota.mockResolvedValue({ ...quota, overcommit: true, source: 'user' });
  renderPage();

  expect(await screen.findByText(/Overcommit is enabled/)).toBeInTheDocument();
  expect(screen.getByText('Your own limits, set by an administrator.')).toBeInTheDocument();
});

it('offers a retry after an error and reloads', async () => {
  getQuota.mockRejectedValueOnce(new Error('down')).mockResolvedValueOnce(quota);
  renderPage();

  await userEvent.click(await screen.findByRole('button', { name: 'Retry' }));

  expect(await screen.findByText('Virtual machines')).toBeInTheDocument();
  expect(getQuota).toHaveBeenCalledTimes(2);
});
