import { useTranslation } from 'react-i18next';

// Floating icon buttons in the bottom-right corner (a bar along the bottom on
// phones); `buttons` lists { name, icon, label, onClick }.
function DashboardToolbar({ buttons }) {
  const { t } = useTranslation();
  return (
    <nav className="dashboard-toolbar" aria-label={t('dashboard-actions', 'Dashboard actions')}>
      {buttons.map(({ name, icon, label, onClick }) => (
        <button
          key={name}
          type="button"
          className="toolbar-button"
          onClick={onClick}
          aria-label={t(label)}
          title={t(label)}
        >
          <i className={`fa-solid ${icon}`} aria-hidden="true" />
        </button>
      ))}
    </nav>
  );
}

export default DashboardToolbar;
