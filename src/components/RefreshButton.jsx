import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

// "Reload data" button: a labelled button for a page header (`inline`), or the
// floating icon in the bottom-right corner.
function RefreshButton({ onClick, inline = false }) {
  const { t } = useTranslation();

  if (inline) {
    return (
      <Button type="button" variant="outline-primary" size="sm" onClick={onClick}>
        <i className="fa-solid fa-arrows-rotate me-2" aria-hidden="true" />
        {t('refresh')}
      </Button>
    );
  }

  return (
    <button
      type="button"
      className="bottom-footer-fix icon-button"
      onClick={onClick}
      aria-label={t('refresh')}
      title={t('refresh')}
    >
      <i className="fa-solid fa-arrows-rotate" aria-hidden="true" />
    </button>
  );
}

export default RefreshButton;
