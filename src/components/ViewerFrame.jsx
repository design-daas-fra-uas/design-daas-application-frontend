import { useEffect, useState } from 'react';

import { daasClient } from '../api/client';
import { isPermissionDenied } from '../api/denied';
import { createLogger } from '../utils/logger';
import PermissionDenied from './PermissionDenied';

const log = createLogger('ViewerFrame');

// Sandboxed iframe for a remote desktop viewer. The viewer page needs the
// user's token, so it is fetched here and rendered via `srcDoc`.
// `request` is `{ url }`; passing a new object reloads the viewer even for the same URL.
function ViewerFrame({ request, id = 'viewer-desktop' }) {
  const [html, setHtml] = useState('');
  // Request error when the viewer page itself is not permitted
  const [denied, setDenied] = useState(null);

  useEffect(() => {
    if (!request?.url) {
      return undefined;
    }
    let active = true;
    daasClient
      .get(request.url, { responseType: 'text' })
      .then((response) => {
        if (active) {
          setHtml(response.data);
          setDenied(null);
        }
      })
      .catch((error) => {
        log.error('Loading the viewer failed', error);
        if (active && isPermissionDenied(error)) {
          setDenied(error);
        }
      });
    return () => {
      active = false;
    };
  }, [request]);

  if (denied) {
    return <PermissionDenied error={denied} />;
  }

  return (
    <iframe
      id={id}
      title="DESIGN - Desktop viewer"
      // The viewer page (served by the DaaS backend) needs scripts and its own storage.
      // eslint-disable-next-line @eslint-react/dom-no-unsafe-iframe-sandbox
      sandbox="allow-scripts allow-same-origin"
      name="sandbox"
      srcDoc={html}
    />
  );
}

export default ViewerFrame;
