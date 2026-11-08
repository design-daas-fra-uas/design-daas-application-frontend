import { act, renderHook } from '@testing-library/react';

import useRequestAlert from './useRequestAlert';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

it('shows the alert and hides it after the duration', () => {
  const { result } = renderHook(() => useRequestAlert(2000));
  expect(result.current.requestAlert).toEqual({ visible: false, success: false, message: '' });

  act(() => result.current.showRequestAlert(true, 'Deleting the object'));
  expect(result.current.requestAlert).toEqual({ visible: true, success: true, message: 'Deleting the object' });

  act(() => vi.advanceTimersByTime(2000));
  expect(result.current.requestAlert.visible).toBe(false);
});

it('keeps a failure visible longer so its reason can be read', () => {
  const { result } = renderHook(() => useRequestAlert(2000));
  act(() => result.current.showRequestAlert(false, 'Only admins may change system objects (403)'));

  act(() => vi.advanceTimersByTime(5999));
  expect(result.current.requestAlert.visible).toBe(true);
  act(() => vi.advanceTimersByTime(1));
  expect(result.current.requestAlert.visible).toBe(false);
});

it('restarts the timer when shown again', () => {
  const { result } = renderHook(() => useRequestAlert(2000));
  act(() => result.current.showRequestAlert(true));
  act(() => vi.advanceTimersByTime(1500));
  act(() => result.current.showRequestAlert(false));
  act(() => vi.advanceTimersByTime(1500));
  expect(result.current.requestAlert).toEqual({ visible: true, success: false, message: '' });
});

it('clears its timer on unmount', () => {
  const { result, unmount } = renderHook(() => useRequestAlert(2000));
  act(() => result.current.showRequestAlert(true));
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});
