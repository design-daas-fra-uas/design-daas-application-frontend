import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../i18n';
import ActionForm from './ActionForm';
import { required, text } from './fields';

const OBJECTS = [
  { value: 'contwine', label: 'winecontainer', badge: { key: 'docker-object-shared' } },
  { value: 'contx11', label: 'x11container', badge: { key: 'docker-object-owner', values: { owner: 4 } } },
];

const mountForm = (suggest = () => Promise.resolve(OBJECTS)) => {
  const onSubmit = vi.fn();
  render(<ActionForm id="form" fields={[required(text('id', 'docker-object-id', { suggest }))]} onSubmit={onSubmit} />);
  return { onSubmit, input: screen.getByRole('combobox', { name: 'Object ID' }) };
};

const optionTexts = () => screen.queryAllByRole('option').map((option) => option.textContent);

it('lists the objects with name and owner badge when focused', async () => {
  const { input } = mountForm();
  await userEvent.click(input);

  expect(input).toHaveAttribute('aria-expanded', 'true');
  expect(await screen.findByText('2 of 2 objects')).toBeInTheDocument();
  const [wine, x11] = screen.getAllByRole('option');
  expect(within(wine).getByText('winecontainer')).toBeInTheDocument();
  expect(within(wine).getByText('Shared')).toBeInTheDocument();
  expect(within(x11).getByText('User 4')).toBeInTheDocument();
});

it('filters by ID or name and marks the match', async () => {
  const { input } = mountForm();
  await userEvent.click(input);
  await screen.findAllByRole('option');

  await userEvent.type(input, 'WINE');
  expect(optionTexts()).toHaveLength(1);
  expect(screen.getByRole('option')).toHaveTextContent('contwine');
  expect(screen.getAllByText('wine', { selector: 'mark' })).toHaveLength(2);
  expect(screen.getByText('1 of 2 objects')).toBeInTheDocument();
});

it('picks an option with the keyboard and submits its ID', async () => {
  const { input, onSubmit } = mountForm();
  await userEvent.click(input);
  await screen.findAllByRole('option');

  await userEvent.keyboard('{ArrowDown}{ArrowDown}');
  const active = screen.getAllByRole('option')[1];
  expect(input).toHaveAttribute('aria-activedescendant', active.id);
  await userEvent.keyboard('{Enter}');

  expect(input).toHaveValue('contx11');
  expect(input).toHaveAttribute('aria-expanded', 'false');
  await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
  expect(onSubmit).toHaveBeenCalledWith({ id: 'contx11' }, expect.anything());
});

it('picks an option with the mouse and clears it again', async () => {
  const { input } = mountForm();
  await userEvent.click(input);
  await userEvent.click(await screen.findByText('winecontainer'));
  expect(input).toHaveValue('contwine');

  await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
  expect(input).toHaveValue('');
  expect(input).toHaveFocus();
});

it('keeps an ID that is not listed and says so', async () => {
  const { input } = mountForm();
  await userEvent.click(input);
  await userEvent.type(input, 'notlisted');

  expect(optionTexts()).toHaveLength(0);
  expect(screen.getByRole('status')).toHaveTextContent('No object matches “notlisted”. The ID is used as typed.');
  await userEvent.keyboard('{Escape}');
  expect(input).toHaveAttribute('aria-expanded', 'false');
  expect(input).toHaveValue('notlisted');
});

it('still allows typing when the objects cannot be loaded', async () => {
  const { input } = mountForm(() => Promise.reject(new Error('offline')));
  await userEvent.click(input);

  expect(await screen.findByRole('status')).toHaveTextContent(
    'The objects could not be loaded. You can still type an ID.',
  );
  await userEvent.type(input, 'contx11');
  expect(input).toHaveValue('contx11');
});
