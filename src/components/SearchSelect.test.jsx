import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, Formik } from 'formik';

import '../i18n';
import { SearchSelectField } from './SearchSelect';

const OPTIONS = [
  { value: '1', label: 'get_quota', hint: 'Returns the limits' },
  { value: '2', label: 'vm_start', hint: 'Starts a VM' },
  { value: '3', label: 'vm_stop', hint: 'Stops a VM' },
];

const mount = ({ multiple = false, initial = multiple ? [] : '' } = {}) => {
  const onSubmit = vi.fn();
  render(
    <Formik initialValues={{ pick: initial }} onSubmit={onSubmit}>
      <Form>
        <SearchSelectField name="pick" label="Pick" options={OPTIONS} multiple={multiple} />
        <button type="submit">Save</button>
      </Form>
    </Formik>,
  );
  return { onSubmit, input: screen.getByRole('combobox', { name: 'Pick' }) };
};

const optionTexts = () => screen.queryAllByRole('option').map((option) => option.textContent);
const submittedValue = (onSubmit) => onSubmit.mock.calls[0][0].pick;

it('filters by name or description', async () => {
  const { input } = mount();
  await userEvent.click(input);
  expect(screen.getByText('3 of 3')).toBeInTheDocument();

  await userEvent.type(input, 'vm');
  expect(optionTexts()).toHaveLength(2);
  await userEvent.clear(input);
  await userEvent.type(input, 'limits');
  expect(optionTexts()).toEqual(['get_quotaReturns the limits']);
});

it('picks one option, then shows its name in the closed input', async () => {
  const { input, onSubmit } = mount();
  await userEvent.click(input);
  await userEvent.type(input, 'stop');
  await userEvent.keyboard('{Enter}');

  expect(input).toHaveAttribute('aria-expanded', 'false');
  expect(input).toHaveValue('vm_stop');
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(submittedValue(onSubmit)).toBe('3');
});

it('says when nothing matches', async () => {
  const { input } = mount();
  await userEvent.click(input);
  await userEvent.type(input, 'zzz');
  expect(screen.getByRole('status')).toHaveTextContent('Nothing matches “zzz”.');
});

it('selects several options, all shown ones at once, and removes chips', async () => {
  const { input, onSubmit } = mount({ multiple: true });
  await userEvent.click(input);
  await userEvent.click(screen.getByRole('option', { name: /get_quota/ }));
  expect(input).toHaveAttribute('aria-expanded', 'true');

  await userEvent.type(input, 'vm_');
  await userEvent.click(screen.getByRole('button', { name: 'Select all shown' }));
  expect(screen.getByRole('list', { name: '3 selected' })).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: 'Remove: vm_start' }));
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(submittedValue(onSubmit)).toEqual(['1', '3']);
});
