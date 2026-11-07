import { useCallback, useEffect, useRef, useState } from 'react';

// Brief inline feedback, e.g. { text: 'request-failed', success: false }.
// `showNotice(notice, { autoHide: true })` hides it after `autoHideMs`;
// the timer is cleaned up on unmount.
export default function useNotice(autoHideMs = 4000) {
  const [notice, setNotice] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const showNotice = useCallback(
    (nextNotice, { autoHide = false } = {}) => {
      clearTimeout(timerRef.current);
      setNotice(nextNotice);
      if (autoHide) {
        timerRef.current = setTimeout(() => setNotice(null), autoHideMs);
      }
    },
    [autoHideMs],
  );

  return [notice, showNotice];
}
