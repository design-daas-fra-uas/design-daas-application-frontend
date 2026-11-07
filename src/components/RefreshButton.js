import { useTranslation } from 'react-i18next';

// Floating "reload data" button in the bottom-right corner.
function RefreshButton({ onClick }) {
  const { t } = useTranslation();

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
