import React from 'react';
import { Link } from 'react-router-dom';

// "link-daas-design" styled router link; place it inside a grid column.
function PageLink({ to, children }) {
  return (
    <Link to={to} className="link-daas-design">
      <div>{children}</div>
    </Link>
  );
}

export default PageLink;
