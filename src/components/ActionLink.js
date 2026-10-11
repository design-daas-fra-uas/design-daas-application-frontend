import React from 'react';

// "link-daas-design" styled action button (opens a modal, etc.).
// Use <BackLink> / <PageLink> for navigation.
function ActionLink({ onClick, children }) {
  return (
    <button type="button" className="link-daas-design" onClick={onClick}>
      <div>{children}</div>
    </button>
  );
}

export default ActionLink;
