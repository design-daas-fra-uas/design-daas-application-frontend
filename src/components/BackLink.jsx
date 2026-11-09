import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

// "Back" button shown at the top left of a page (see PageHeader).
function BackLink({ to }) {
  const { t } = useTranslation();

  return (
    <Link to={to} className="back-link">
      <i className="fa-solid fa-arrow-left" aria-hidden="true" />
      <span>{t('back-link')}</span>
    </Link>
  );
}

export default BackLink;
