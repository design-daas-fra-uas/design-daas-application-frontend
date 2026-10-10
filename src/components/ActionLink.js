import React from 'react';

import { activateOnKey } from '../utils/keyboard';

// Keyboard-accessible, "link-daas-design" styled action (opens a modal, etc.).
// Use <BackLink> / <Link> for navigation.
function ActionLink({ onClick, children }) {
  return (
    <div className="link-daas-design" role="button" tabIndex={0} onClick={onClick} onKeyDown={activateOnKey(onClick)}>
      <div>{children}</div>
    </div>
  );
}

export default ActionLink;