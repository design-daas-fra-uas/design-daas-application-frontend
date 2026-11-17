import useDocumentTitle from '../hooks/useDocumentTitle';
import BackLink from './BackLink';

// Top of every page: Back button on the left, the title (the page's <h1>, also
// used as the browser tab title), and optional actions (buttons) on the right.
// Without `backTo` there is no Back button.
function PageHeader({ title, backTo, actions }) {
  useDocumentTitle(title);

  return (
    <div className="page-header">
      <div className="page-header-back">{backTo && <BackLink to={backTo} />}</div>
      {title ? <h1 className="page-title">{title}</h1> : <span />}
      <div className="page-header-actions">{actions}</div>
    </div>
  );
}

export default PageHeader;
