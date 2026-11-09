import { Link } from 'react-router';

// "link-daas-design" styled router link (a tile); `icon` is an optional Font Awesome name.
function PageLink({ to, icon, children }) {
  return (
    <Link to={to} className={icon ? 'link-daas-design link-tile' : 'link-daas-design'}>
      <div>
        {icon && <i className={`fa-solid ${icon}`} aria-hidden="true" />}
        <span>{children}</span>
      </div>
    </Link>
  );
}

export default PageLink;
