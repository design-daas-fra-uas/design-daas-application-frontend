import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';

import '../i18n';
import { resendRegistrationCode } from '../api/users';
import Registration from './registration';

vi.mock('../api/users', () => ({ resendRegistrationCode: vi.fn(), validateEmail: vi.fn() }));
vi.mock('../components/header', () => ({ default: () => null }));

beforeEach(() => vi.clearAllMocks());

const mountPage = () =>
  render(
    <MemoryRouter>
      <Registration />
    </MemoryRouter>,
  );

it('needs an e-mail before a new code can be requested', () => {
  mountPage();
  expect(screen.getByRole('button', { name: 'Send a new code' })).toBeDisabled();
});

it('requests a new code for the entered e-mail', async () => {
  resendRegistrationCode.mockResolvedValue(undefined);
  mountPage();

  await userEvent.type(screen.getByLabelText('Email'), ' alice@example.com ');
  await userEvent.click(screen.getByRole('button', { name: 'Send a new code' }));

  expect(resendRegistrationCode).toHaveBeenCalledWith('alice@example.com');
  expect(await screen.findByRole('status')).toHaveTextContent('a new code is on its way');
});
