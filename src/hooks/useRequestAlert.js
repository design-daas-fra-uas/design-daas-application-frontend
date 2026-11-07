import { useCallback, useEffect, useRef, useState } from 'react';

const HIDDEN = { visible: false, success: false };

// State for the short "request successful / failed" banner shown after an
// action. `showRequestAlert(success)` shows it and hides it again after
// `durationMs`; the timer is cleared on unmount.
export default function useRequestAlert(durationMs = 2000) {
  const [requestAlert, setRequestAlert] = useState(HIDDEN);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const hideRequestAlert = useCallback(() => {
    clearTimeout(timerRef.current);
    setRequestAlert(HIDDEN);
  }, []);

  const showRequestAlert = useCallback(
    (success) => {
      clearTimeout(timerRef.current);
      setRequestAlert({ visible: true, success: Boolean(success) });
      timerRef.current = setTimeout(() => setRequestAlert(HIDDEN), durationMs);
    },
    [durationMs],
  );

  return { requestAlert, showRequestAlert, hideRequestAlert };
}
