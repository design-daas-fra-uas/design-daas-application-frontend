import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../i18n';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const mountModal = (onConfirm) => {
  const onHide = vi.fn();
  const onDeleted = vi.fn();
  render(
    <ConfirmDeleteModal
      show
      onHide={onHide}
      title="Delete user"
      message="Really?"
      onConfirm={onConfirm}
      onDeleted={onDeleted}
    />,
  );
  return { onHide, onDeleted };
};

it('deletes, closes and reports success', async () => {
  const onConfirm = vi.fn().mockResolvedValue(undefined);
  const { onHide, onDeleted } = mountModal(onConfirm);

  await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

  expect(onConfirm).toHaveBeenCalledTimes(1);
  expect(onHide).toHaveBeenCalled();
  expect(onDeleted).toHaveBeenCalled();
});

it("stays open and shows the backend's reason on a 409", async () => {
  const onConfirm = vi.fn().mockRejectedValue({
    response: { status: 409, data: { message: 'The last admin cannot be deleted' } },
  });
  const { onHide, onDeleted } = mountModal(onConfirm);

  await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

  expect(await screen.findByRole('alert')).toHaveTextContent('The last admin cannot be deleted');
  expect(onHide).not.toHaveBeenCalled();
  expect(onDeleted).not.toHaveBeenCalled();
});

it('cancels without deleting', async () => {
  const onConfirm = vi.fn();
  const { onHide } = mountModal(onConfirm);

  await userEvent.click(screen.getByRole('button', { name: 'No' }));

  expect(onConfirm).not.toHaveBeenCalled();
  expect(onHide).toHaveBeenCalled();
});
