import BackLink from './BackLink';

// Top of every page: Back button on the left, the title, and optional
// actions (buttons) on the right. Without `backTo` there is no Back button.
function PageHeader({ title, backTo, actions }) {
  return (
    <div className="page-header">
      <div className="page-header-back">{backTo && <BackLink to={backTo} />}</div>
      <h2 className="page-title">{title}</h2>
      <div className="page-header-actions">{actions}</div>
    </div>
  );
}

export default PageHeader;
