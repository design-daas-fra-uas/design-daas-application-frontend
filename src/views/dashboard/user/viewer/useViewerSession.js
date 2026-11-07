import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import useRequestAlert from '../../../../hooks/useRequestAlert';
import { ROUTES } from '../../../../routes';
import { createLogger } from '../../../../utils/logger';

const log = createLogger('ViewerSession');

const REDIRECT_AFTER_FAILURE_MS = 5000;

// Runs `start` once on mount. `start` resolves to the viewer URL to show (or
// nothing, if there is nothing to show). On failure an error is shown and the
// user is sent back to the dashboard after a few seconds.
export default function useViewerSession(start) {
  const navigate = useNavigate();
  const { requestAlert, showRequestAlert } = useRequestAlert();
  const [session, setSession] = useState({ status: 'loading', viewerRequest: null });

  useEffect(() => {
    let active = true;
    let redirectTimer;

    Promise.resolve()
      .then(start)
      .then((url) => {
        if (!active) return;
        setSession({ status: 'ready', viewerRequest: url ? { url } : null });
        if (url) showRequestAlert(true);
      })
      .catch((error) => {
        if (!active) return;
        log.error('Starting the viewer failed', error);
        showRequestAlert(false);
        setSession({ status: 'failed', viewerRequest: null });
        redirectTimer = setTimeout(() => navigate(ROUTES.dashboard), REDIRECT_AFTER_FAILURE_MS);
      });

    return () => {
      active = false;
      clearTimeout(redirectTimer);
    };
    // `start` describes what to open when the page is entered; it is read once.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- start once on mount
  }, []);

  return { ...session, requestAlert };
}

// Returns the viewer URL cached under `storageKey`, or obtains one with
// `start` and caches it, so reloading the page reconnects instead of starting again.
export const cachedViewer = (storageKey, start) => {
  const cached = localStorage.getItem(storageKey);
  if (cached || !start) {
    return Promise.resolve(cached);
  }
  return start().then((url) => {
    localStorage.setItem(storageKey, url);
    return url;
  });
};
