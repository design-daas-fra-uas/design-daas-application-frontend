import { useCallback, useEffect, useRef, useState } from 'react';

// Brief inline feedback, e.g. { text: 'request-failed', success: false }.
// Auto-hides after `autoHideMs` when requested and cleans up on unmount.
export default function useNotice(autoHideMs = 4000) {
  const [notice, setNotice] = useState(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const showNotice = useCallback(
    (nextNotice, autoHide) => {
      clearTimeout(timer.current);
      setNotice(nextNotice);
      if (autoHide) {
        timer.current = setTimeout(() => setNotice(null), autoHideMs);
      }
    },
    [autoHideMs]
  );

  return [notice, showNotice];
}
