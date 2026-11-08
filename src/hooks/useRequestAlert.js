import { useCallback, useEffect, useRef, useState } from 'react';

const HIDDEN = { visible: false, success: false, message: '' };

// Failures stay longer so their reason can be read.
const FAILURE_DURATION_MS = 6000;

// State for the "request successful / failed" alert shown after an action.
// `showRequestAlert(success, message)` shows it with an optional detail line
// (what was done, or why it failed) and hides it again after `durationMs`
// (at least FAILURE_DURATION_MS for failures); the timer is cleared on unmount.
export default function useRequestAlert(durationMs = 2000) {
  const [requestAlert, setRequestAlert] = useState(HIDDEN);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const hideRequestAlert = useCallback(() => {
    clearTimeout(timerRef.current);
    setRequestAlert(HIDDEN);
  }, []);

  const showRequestAlert = useCallback(
    (success, message = '') => {
      clearTimeout(timerRef.current);
      setRequestAlert({ visible: true, success: Boolean(success), message });
      const duration = success ? durationMs : Math.max(durationMs, FAILURE_DURATION_MS);
      timerRef.current = setTimeout(() => setRequestAlert(HIDDEN), duration);
    },
    [durationMs],
  );

  return { requestAlert, showRequestAlert, hideRequestAlert };
}
