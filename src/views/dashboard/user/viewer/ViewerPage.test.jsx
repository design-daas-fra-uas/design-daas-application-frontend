import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import '../../../../i18n';
import { daasClient } from '../../../../api/client';
import ViewerPage from './ViewerPage';

vi.mock('../../../../api/client', () => ({
  daasClient: { get: vi.fn(), post: vi.fn() },
  isDaasSuccess: () => true,
}));

const renderPage = (start) =>
  render(
    <MemoryRouter>
      <ViewerPage id="test-viewer" start={start} />
    </MemoryRouter>,
  );

beforeEach(() => {
  vi.clearAllMocks();
  daasClient.get.mockResolvedValue({ data: '<html>viewer</html>' });
});

it('shows a spinner, then loads the viewer page into the frame', async () => {
  let resolve;
  const started = new Promise((r) => (resolve = r));
  renderPage(() => started);
  expect(screen.getByAltText('Loading...')).toBeInTheDocument();

  await act(async () => resolve('http://viewer/1'));

  expect(screen.queryByAltText('Loading...')).not.toBeInTheDocument();
  expect(daasClient.get).toHaveBeenCalledWith('http://viewer/1', { responseType: 'text' });
  expect(screen.getByTitle('DESIGN - Desktop viewer')).toHaveAttribute('srcdoc', '<html>viewer</html>');
});

it('shows an error when starting fails', async () => {
  renderPage(() => Promise.reject(new Error('backend down')));
  // The page's failure message plus the request alert with the reason.
  expect(await screen.findAllByRole('alert')).toHaveLength(2);
  expect(screen.getByText('Starting the viewer: backend down')).toBeInTheDocument();
  expect(daasClient.get).not.toHaveBeenCalled();
});
