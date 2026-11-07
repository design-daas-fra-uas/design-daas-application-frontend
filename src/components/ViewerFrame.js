import { useEffect, useState } from 'react';

import { daasClient } from '../api/client';
import { createLogger } from '../utils/logger';

const log = createLogger('ViewerFrame');

// Sandboxed iframe for a remote desktop viewer. The viewer page needs the
// user's token, so it is fetched here and rendered via `srcDoc`.
// `request` is `{ url }`; passing a new object reloads the viewer even for the same URL.
function ViewerFrame({ request, id = 'viewer-desktop' }) {
  const [html, setHtml] = useState('');

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
        }
      })
      .catch((error) => log.error('Loading the viewer failed', error));
    return () => {
      active = false;
    };
  }, [request]);

  return (
    <iframe
      id={id}
      title="DESIGN - Desktop viewer"
      sandbox="allow-scripts allow-same-origin"
      name="sandbox"
      srcDoc={html}
    />
  );
}

export default ViewerFrame;
