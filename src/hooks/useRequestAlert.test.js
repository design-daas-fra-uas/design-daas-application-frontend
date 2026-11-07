import { act, renderHook } from '@testing-library/react';

import useRequestAlert from './useRequestAlert';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

it('shows the alert and hides it after the duration', () => {
  const { result } = renderHook(() => useRequestAlert(2000));
  expect(result.current.requestAlert).toEqual({ visible: false, success: false });

  act(() => result.current.showRequestAlert(true));
  expect(result.current.requestAlert).toEqual({ visible: true, success: true });

  act(() => vi.advanceTimersByTime(2000));
  expect(result.current.requestAlert.visible).toBe(false);
});

it('restarts the timer when shown again', () => {
  const { result } = renderHook(() => useRequestAlert(2000));
  act(() => result.current.showRequestAlert(true));
  act(() => vi.advanceTimersByTime(1500));
  act(() => result.current.showRequestAlert(false));
  act(() => vi.advanceTimersByTime(1500));
  expect(result.current.requestAlert).toEqual({ visible: true, success: false });
});

it('clears its timer on unmount', () => {
  const { result, unmount } = renderHook(() => useRequestAlert(2000));
  act(() => result.current.showRequestAlert(true));
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});
