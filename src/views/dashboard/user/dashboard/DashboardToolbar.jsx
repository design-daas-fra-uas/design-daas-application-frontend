import { useTranslation } from 'react-i18next';

// Floating icon buttons in the bottom-right corner; `buttons` lists
// { position, icon, label, onClick } (position is the CSS class).
function DashboardToolbar({ buttons }) {
  const { t } = useTranslation();
  return buttons.map(({ position, icon, label, onClick }) => (
    <button
      key={position}
      type="button"
      className={`${position} toolbar-button`}
      onClick={onClick}
      aria-label={t(label)}
      title={t(label)}
    >
      <i className={`fa-solid ${icon}`} aria-hidden="true" />
    </button>
  ));
}

export default DashboardToolbar;
