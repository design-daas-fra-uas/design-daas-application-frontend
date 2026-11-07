import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';

import '../../../../i18n';
import { startObject, stopObject } from './dashboardApi';
import ObjectControls from './ObjectControls';

vi.mock('./dashboardApi', () => ({ startObject: vi.fn(), stopObject: vi.fn(), deleteObject: vi.fn() }));
vi.mock('./navigation', () => ({ navigateLater: vi.fn() }));

const objects = [
  { id_object: 'o1', id_user: 'first', object_state: 'baseimage-final' },
  { id_object: 'o2', id_user: 'second', object_state: 'baseimage-final' },
];
const instances = [{ id_object: 'o2', id_instance: 'i2' }];
// `run` as used by the dashboard: resolves to the request's result.
const run = (name, request) => request();

const renderControls = (reload = vi.fn()) =>
  render(
    <MemoryRouter>
      <ObjectControls objects={objects} instances={instances} run={run} reload={reload} />
    </MemoryRouter>,
  );

beforeEach(() => vi.clearAllMocks());

it('enables the actions once an object is selected; stop only for a running one', async () => {
  renderControls();
  const start = screen.getByRole('button', { name: 'Start' });
  const stop = screen.getByRole('button', { name: 'Stop' });
  expect(start).toBeDisabled();

  await userEvent.selectOptions(screen.getByRole('combobox'), 'o1');
  expect(start).toBeEnabled();
  expect(stop).toBeDisabled();

  await userEvent.selectOptions(screen.getByRole('combobox'), 'o2');
  expect(stop).toBeEnabled();
});

it('stops the selected instance and reloads the dashboard', async () => {
  stopObject.mockResolvedValue({});
  const reload = vi.fn();
  renderControls(reload);

  await userEvent.selectOptions(screen.getByRole('combobox'), 'o2');
  await userEvent.click(screen.getByRole('button', { name: 'Stop' }));

  expect(stopObject).toHaveBeenCalledWith(objects[1], 'i2');
  expect(reload).toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Stop' })).toBeDisabled();
});

it('remembers the viewer URL of a started object', async () => {
  startObject.mockResolvedValue({ instanceId: 'i1', viewerUrl: 'http://viewer/1' });
  renderControls();

  await userEvent.selectOptions(screen.getByRole('combobox'), 'o1');
  await userEvent.click(screen.getByRole('button', { name: 'Start' }));

  expect(localStorage.getItem('connection-env')).toBe('http://viewer/1');
  expect(screen.getByRole('button', { name: 'Stop' })).toBeEnabled();
});
